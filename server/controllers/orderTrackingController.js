const { pool } = require('../config/db');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const whatsappService = require('../services/whatsappService');

class OrderTrackingController {
  // Generate a tracking number
  static generateTrackingNumber() {
    const prefix = 'DJ';
    const timestamp = Date.now().toString().slice(-8);
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Update order status with enhanced notifications
  static async updateOrderStatus(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { orderId } = req.params;
      const {
        status,
        notes,
        trackingNumber,
        estimatedDelivery,
        notificationPreferences = { email: true, sms: true, whatsapp: true }
      } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      // Valid status values
      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      // Check if order exists and get order details
      const [orders] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
               u.language_preference, u.notification_preferences
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const order = orders[0];

      // Generate tracking number if not provided and status is shipped or later
      const finalTrackingNumber = trackingNumber ||
        ((['shipped', 'out_for_delivery', 'delivered'].includes(status) && !order.tracking_number)
          ? OrderTrackingController.generateTrackingNumber()
          : order.tracking_number);

      // Update order with new status and tracking info
      await pool.promise().execute(`
        UPDATE orders
        SET status = ?, tracking_number = ?, estimated_delivery = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, finalTrackingNumber, estimatedDelivery, orderId]);

      // Add tracking history entry
      await pool.promise().execute(`
        INSERT INTO order_tracking_history (order_id, status, notes, created_by, created_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [orderId, status, notes || `Order status updated to ${status}`, req.user.id]);

      // Prepare notification data
      const notificationData = {
        orderId: order.id,
        customerName: order.customer_name || order.user_name || 'Customer',
        customerEmail: order.customer_email || order.user_email,
        customerPhone: order.customer_phone || order.user_phone,
        status,
        trackingNumber: finalTrackingNumber,
        estimatedDelivery,
        total: order.total_amount,
        language: order.language_preference || 'ar'
      };

      // Send notifications based on preferences
      const userNotificationPrefs = order.notification_preferences
        ? JSON.parse(order.notification_preferences)
        : notificationPreferences;

      await OrderTrackingController.sendOrderNotifications(notificationData, userNotificationPrefs);

      // Get updated order with tracking history
      const updatedOrder = await OrderTrackingController.getOrderWithHistory(orderId);

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });

    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating order status'
      });
    }
  }

  // Send comprehensive order notifications
  static async sendOrderNotifications(notificationData, preferences = {}) {
    const { customerEmail, customerPhone, status, language } = notificationData;

    try {
      // Send Email notification
      if (preferences.email !== false && customerEmail) {
        try {
          if (status === 'confirmed') {
            await emailService.sendOrderConfirmationEmail(notificationData);
          } else {
            await emailService.sendOrderStatusUpdateEmail(notificationData);
          }
          console.log(`✅ Email notification sent for order ${notificationData.orderId}`);
        } catch (error) {
          console.error('❌ Email notification failed:', error);
        }
      }

      // Send SMS notification
      if (preferences.sms !== false && customerPhone) {
        try {
          let smsMessage;
          if (status === 'confirmed') {
            smsMessage = smsService.getOrderConfirmationSMS(notificationData, language);
          } else if (status === 'out_for_delivery') {
            smsMessage = smsService.getDeliveryNotificationSMS(notificationData, language);
          } else {
            smsMessage = smsService.getOrderStatusUpdateSMS(notificationData, language);
          }

          await smsService.sendSMS(customerPhone, smsMessage, language);
          console.log(`✅ SMS notification sent for order ${notificationData.orderId}`);
        } catch (error) {
          console.error('❌ SMS notification failed:', error);
        }
      }

      // Send WhatsApp notification
      if (preferences.whatsapp !== false && customerPhone) {
        try {
          await whatsappService.sendOrderNotification(notificationData);
          console.log(`✅ WhatsApp notification sent for order ${notificationData.orderId}`);
        } catch (error) {
          console.error('❌ WhatsApp notification failed:', error);
        }
      }

    } catch (error) {
      console.error('❌ Error sending notifications:', error);
    }
  }

  // Get order with complete tracking history
  static async getOrderWithHistory(orderId) {
    try {
      // Get order details
      const [orderRows] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

      if (orderRows.length === 0) {
        return null;
      }

      const order = orderRows[0];

      // Get order items
      const [itemRows] = await pool.promise().execute(`
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [orderId]);

      // Get tracking history
      const [historyRows] = await pool.promise().execute(`
        SELECT th.*, u.name as updated_by_name
        FROM order_tracking_history th
        LEFT JOIN users u ON th.created_by = u.id
        WHERE th.order_id = ?
        ORDER BY th.created_at DESC
      `, [orderId]);

      return {
        ...order,
        items: itemRows,
        tracking_history: historyRows,
        estimated_delivery_formatted: order.estimated_delivery
          ? new Date(order.estimated_delivery).toLocaleDateString('ar-MA')
          : null
      };

    } catch (error) {
      console.error('Error getting order with history:', error);
      throw error;
    }
  }

  // Track order by tracking number or order ID
  static async trackOrder(req, res) {
    try {
      const { identifier } = req.params;
      const { email } = req.query;

      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: 'Order ID or tracking number is required'
        });
      }

      // Search by order ID or tracking number
      let query = `
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE (o.id = ? OR o.tracking_number = ?)
      `;
      let params = [identifier, identifier];

      // If user is not authenticated, require email verification
      if (!req.user && email) {
        query += ` AND (o.customer_email = ? OR u.email = ?)`;
        params.push(email, email);
      } else if (!req.user && !email) {
        return res.status(400).json({
          success: false,
          message: 'Email address is required for order tracking'
        });
      } else if (req.user) {
        // If user is authenticated, only show their orders
        query += ` AND o.user_id = ?`;
        params.push(req.user.id);
      }

      const [orderRows] = await pool.promise().execute(query, params);

      if (orderRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or email does not match'
        });
      }

      const order = orderRows[0];
      const orderWithHistory = await OrderTrackingController.getOrderWithHistory(order.id);

      res.json({
        success: true,
        data: orderWithHistory
      });

    } catch (error) {
      console.error('Error tracking order:', error);
      res.status(500).json({
        success: false,
        message: 'Error tracking order'
      });
    }
  }

  // Get all orders for admin with tracking info
  static async getAllOrdersWithTracking(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const status = req.query.status;
      const offset = (page - 1) * limit;

      let whereClause = '';
      let params = [];

      if (status) {
        whereClause = 'WHERE o.status = ?';
        params.push(status);
      }

      const [orderRows] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
               COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        ${whereClause}
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset]);

      // Get total count
      const [countRows] = await pool.promise().execute(`
        SELECT COUNT(DISTINCT o.id) as total
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ${whereClause}
      `, params);

      const total = countRows[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          orders: orderRows,
          pagination: {
            currentPage: page,
            totalPages,
            totalOrders: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });

    } catch (error) {
      console.error('Error getting orders with tracking:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving orders'
      });
    }
  }

  // Update user notification preferences
  static async updateNotificationPreferences(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { email, sms, whatsapp } = req.body;

      const preferences = {
        email: email !== false,
        sms: sms !== false,
        whatsapp: whatsapp !== false
      };

      await pool.promise().execute(`
        UPDATE users
        SET notification_preferences = ?
        WHERE id = ?
      `, [JSON.stringify(preferences), req.user.id]);

      res.json({
        success: true,
        message: 'Notification preferences updated successfully',
        data: preferences
      });

    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating preferences'
      });
    }
  }

  // Get all possible order statuses
  static async getOrderStatuses(req, res) {
    try {
      const statuses = [
        { value: 'pending', label: 'Pending', description: 'Order received and awaiting confirmation' },
        { value: 'confirmed', label: 'Confirmed', description: 'Order confirmed and being prepared' },
        { value: 'processing', label: 'Processing', description: 'Order is being processed' },
        { value: 'shipped', label: 'Shipped', description: 'Order has been shipped' },
        { value: 'out_for_delivery', label: 'Out for Delivery', description: 'Order is out for delivery' },
        { value: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
        { value: 'cancelled', label: 'Cancelled', description: 'Order has been cancelled' }
      ];

      res.json({
        success: true,
        data: statuses
      });
    } catch (error) {
      console.error('Error getting order statuses:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving order statuses'
      });
    }
  }

  // Batch update multiple orders
  static async batchUpdateOrders(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { orderIds, status, notes } = req.body;

      if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order IDs array is required'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }

      const placeholders = orderIds.map(() => '?').join(',');
      const updateQuery = `
        UPDATE orders
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${placeholders})
      `;

      await pool.execute(updateQuery, [status, ...orderIds]);

      // Update order history for each order
      for (const orderId of orderIds) {
        await pool.execute(`
          INSERT INTO order_status_history (order_id, status, notes, changed_by, changed_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [orderId, status, notes || `Batch updated to ${status}`, req.user.id]);
      }

      res.json({
        success: true,
        message: `Successfully updated ${orderIds.length} orders to ${status}`,
        data: {
          updatedCount: orderIds.length,
          status: status
        }
      });

    } catch (error) {
      console.error('Error batch updating orders:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating orders'
      });
    }
  }
}

module.exports = OrderTrackingController;
