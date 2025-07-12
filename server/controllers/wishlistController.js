const Wishlist = require('../models/Wishlist');

const wishlistController = {
  // Add product to wishlist
  async addToWishlist(req, res) {
    try {
      const userId = req.user?.id;
      const { productId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const result = await Wishlist.addToWishlist(userId, productId);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error adding to wishlist',
        error: error.message
      });
    }
  },

  // Remove product from wishlist
  async removeFromWishlist(req, res) {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const result = await Wishlist.removeFromWishlist(userId, productId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error removing from wishlist',
        error: error.message
      });
    }
  },

  // Get user's wishlist
  async getUserWishlist(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const wishlist = await Wishlist.getUserWishlist(userId);

      res.json({
        success: true,
        data: wishlist,
        count: wishlist.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching wishlist',
        error: error.message
      });
    }
  },

  // Check if product is in user's wishlist
  async checkWishlistStatus(req, res) {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const isInWishlist = await Wishlist.isInWishlist(userId, productId);

      res.json({
        success: true,
        data: {
          isInWishlist: isInWishlist,
          productId: parseInt(productId)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error checking wishlist status',
        error: error.message
      });
    }
  },

  // Get wishlist count
  async getWishlistCount(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const count = await Wishlist.getWishlistCount(userId);

      res.json({
        success: true,
        data: { count: count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error getting wishlist count',
        error: error.message
      });
    }
  },

  // Clear user's wishlist
  async clearWishlist(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const result = await Wishlist.clearUserWishlist(userId);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error clearing wishlist',
        error: error.message
      });
    }
  },

  // Toggle wishlist (add if not present, remove if present)
  async toggleWishlist(req, res) {
    try {
      const userId = req.user?.id;
      const { productId } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const isInWishlist = await Wishlist.isInWishlist(userId, productId);
      let result;

      if (isInWishlist) {
        result = await Wishlist.removeFromWishlist(userId, productId);
        result.action = 'removed';
      } else {
        result = await Wishlist.addToWishlist(userId, productId);
        result.action = 'added';
      }

      res.json({
        success: result.success,
        message: result.message,
        data: {
          action: result.action,
          isInWishlist: !isInWishlist,
          productId: parseInt(productId)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error toggling wishlist',
        error: error.message
      });
    }
  }
};

module.exports = wishlistController;
