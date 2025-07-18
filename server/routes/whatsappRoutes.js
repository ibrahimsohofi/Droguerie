const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Rate limiting for WhatsApp endpoints
const whatsappRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many WhatsApp requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Apply rate limiting to all WhatsApp routes
router.use(whatsappRateLimit);

// Generate WhatsApp link for customer service
router.post('/generate-link', [
  body('message').optional().isLength({ min: 1, max: 500 }).trim(),
  body('language').optional().isIn(['ar', 'fr', 'en']).withMessage('Language must be ar, fr, or en'),
  body('type').optional().isIn(['customer_service', 'product_inquiry', 'order_inquiry']).withMessage('Invalid type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { message, language = 'ar', type = 'customer_service' } = req.body;

    const whatsappLink = whatsappService.generateBusinessWhatsAppLink(message, language);

    res.json({
      success: true,
      whatsappLink,
      businessPhone: whatsappService.businessPhone,
      message: message || 'Default greeting message',
      language,
      type
    });

  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate WhatsApp link',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Generate product sharing link
router.post('/share-product', [
  body('productId').isNumeric().withMessage('Product ID must be a number'),
  body('productName').isLength({ min: 1, max: 200 }).trim().withMessage('Product name is required'),
  body('productPrice').isNumeric().withMessage('Product price must be a number'),
  body('productDescription').optional().isLength({ max: 300 }).trim(),
  body('language').optional().isIn(['ar', 'fr', 'en']).withMessage('Language must be ar, fr, or en')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { productId, productName, productPrice, productDescription, language = 'ar' } = req.body;

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
      description: productDescription
    };

    const shareLink = whatsappService.generateProductShareLink(product, language);

    res.json({
      success: true,
      shareLink,
      product,
      language
    });

  } catch (error) {
    console.error('Error generating product sharing link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate product sharing link',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Send order confirmation via WhatsApp
router.post('/send-order-confirmation', [
  body('orderId').isNumeric().withMessage('Order ID must be a number'),
  body('customerName').isLength({ min: 1, max: 100 }).trim().withMessage('Customer name is required'),
  body('customerPhone').isMobilePhone('ar-MA').withMessage('Valid Moroccan phone number required'),
  body('total').isNumeric().withMessage('Total must be a number'),
  body('paymentMethod').isIn(['cod', 'card', 'bank_transfer']).withMessage('Invalid payment method'),
  body('items').isArray({ min: 1 }).withMessage('Order items are required'),
  body('shippingAddress').isLength({ min: 10, max: 200 }).trim().withMessage('Shipping address is required'),
  body('shippingCity').isLength({ min: 2, max: 50 }).trim().withMessage('Shipping city is required'),
  body('language').optional().isIn(['ar', 'fr', 'en']).withMessage('Language must be ar, fr, or en')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      orderId,
      customerName,
      customerPhone,
      total,
      paymentMethod,
      items,
      shippingAddress,
      shippingCity,
      language = 'ar'
    } = req.body;

    // Format phone number for WhatsApp
    const formattedPhone = whatsappService.formatMoroccanPhoneForWhatsApp(customerPhone);

    if (!formattedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    const orderData = {
      id: orderId,
      customer_name: customerName,
      total,
      payment_method: paymentMethod,
      items,
      shipping_address: shippingAddress,
      shipping_city: shippingCity
    };

    const result = await whatsappService.sendOrderConfirmation(orderData, formattedPhone, language);

    if (result.success) {
      res.json({
        success: true,
        message: 'Order confirmation sent successfully',
        messageId: result.messageId
      });
    } else {
      res.json({
        success: false,
        message: result.message || 'Failed to send WhatsApp message',
        fallbackLink: result.fallbackLink
      });
    }

  } catch (error) {
    console.error('Error sending order confirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order confirmation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Send order tracking update
router.post('/send-order-tracking', [
  body('orderId').isNumeric().withMessage('Order ID must be a number'),
  body('customerName').isLength({ min: 1, max: 100 }).trim().withMessage('Customer name is required'),
  body('customerPhone').isMobilePhone('ar-MA').withMessage('Valid Moroccan phone number required'),
  body('status').isIn(['confirmed', 'preparing', 'shipped', 'out_for_delivery', 'delivered']).withMessage('Invalid order status'),
  body('language').optional().isIn(['ar', 'fr', 'en']).withMessage('Language must be ar, fr, or en')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      orderId,
      customerName,
      customerPhone,
      status,
      language = 'ar'
    } = req.body;

    // Format phone number for WhatsApp
    const formattedPhone = whatsappService.formatMoroccanPhoneForWhatsApp(customerPhone);

    if (!formattedPhone) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    const orderData = {
      id: orderId,
      customer_name: customerName
    };

    const result = await whatsappService.sendOrderTracking(orderData, formattedPhone, status, language);

    if (result.success) {
      res.json({
        success: true,
        message: 'Order tracking update sent successfully',
        messageId: result.messageId
      });
    } else {
      res.json({
        success: false,
        message: result.message || 'Failed to send WhatsApp message',
        fallbackLink: result.fallbackLink
      });
    }

  } catch (error) {
    console.error('Error sending order tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send order tracking update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get customer service templates
router.get('/templates/:language?', async (req, res) => {
  try {
    const language = req.params.language || 'ar';

    if (!['ar', 'fr', 'en'].includes(language)) {
      return res.status(400).json({
        success: false,
        message: 'Language must be ar, fr, or en'
      });
    }

    const templates = whatsappService.getCustomerServiceTemplates(language);
    const businessInfo = whatsappService.getBusinessContactInfo(language);

    res.json({
      success: true,
      templates: templates[language],
      businessInfo,
      language
    });

  } catch (error) {
    console.error('Error getting customer service templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get templates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Validate phone number
router.post('/validate-phone', [
  body('phone').isLength({ min: 9, max: 15 }).withMessage('Phone number must be 9-15 digits')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { phone } = req.body;

    const isValid = whatsappService.validateMoroccanPhone(phone);
    const formattedPhone = whatsappService.formatMoroccanPhoneForWhatsApp(phone);

    res.json({
      success: true,
      isValid,
      originalPhone: phone,
      formattedPhone,
      whatsappLink: formattedPhone ? whatsappService.generateWhatsAppLink(formattedPhone) : null
    });

  } catch (error) {
    console.error('Error validating phone number:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate phone number',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Generate QR code for WhatsApp
router.post('/generate-qr', [
  body('message').optional().isLength({ min: 0, max: 500 }).trim(),
  body('language').optional().isIn(['ar', 'fr', 'en']).withMessage('Language must be ar, fr, or en')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { message = '', language = 'ar' } = req.body;

    const qrData = whatsappService.generateWhatsAppQRCode(message, language);

    res.json({
      success: true,
      ...qrData,
      language
    });

  } catch (error) {
    console.error('Error generating WhatsApp QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Check WhatsApp API status
router.get('/status', async (req, res) => {
  try {
    const status = await whatsappService.checkApiStatus();

    res.json({
      success: true,
      whatsappApiStatus: status,
      businessPhone: whatsappService.businessPhone,
      isConfigured: whatsappService.isConfigured
    });

  } catch (error) {
    console.error('Error checking WhatsApp API status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check WhatsApp API status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// WhatsApp webhook for receiving messages (if using WhatsApp Business API)
router.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('❌ WhatsApp webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    console.log('❌ WhatsApp webhook missing parameters');
    res.sendStatus(400);
  }
});

// Handle incoming WhatsApp messages
router.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const message = body.entry[0].changes[0].value.messages[0];
      const fromPhone = message.from;
      const messageBody = message.text?.body;

      console.log(`📱 Received WhatsApp message from ${fromPhone}: ${messageBody}`);

      // Here you can implement auto-responses or forward to customer service
      // This is a basic implementation - enhance as needed
    }

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
