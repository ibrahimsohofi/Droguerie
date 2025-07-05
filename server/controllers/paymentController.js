const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

const paymentController = {
  // Create payment intent
  async createPaymentIntent(req, res) {
    try {
      const { amount, currency = 'mad', orderData } = req.body;

      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid amount is required'
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          order_type: 'droguerie_purchase',
          customer_email: orderData?.customer_email || '',
          customer_name: orderData?.customer_name || ''
        }
      });

      res.json({
        success: true,
        data: {
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id
        }
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment intent',
        error: error.message
      });
    }
  },

  // Confirm payment and create order
  async confirmPayment(req, res) {
    try {
      const { payment_intent_id, orderData } = req.body;

      if (!payment_intent_id) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required'
        });
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          success: false,
          message: 'Payment has not been completed successfully'
        });
      }

      // Create order in database
      const order = await Order.create({
        userId: req.user?.id || null,
        orderData: {
          ...orderData,
          payment_method: 'card',
          payment_intent_id: payment_intent_id,
          payment_status: 'completed',
          total: paymentIntent.amount / 100 // Convert back from cents
        }
      });

      res.json({
        success: true,
        message: 'Payment confirmed and order created successfully',
        data: order
      });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to confirm payment',
        error: error.message
      });
    }
  },

  // Handle webhook from Stripe
  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);

        // Update order status if needed
        try {
          await Order.updatePaymentStatus(paymentIntent.id, 'completed');
        } catch (error) {
          console.error('Error updating order payment status:', error);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);

        // Update order status
        try {
          await Order.updatePaymentStatus(failedPayment.id, 'failed');
        } catch (error) {
          console.error('Error updating failed payment status:', error);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  },

  // Get payment methods (for future expansion)
  async getPaymentMethods(req, res) {
    try {
      const methods = [
        {
          id: 'card',
          name: 'Credit/Debit Card',
          name_ar: 'بطاقة ائتمان/خصم',
          name_fr: 'Carte de crédit/débit',
          enabled: true,
          icon: 'credit-card'
        },
        {
          id: 'cash',
          name: 'Cash on Delivery',
          name_ar: 'الدفع عند الاستلام',
          name_fr: 'Paiement à la livraison',
          enabled: true,
          icon: 'banknote'
        }
      ];

      res.json({
        success: true,
        data: methods
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get payment methods',
        error: error.message
      });
    }
  },

  // Refund payment
  async refundPayment(req, res) {
    try {
      const { payment_intent_id, amount, reason } = req.body;

      if (!payment_intent_id) {
        return res.status(400).json({
          success: false,
          message: 'Payment intent ID is required'
        });
      }

      const refund = await stripe.refunds.create({
        payment_intent: payment_intent_id,
        amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
        reason: reason || 'requested_by_customer'
      });

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refund_id: refund.id,
          amount: refund.amount / 100,
          status: refund.status
        }
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process refund',
        error: error.message
      });
    }
  }
};

module.exports = paymentController;
