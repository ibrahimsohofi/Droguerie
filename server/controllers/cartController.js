const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

const cartController = {
  // Get user's cart
  async getCart(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID required'
        });
      }

      const cartItems = await Cart.getByUserId(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      const cartCount = await Cart.getCartCount(userId);

      res.json({
        success: true,
        data: {
          user_id: userId,
          items: cartItems,
          total: cartTotal.total,
          total_items: cartTotal.total_items,
          count: cartCount
        }
      });
    } catch (error) {
      console.error('Error getting cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting cart',
        error: error.message
      });
    }
  },

  // Add item to cart
  async addItem(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { productId, quantity } = req.body;

      if (!userId || !productId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and product ID required'
        });
      }

      const result = await Cart.addItem(userId, parseInt(productId), parseInt(quantity) || 1);

      // Get updated cart info
      const cartItems = await Cart.getByUserId(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      const cartCount = await Cart.getCartCount(userId);

      res.json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          user_id: userId,
          items: cartItems,
          total: cartTotal.total,
          total_items: cartTotal.total_items,
          count: cartCount,
          added_item: result
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding item to cart',
        error: error.message
      });
    }
  },

  // Update item quantity in cart
  async updateItem(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { productId, quantity } = req.body;

      if (!userId || !productId || typeof quantity !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'User ID, product ID, and valid quantity required'
        });
      }

      await Cart.updateQuantity(userId, parseInt(productId), parseInt(quantity));

      // Get updated cart info
      const cartItems = await Cart.getByUserId(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      const cartCount = await Cart.getCartCount(userId);

      res.json({
        success: true,
        message: 'Cart item updated successfully',
        data: {
          user_id: userId,
          items: cartItems,
          total: cartTotal.total,
          total_items: cartTotal.total_items,
          count: cartCount
        }
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating cart item',
        error: error.message
      });
    }
  },

  // Remove item from cart
  async removeItem(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { productId } = req.body;

      if (!userId || !productId) {
        return res.status(400).json({
          success: false,
          message: 'User ID and product ID required'
        });
      }

      await Cart.removeItem(userId, parseInt(productId));

      // Get updated cart info
      const cartItems = await Cart.getByUserId(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      const cartCount = await Cart.getCartCount(userId);

      res.json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          user_id: userId,
          items: cartItems,
          total: cartTotal.total,
          total_items: cartTotal.total_items,
          count: cartCount
        }
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing cart item',
        error: error.message
      });
    }
  },

  // Clear entire cart
  async clearCart(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID required'
        });
      }

      await Cart.clearCart(userId);

      res.json({
        success: true,
        message: 'Cart cleared successfully',
        data: {
          user_id: userId,
          items: [],
          total: 0,
          total_items: 0,
          count: 0
        }
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error clearing cart',
        error: error.message
      });
    }
  },

  // Get cart count (for navbar badge)
  async getCartCount(req, res) {
    try {
      const userId = req.user?.id || req.params.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID required'
        });
      }

      const count = await Cart.getCartCount(userId);

      res.json({
        success: true,
        data: {
          user_id: userId,
          count: count
        }
      });
    } catch (error) {
      console.error('Error getting cart count:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting cart count',
        error: error.message
      });
    }
  },

  // Validate cart items (check stock, availability)
  async validateCart(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID required'
        });
      }

      const validation = await Cart.validateCartItems(userId);

      res.json({
        success: true,
        data: {
          user_id: userId,
          valid: validation.valid,
          issues: validation.issues
        }
      });
    } catch (error) {
      console.error('Error validating cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error validating cart',
        error: error.message
      });
    }
  },

  // Transfer guest cart to user cart (for login)
  async transferGuestCart(req, res) {
    try {
      const userId = req.user?.id;
      const { guestCartItems } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID required'
        });
      }

      if (guestCartItems && guestCartItems.length > 0) {
        await Cart.transferGuestCart(guestCartItems, userId);
      }

      // Get updated cart info
      const cartItems = await Cart.getByUserId(userId);
      const cartTotal = await Cart.getCartTotal(userId);
      const cartCount = await Cart.getCartCount(userId);

      res.json({
        success: true,
        message: 'Guest cart transferred successfully',
        data: {
          user_id: userId,
          items: cartItems,
          total: cartTotal.total,
          total_items: cartTotal.total_items,
          count: cartCount
        }
      });
    } catch (error) {
      console.error('Error transferring guest cart:', error);
      res.status(500).json({
        success: false,
        message: 'Error transferring guest cart',
        error: error.message
      });
    }
  }
};

module.exports = cartController;
