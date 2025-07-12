const Order = require('../models/Order');
const emailService = require('../services/emailService');
const whatsappService = require('../services/whatsappService');

const orderController = {
  async placeOrder(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { items, total, shipping } = req.body;
      if (!userId || !items || isNaN(total)) return res.status(400).json({ success: false, message: 'Missing fields' });

      const order = await Order.createOrder(userId, { items, total, shipping });

      // Send order confirmation email if customer email is provided
      if (order.customer_email) {
        try {
          await emailService.sendOrderConfirmation(order);
        } catch (emailError) {
          console.error('Failed to send order confirmation email:', emailError);
          // Don't fail the order if email fails
        }
      }

      // Send WhatsApp order confirmation if customer phone is provided
      if (order.customer_phone && process.env.ENABLE_WHATSAPP_ORDER_CONFIRMATIONS === 'true') {
        try {
          await whatsappService.sendOrderConfirmation(order, order.customer_phone, order.language || 'ar');
        } catch (whatsappError) {
          console.error('Failed to send WhatsApp order confirmation:', whatsappError);
          // Don't fail the order if WhatsApp fails
        }
      }

      res.status(201).json({ success: true, data: order });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
  async getOrdersByUser(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      if (!userId) return res.status(400).json({ success: false, message: 'User ID required' });
      const orders = await Order.getOrdersByUser(userId);
      res.json({ success: true, data: orders });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
  async getAllOrders(req, res) {
    try {
      const orders = await Order.getAllOrders();
      res.json({ success: true, data: orders });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status, notes, trackingNumber, estimatedDelivery } = req.body;
      const updatedBy = req.user?.id;

      if (!orderId || !status) {
        return res.status(400).json({ success: false, message: 'Order ID and status are required' });
      }

      const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const order = await Order.updateOrderStatus(orderId, status, notes, updatedBy, trackingNumber, estimatedDelivery);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Send status update email if customer email is provided
      if (order.customer_email) {
        try {
          await emailService.sendOrderStatusUpdate(order, status, notes);
        } catch (emailError) {
          console.error('Failed to send order status update email:', emailError);
          // Don't fail the update if email fails
        }
      }

      // Send WhatsApp order tracking update if customer phone is provided
      if (order.customer_phone && process.env.ENABLE_WHATSAPP_ORDER_TRACKING === 'true') {
        try {
          await whatsappService.sendOrderTracking(order, order.customer_phone, status, order.language || 'ar');
        } catch (whatsappError) {
          console.error('Failed to send WhatsApp order tracking update:', whatsappError);
          // Don't fail the update if WhatsApp fails
        }
      }

      res.json({ success: true, data: order });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  async getOrderStatusHistory(req, res) {
    try {
      const { orderId } = req.params;
      if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
      }

      const history = await Order.getOrderStatusHistory(orderId);
      res.json({ success: true, data: history });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  async trackOrder(req, res) {
    try {
      const { trackingNumber } = req.params;
      if (!trackingNumber) {
        return res.status(400).json({ success: false, message: 'Tracking number is required' });
      }

      const order = await Order.getOrderByTrackingNumber(trackingNumber);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found with this tracking number' });
      }

      res.json({ success: true, data: order });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
  async deleteOrder(req, res) {
    try {
      const { orderId } = req.params;
      const deleted = await Order.deleteOrder(orderId);
      res.json({ success: true, deleted });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  }
};

module.exports = orderController;
