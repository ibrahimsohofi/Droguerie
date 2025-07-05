const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// Get user's wishlist
router.get('/', wishlistController.getUserWishlist);

// Get wishlist count
router.get('/count', wishlistController.getWishlistCount);

// Check if product is in wishlist
router.get('/check/:productId', wishlistController.checkWishlistStatus);

// Add product to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/remove/:productId', wishlistController.removeFromWishlist);

// Toggle product in wishlist
router.post('/toggle', wishlistController.toggleWishlist);

// Clear entire wishlist
router.delete('/clear', wishlistController.clearWishlist);

module.exports = router;
