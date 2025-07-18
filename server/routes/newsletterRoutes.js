const express = require('express');
const { body } = require('express-validator');
const newsletterController = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const subscribeValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('language').optional().isIn(['ar', 'fr', 'en']).withMessage('Language must be ar, fr, or en'),
  body('source').optional().isLength({ max: 50 }).withMessage('Source must be less than 50 characters')
];

const unsubscribeValidation = [
  body('email').isEmail().withMessage('Valid email is required')
];

// Public routes
router.post('/subscribe', subscribeValidation, newsletterController.subscribe);
router.post('/unsubscribe', unsubscribeValidation, newsletterController.unsubscribe);

// Admin routes
router.get('/stats', protect, adminOnly, newsletterController.getStats);

module.exports = router;
