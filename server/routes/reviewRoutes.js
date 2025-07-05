const express = require('express');
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules for reviews
const reviewValidation = [
  body('product_id').isInt({ min: 1 }).withMessage('Valid product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('user_name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('user_email').isEmail().withMessage('Valid email is required'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters')
];

const reviewUpdateValidation = [
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters')
];

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/product/:productId/stats', reviewController.getProductRatingStats);

// User routes (require authentication for logged-in users, but allow guest reviews)
router.post('/', reviewValidation, reviewController.createReview);

// Authenticated user routes
router.put('/:id', protect, reviewUpdateValidation, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

// Admin routes
router.get('/admin/all', protect, adminOnly, reviewController.getAllReviews);
router.post('/:id/approve', protect, adminOnly, reviewController.approveReview);
router.post('/:id/reject', protect, adminOnly, reviewController.rejectReview);

module.exports = router;
