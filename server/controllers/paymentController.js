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
  },

  // Handle Cash on Delivery orders
  async createCashOnDeliveryOrder(req, res) {
    try {
      const { orderData, deliveryAddress } = req.body;

      // Validate required fields
      if (!orderData || !deliveryAddress) {
        return res.status(400).json({
          success: false,
          message: 'Order data and delivery address are required'
        });
      }

      // Calculate delivery fee based on city
      const deliveryZones = {
        'Casablanca': 25, 'الدار البيضاء': 25,
        'Rabat': 30, 'الرباط': 30,
        'Salé': 30, 'سلا': 30,
        'Fès': 35, 'فاس': 35,
        'Marrakech': 35, 'مراكش': 35,
        'Agadir': 40, 'أكادير': 40,
        'Tanger': 40, 'طنجة': 40,
        'Meknès': 35, 'مكناس': 35,
        'Oujda': 45, 'وجدة': 45,
        'Kenitra': 35, 'القنيطرة': 35,
        'Tétouan': 40, 'تطوان': 40
      };

      const deliveryFee = deliveryZones[deliveryAddress.city] || 50;
      const subtotal = orderData.total || 0;

      // Free delivery for orders over 300 MAD
      const finalDeliveryFee = subtotal >= 300 ? 0 : deliveryFee;
      const finalTotal = subtotal + finalDeliveryFee;

      // Create order with Cash on Delivery
      const order = await Order.create({
        userId: req.user?.id || null,
        orderData: {
          ...orderData,
          payment_method: 'cod',
          payment_status: 'pending',
          delivery_fee: finalDeliveryFee,
          total: finalTotal,
          delivery_address: deliveryAddress,
          order_status: 'confirmed',
          delivery_instructions: 'Cash on Delivery - Customer will pay upon receiving the order'
        }
      });

      res.json({
        success: true,
        message: 'Cash on Delivery order created successfully',
        data: {
          orderId: order.id,
          total: finalTotal,
          deliveryFee: finalDeliveryFee,
          estimatedDelivery: '2-3 business days',
          paymentMethod: 'Cash on Delivery'
        }
      });
    } catch (error) {
      console.error('Error creating COD order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create Cash on Delivery order',
        error: error.message
      });
    }
  },

  // Handle CIH Bank payment
  async processCIHBankPayment(req, res) {
    try {
      const { orderData, bankDetails } = req.body;

      // In a real implementation, you would integrate with CIH Bank's API
      // For now, we'll simulate the process
      const transactionId = `CIH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate bank processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order with CIH Bank payment
      const order = await Order.create({
        userId: req.user?.id || null,
        orderData: {
          ...orderData,
          payment_method: 'cih_bank',
          payment_status: 'completed',
          transaction_id: transactionId,
          bank_reference: bankDetails?.accountNumber || '',
          order_status: 'confirmed'
        }
      });

      res.json({
        success: true,
        message: 'CIH Bank payment processed successfully',
        data: {
          orderId: order.id,
          transactionId: transactionId,
          paymentMethod: 'CIH Bank',
          status: 'completed'
        }
      });
    } catch (error) {
      console.error('Error processing CIH Bank payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process CIH Bank payment',
        error: error.message
      });
    }
  },

  // Handle BMCE Bank payment
  async processBMCEBankPayment(req, res) {
    try {
      const { orderData, bankDetails } = req.body;

      // In a real implementation, you would integrate with BMCE Bank's API
      const transactionId = `BMCE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate bank processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const order = await Order.create({
        userId: req.user?.id || null,
        orderData: {
          ...orderData,
          payment_method: 'bmce_bank',
          payment_status: 'completed',
          transaction_id: transactionId,
          bank_reference: bankDetails?.accountNumber || '',
          order_status: 'confirmed'
        }
      });

      res.json({
        success: true,
        message: 'BMCE Bank payment processed successfully',
        data: {
          orderId: order.id,
          transactionId: transactionId,
          paymentMethod: 'BMCE Bank',
          status: 'completed'
        }
      });
    } catch (error) {
      console.error('Error processing BMCE Bank payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process BMCE Bank payment',
        error: error.message
      });
    }
  },

  // Handle Wafacash mobile payment
  async processWafacashPayment(req, res) {
    try {
      const { orderData, phoneNumber, pin } = req.body;

      if (!phoneNumber || !pin) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and PIN are required for Wafacash payment'
        });
      }

      // In a real implementation, you would integrate with Wafacash API
      const transactionId = `WAFA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Simulate mobile payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const order = await Order.create({
        userId: req.user?.id || null,
        orderData: {
          ...orderData,
          payment_method: 'wafacash',
          payment_status: 'completed',
          transaction_id: transactionId,
          phone_number: phoneNumber,
          order_status: 'confirmed'
        }
      });

      res.json({
        success: true,
        message: 'Wafacash payment processed successfully',
        data: {
          orderId: order.id,
          transactionId: transactionId,
          paymentMethod: 'Wafacash',
          phoneNumber: phoneNumber,
          status: 'completed'
        }
      });
    } catch (error) {
      console.error('Error processing Wafacash payment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process Wafacash payment',
        error: error.message
      });
    }
  },

  // Get comprehensive payment methods for Morocco
  async getMoroccanPaymentMethods(req, res) {
    try {
      const methods = [
        {
          id: 'cod',
          name: 'Cash on Delivery',
          name_ar: 'الدفع عند التوصيل',
          name_fr: 'Paiement à la livraison',
          enabled: true,
          icon: 'truck',
          popular: true,
          description: {
            ar: 'ادفع نقداً عند استلام طلبك. الطريقة الأكثر أماناً وشعبية في المغرب',
            fr: 'Payez en espèces à la réception de votre commande. Méthode la plus sûre et populaire au Maroc',
            en: 'Pay in cash when you receive your order. Most safe and popular method in Morocco'
          }
        },
        {
          id: 'cih_bank',
          name: 'CIH Bank Morocco',
          name_ar: 'البنك التجاري وفا المغرب - CIH',
          name_fr: 'CIH Bank Maroc',
          enabled: true,
          icon: 'building',
          description: {
            ar: 'الدفع الآمن عبر البنك التجاري وفا المغرب',
            fr: 'Paiement sécurisé via CIH Bank Maroc',
            en: 'Secure payment via CIH Bank Morocco'
          }
        },
        {
          id: 'bmce_bank',
          name: 'BMCE Bank of Africa',
          name_ar: 'بنك المغرب الخارجي - BMCE',
          name_fr: 'BMCE Bank of Africa',
          enabled: true,
          icon: 'building',
          description: {
            ar: 'الدفع عبر بنك المغرب الخارجي',
            fr: 'Paiement via BMCE Bank of Africa',
            en: 'Payment via BMCE Bank of Africa'
          }
        },
        {
          id: 'wafacash',
          name: 'Wafacash Mobile',
          name_ar: 'وفا كاش - Wafacash',
          name_fr: 'Wafacash Mobile',
          enabled: true,
          icon: 'phone',
          description: {
            ar: 'الدفع عبر الهاتف المحمول مع وفا كاش',
            fr: 'Paiement mobile avec Wafacash',
            en: 'Mobile payment with Wafacash'
          }
        },
        {
          id: 'card',
          name: 'Credit/Debit Card',
          name_ar: 'بطاقة ائتمانية / خصم',
          name_fr: 'Carte de crédit/débit',
          enabled: true,
          icon: 'credit-card',
          description: {
            ar: 'ادفع بأمان باستخدام بطاقتك الائتمانية',
            fr: 'Payez en toute sécurité avec votre carte',
            en: 'Pay securely with your credit or debit card'
          }
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
  }
};

module.exports = paymentController;
