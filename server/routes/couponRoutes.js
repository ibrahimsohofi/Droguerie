const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const couponController = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Validation rules for coupon creation/update
const couponValidation = [
  body('code')
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[A-Z0-9_-]+$/)
    .withMessage('Coupon code must be 3-50 characters and contain only uppercase letters, numbers, hyphens, and underscores'),

  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Coupon name is required and must be less than 100 characters'),

  body('type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Coupon type must be either "percentage" or "fixed"'),

  body('value')
    .isFloat({ min: 0 })
    .withMessage('Coupon value must be a positive number'),

  body('minimum_order_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount must be a positive number'),

  body('maximum_discount_amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount amount must be a positive number'),

  body('usage_limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Usage limit must be a positive integer'),

  body('user_usage_limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('User usage limit must be a positive integer'),

  body('start_date')
    .isISO8601()
    .withMessage('Start date must be a valid date'),

  body('end_date')
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_date)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Active status must be a boolean')
];

// Public routes
router.get('/active', couponController.getActiveCoupons);
router.get('/validate/:code', couponController.validateCoupon);

// Authenticated routes
router.get('/history', protect, couponController.getUserCouponHistory);
router.post('/apply', protect, couponController.applyCoupon);

// Admin routes
router.get('/', protect, adminOnly, couponController.getAllCoupons);
router.post('/', protect, adminOnly, couponValidation, couponController.createCoupon);
router.put('/:id', protect, adminOnly, couponValidation, couponController.updateCoupon);
router.delete('/:id', protect, adminOnly, couponController.deleteCoupon);
router.get('/stats', protect, adminOnly, couponController.getCouponStats);

module.exports = router;
