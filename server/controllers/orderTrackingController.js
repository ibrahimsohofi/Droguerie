const { pool } = require('../config/db');
const crypto = require('crypto');

class OrderTrackingController {
  // Generate a tracking number
  static generateTrackingNumber() {
    const prefix = 'DJ';
    const timestamp = Date.now().toString().slice(-8);
    const random = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Update order status and add to history
  static async updateOrderStatus(req, res) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const { orderId } = req.params;
      const { status, notes, trackingNumber, estimatedDelivery } = req.body;

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

      // Check if order exists
      const [orders] = await pool.promise().execute(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const order = orders[0];

      // Generate tracking number if status is shipped and no tracking number provided
      let finalTrackingNumber = trackingNumber;
      if (status === 'shipped' && !finalTrackingNumber && !order.tracking_number) {
        finalTrackingNumber = OrderTrackingController.generateTrackingNumber();
      }

      // Update order status
      const updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
      const updateValues = [status];

      if (finalTrackingNumber) {
        updateFields.push('tracking_number = ?');
        updateValues.push(finalTrackingNumber);
      }

      if (estimatedDelivery) {
        updateFields.push('estimated_delivery = ?');
        updateValues.push(estimatedDelivery);
      }

      if (status === 'delivered') {
        updateFields.push('delivered_at = CURRENT_TIMESTAMP');
      }

      updateValues.push(orderId);

      await pool.promise().execute(
        `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Add to order status history
      await pool.promise().execute(
        'INSERT INTO order_status_history (order_id, status, notes, updated_by) VALUES (?, ?, ?, ?)',
        [orderId, status, notes || null, req.user.id]
      );

      // Get updated order with history
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

  // Get order tracking information (public - by tracking number or order ID + email)
  static async getOrderTracking(req, res) {
    try {
      const { identifier } = req.params; // Can be tracking number or order ID
      const { email } = req.query; // Required for non-authenticated users

      let query;
      let params;

      // If user is authenticated, they can access their own orders
      if (req.user) {
        query = `
          SELECT o.*, u.email as user_email
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE (o.id = ? OR o.tracking_number = ?)
          AND (o.user_id = ? OR o.customer_email = ?)
        `;
        params = [identifier, identifier, req.user.id, req.user.email];
      } else {
        // For non-authenticated users, require email verification
        if (!email) {
          return res.status(400).json({
            success: false,
            message: 'Email is required for order tracking'
          });
        }

        query = `
          SELECT o.*, u.email as user_email
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE (o.id = ? OR o.tracking_number = ?)
          AND (o.customer_email = ? OR u.email = ?)
        `;
        params = [identifier, identifier, email, email];
      }

      const [orders] = await pool.promise().execute(query, params);

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or access denied'
        });
      }

      const order = orders[0];

      // Get order items
      const [orderItems] = await pool.promise().execute(
        'SELECT * FROM order_items WHERE order_id = ?',
        [order.id]
      );

      // Get status history
      const [statusHistory] = await pool.promise().execute(`
        SELECT osh.*, u.name as updated_by_name
        FROM order_status_history osh
        LEFT JOIN users u ON osh.updated_by = u.id
        WHERE osh.order_id = ?
        ORDER BY osh.created_at DESC
      `, [order.id]);

      const trackingData = {
        id: order.id,
        trackingNumber: order.tracking_number,
        status: order.status,
        paymentStatus: order.payment_status,
        totalAmount: parseFloat(order.total_amount),
        estimatedDelivery: order.estimated_delivery,
        deliveredAt: order.delivered_at,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        shippingAddress: {
          address: order.shipping_address,
          city: order.shipping_city,
          postalCode: order.shipping_postal_code
        },
        items: orderItems.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.product_name,
          quantity: item.quantity,
          price: parseFloat(item.price)
        })),
        statusHistory: statusHistory.map(history => ({
          status: history.status,
          notes: history.notes,
          updatedBy: history.updated_by_name,
          createdAt: history.created_at
        }))
      };

      res.json({
        success: true,
        data: trackingData
      });

    } catch (error) {
      console.error('Error getting order tracking:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving order tracking information'
      });
    }
  }

  // Get order with history (helper method)
  static async getOrderWithHistory(orderId) {
    const [orders] = await pool.promise().execute(`
      SELECT o.*, u.email as user_email, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];

    // Get order items
    const [orderItems] = await pool.promise().execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    // Get status history
    const [statusHistory] = await pool.promise().execute(`
      SELECT osh.*, u.name as updated_by_name
      FROM order_status_history osh
      LEFT JOIN users u ON osh.updated_by = u.id
      WHERE osh.order_id = ?
      ORDER BY osh.created_at DESC
    `, [orderId]);

    return {
      ...order,
      items: orderItems,
      statusHistory
    };
  }

  // Get order status options
  static async getOrderStatuses(req, res) {
    try {
      const statuses = [
        { value: 'pending', label: 'Pending', color: 'yellow', description: 'Order received and awaiting confirmation' },
        { value: 'confirmed', label: 'Confirmed', color: 'blue', description: 'Order confirmed and payment verified' },
        { value: 'processing', label: 'Processing', color: 'indigo', description: 'Order is being prepared' },
        { value: 'shipped', label: 'Shipped', color: 'purple', description: 'Order has been shipped' },
        { value: 'out_for_delivery', label: 'Out for Delivery', color: 'orange', description: 'Order is out for delivery' },
        { value: 'delivered', label: 'Delivered', color: 'green', description: 'Order has been delivered' },
        { value: 'cancelled', label: 'Cancelled', color: 'red', description: 'Order has been cancelled' }
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

  // Batch update multiple orders (admin only)
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

      const updatedOrders = [];

      for (const orderId of orderIds) {
        try {
          // Generate tracking number if needed
          let trackingNumber = null;
          if (status === 'shipped') {
            const [existing] = await pool.promise().execute(
              'SELECT tracking_number FROM orders WHERE id = ?',
              [orderId]
            );

            if (existing.length > 0 && !existing[0].tracking_number) {
              trackingNumber = OrderTrackingController.generateTrackingNumber();
            }
          }

          // Update order
          const updateFields = ['status = ?', 'updated_at = CURRENT_TIMESTAMP'];
          const updateValues = [status];

          if (trackingNumber) {
            updateFields.push('tracking_number = ?');
            updateValues.push(trackingNumber);
          }

          if (status === 'delivered') {
            updateFields.push('delivered_at = CURRENT_TIMESTAMP');
          }

          updateValues.push(orderId);

          await pool.promise().execute(
            `UPDATE orders SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );

          // Add to history
          await pool.promise().execute(
            'INSERT INTO order_status_history (order_id, status, notes, updated_by) VALUES (?, ?, ?, ?)',
            [orderId, status, notes || `Batch update to ${status}`, req.user.id]
          );

          updatedOrders.push(orderId);
        } catch (error) {
          console.error(`Error updating order ${orderId}:`, error);
          // Continue with other orders
        }
      }

      res.json({
        success: true,
        message: `Successfully updated ${updatedOrders.length} orders`,
        data: {
          updatedOrders,
          status,
          totalRequested: orderIds.length,
          totalUpdated: updatedOrders.length
        }
      });

    } catch (error) {
      console.error('Error batch updating orders:', error);
      res.status(500).json({
        success: false,
        message: 'Error batch updating orders'
      });
    }
  }
}

module.exports = OrderTrackingController;
