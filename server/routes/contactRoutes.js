const express = require('express');
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for contact form
const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isLength({ max: 20 }).withMessage('Phone number must be less than 20 characters'),
  body('subject').optional().isLength({ max: 200 }).withMessage('Subject must be less than 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// Public routes
router.post('/', contactValidation, contactController.submitContactForm);

// Admin routes
router.get('/messages', protect, adminOnly, contactController.getAllContactMessages);
router.put('/messages/:messageId/status', protect, adminOnly, contactController.updateMessageStatus);
router.get('/stats', protect, adminOnly, contactController.getContactStats);

module.exports = router;
