const express = require('express');
const cartController = require('../controllers/cartController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Get user cart (protected)
router.get('/', protect, cartController.getCart);
router.get('/:userId', optionalAuth, cartController.getCart);

// Get cart count for navbar badge
router.get('/count/:userId', optionalAuth, cartController.getCartCount);

// Add item to cart
router.post('/add', optionalAuth, cartController.addItem);

// Update item quantity
router.put('/update', optionalAuth, cartController.updateItem);

// Remove item from cart
router.delete('/remove', optionalAuth, cartController.removeItem);

// Clear entire cart
router.delete('/clear', optionalAuth, cartController.clearCart);

// Validate cart items (check stock, availability)
router.post('/validate', optionalAuth, cartController.validateCart);

// Transfer guest cart to user cart (for login)
router.post('/transfer', protect, cartController.transferGuestCart);

module.exports = router;
