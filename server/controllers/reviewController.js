const Review = require('../models/Review');
const { validationResult } = require('express-validator');

const reviewController = {
  // Get reviews for a specific product
  async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const [reviews, stats] = await Promise.all([
        Review.getByProduct(productId, limit, offset),
        Review.getProductRatingStats(productId)
      ]);

      res.json({
        success: true,
        data: {
          reviews,
          stats,
          pagination: {
            limit,
            offset,
            hasMore: reviews.length === limit
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching product reviews',
        error: error.message
      });
    }
  },

  // Get rating statistics for a product
  async getProductRatingStats(req, res) {
    try {
      const { productId } = req.params;
      const stats = await Review.getProductRatingStats(productId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching rating statistics',
        error: error.message
      });
    }
  },

  // Create a new review
  async createReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const reviewData = {
        ...req.body,
        user_id: req.user?.id || null
      };

      const review = await Review.create(reviewData);

      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: review
      });
    } catch (error) {
      if (error.message === 'User has already reviewed this product') {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating review',
        error: error.message
      });
    }
  },

  // Update a review (user can only update their own review)
  async updateReview(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const review = await Review.getById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user can update this review
      if (req.user?.role !== 'admin' && review.user_id !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this review'
        });
      }

      const updatedReview = await Review.update(id, req.body);

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: updatedReview
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating review',
        error: error.message
      });
    }
  },

  // Delete a review (user can only delete their own review)
  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.getById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check if user can delete this review
      if (req.user?.role !== 'admin' && review.user_id !== req.user?.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this review'
        });
      }

      const deleted = await Review.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting review',
        error: error.message
      });
    }
  },

  // Admin: Get all reviews
  async getAllReviews(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const reviews = await Review.getAllForAdmin(limit, offset);

      res.json({
        success: true,
        data: reviews,
        pagination: {
          limit,
          offset,
          hasMore: reviews.length === limit
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching all reviews',
        error: error.message
      });
    }
  },

  // Admin: Approve a review
  async approveReview(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.approve(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review approved successfully',
        data: review
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving review',
        error: error.message
      });
    }
  },

  // Admin: Reject a review
  async rejectReview(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.reject(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      res.json({
        success: true,
        message: 'Review rejected successfully',
        data: review
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error rejecting review',
        error: error.message
      });
    }
  }
};

module.exports = reviewController;
