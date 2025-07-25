const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for payment intent
const paymentIntentValidation = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Valid currency code is required'),
  body('orderData').isObject().withMessage('Order data is required')
];

// Validation rules for payment confirmation
const confirmPaymentValidation = [
  body('payment_intent_id').isString().isLength({ min: 1 }).withMessage('Payment intent ID is required'),
  body('orderData').isObject().withMessage('Order data is required')
];

// Public routes
router.get('/methods', paymentController.getPaymentMethods);
router.get('/methods/morocco', paymentController.getMoroccanPaymentMethods);

// Protected routes
router.post('/create-intent',
  paymentIntentValidation,
  paymentController.createPaymentIntent
);

router.post('/confirm',
  confirmPaymentValidation,
  paymentController.confirmPayment
);

// Moroccan payment methods
router.post('/cash-on-delivery',
  [
    body('orderData').isObject().withMessage('Order data is required'),
    body('deliveryAddress').isObject().withMessage('Delivery address is required'),
    body('deliveryAddress.city').isString().isLength({ min: 1 }).withMessage('Delivery city is required')
  ],
  paymentController.createCashOnDeliveryOrder
);

router.post('/cih-bank',
  [
    body('orderData').isObject().withMessage('Order data is required'),
    body('bankDetails').optional().isObject().withMessage('Bank details must be an object')
  ],
  paymentController.processCIHBankPayment
);

router.post('/bmce-bank',
  [
    body('orderData').isObject().withMessage('Order data is required'),
    body('bankDetails').optional().isObject().withMessage('Bank details must be an object')
  ],
  paymentController.processBMCEBankPayment
);

router.post('/wafacash',
  [
    body('orderData').isObject().withMessage('Order data is required'),
    body('phoneNumber').isMobilePhone().withMessage('Valid Moroccan phone number is required'),
    body('pin').isString().isLength({ min: 4, max: 8 }).withMessage('Valid PIN is required')
  ],
  paymentController.processWafacashPayment
);

// Webhook route (no authentication needed)
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// Admin routes
router.post('/refund',
  protect,
  adminOnly,
  [
    body('payment_intent_id').isString().isLength({ min: 1 }).withMessage('Payment intent ID is required'),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Valid refund amount is required'),
    body('reason').optional().isString().withMessage('Reason must be a string')
  ],
  paymentController.refundPayment
);

module.exports = router;
