const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const Review = require('../models/Review');
const { protect: authenticate, adminOnly: authorize } = require('../middleware/authMiddleware');

// Get all reviews for a product
router.get('/product/:productId', [
  param('productId').isInt().withMessage('Valid product ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { sort = 'newest', filter = 'all', page = 1, limit = 10 } = req.query;

    let sortOrder = 'created_at DESC';
    switch (sort) {
      case 'oldest':
        sortOrder = 'created_at ASC';
        break;
      case 'highest':
        sortOrder = 'rating DESC, created_at DESC';
        break;
      case 'lowest':
        sortOrder = 'rating ASC, created_at DESC';
        break;
      case 'helpful':
        sortOrder = 'helpful_count DESC, created_at DESC';
        break;
    }

    let whereClause = 'WHERE product_id = ? AND status = "approved"';
    const queryParams = [productId];

    if (filter !== 'all') {
      if (filter === 'verified') {
        whereClause += ' AND verified_purchase = 1';
      } else if (['1', '2', '3', '4', '5'].includes(filter)) {
        whereClause += ' AND rating = ?';
        queryParams.push(parseInt(filter));
      }
    }

    const offset = (page - 1) * limit;

    const query = `
      SELECT r.*, u.name as user_name,
             COALESCE(r.helpful_count, 0) as helpful_count,
             COALESCE(r.not_helpful_count, 0) as not_helpful_count
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      ${whereClause}
      ORDER BY ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);

    const reviews = await Review.query(query, queryParams);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;

    const countResult = await Review.query(countQuery, queryParams.slice(0, -2));
    const total = countResult[0]?.total || 0;

    // Get user's helpful votes if authenticated
    let helpfulVotes = {};
    if (req.user) {
      const helpfulQuery = `
        SELECT review_id, helpful
        FROM review_helpful_votes
        WHERE user_id = ? AND review_id IN (${reviews.map(() => '?').join(',')})
      `;

      if (reviews.length > 0) {
        const helpfulParams = [req.user.id, ...reviews.map(r => r.id)];
        const helpfulResults = await Review.query(helpfulQuery, helpfulParams);
        helpfulVotes = helpfulResults.reduce((acc, vote) => {
          acc[vote.review_id] = vote.helpful;
          return acc;
        }, {});
      }
    }

    res.json({
      success: true,
      reviews,
      helpfulVotes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// Get user's review for a specific product
router.get('/user/:productId', authenticate, [
  param('productId').isInt().withMessage('Valid product ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const userId = req.user.id;

    const query = `
      SELECT * FROM reviews
      WHERE user_id = ? AND product_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const reviews = await Review.query(query, [userId, productId]);
    const review = reviews.length > 0 ? reviews[0] : null;

    res.json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user review'
    });
  }
});

// Create a new review
router.post('/', authenticate, [
  body('product_id').isInt().withMessage('Valid product ID required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('comment').isLength({ min: 10, max: 2000 }).withMessage('Comment must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { product_id, rating, title, comment } = req.body;
    const userId = req.user.id;

    // Check if user already reviewed this product
    const existingReview = await Review.query(
      'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product (for verified purchase)
    const purchaseQuery = `
      SELECT COUNT(*) as count
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? AND oi.product_id = ? AND o.status IN ('completed', 'delivered')
    `;

    const purchaseResult = await Review.query(purchaseQuery, [userId, product_id]);
    const verifiedPurchase = purchaseResult[0]?.count > 0;

    // Create the review
    const reviewData = {
      user_id: userId,
      product_id,
      rating,
      title: title || null,
      comment,
      verified_purchase: verifiedPurchase,
      status: 'approved', // Auto-approve for now, can add moderation later
      helpful_count: 0,
      not_helpful_count: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    const reviewId = await Review.create(reviewData);

    // Fetch the created review with user info
    const newReview = await Review.query(`
      SELECT r.*, u.name as user_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [reviewId]);

    // Update product rating average
    await updateProductRating(product_id);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview[0]
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
});

// Mark review as helpful/not helpful
router.post('/:reviewId/helpful', authenticate, [
  param('reviewId').isInt().withMessage('Valid review ID required'),
  body('helpful').isBoolean().withMessage('Helpful must be true or false')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reviewId } = req.params;
    const { helpful } = req.body;
    const userId = req.user.id;

    // Check if review exists
    const review = await Review.query('SELECT id FROM reviews WHERE id = ?', [reviewId]);
    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted on this review
    const existingVote = await Review.query(
      'SELECT id, helpful FROM review_helpful_votes WHERE user_id = ? AND review_id = ?',
      [userId, reviewId]
    );

    if (existingVote.length > 0) {
      // Update existing vote
      await Review.query(
        'UPDATE review_helpful_votes SET helpful = ?, updated_at = ? WHERE id = ?',
        [helpful, new Date(), existingVote[0].id]
      );
    } else {
      // Create new vote
      await Review.query(
        'INSERT INTO review_helpful_votes (user_id, review_id, helpful, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [userId, reviewId, helpful, new Date(), new Date()]
      );
    }

    // Update helpful counts on the review
    const helpfulCount = await Review.query(
      'SELECT COUNT(*) as count FROM review_helpful_votes WHERE review_id = ? AND helpful = 1',
      [reviewId]
    );

    const notHelpfulCount = await Review.query(
      'SELECT COUNT(*) as count FROM review_helpful_votes WHERE review_id = ? AND helpful = 0',
      [reviewId]
    );

    await Review.query(
      'UPDATE reviews SET helpful_count = ?, not_helpful_count = ?, updated_at = ? WHERE id = ?',
      [helpfulCount[0].count, notHelpfulCount[0].count, new Date(), reviewId]
    );

    res.json({
      success: true,
      message: 'Vote recorded successfully'
    });

  } catch (error) {
    console.error('Error recording helpful vote:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while recording vote'
    });
  }
});

// Report a review
router.post('/:reviewId/report', authenticate, [
  param('reviewId').isInt().withMessage('Valid review ID required'),
  body('reason').optional().isLength({ max: 500 }).withMessage('Reason must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reviewId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Check if review exists
    const review = await Review.query('SELECT id FROM reviews WHERE id = ?', [reviewId]);
    if (review.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already reported this review
    const existingReport = await Review.query(
      'SELECT id FROM review_reports WHERE user_id = ? AND review_id = ?',
      [userId, reviewId]
    );

    if (existingReport.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    // Create report
    await Review.query(
      'INSERT INTO review_reports (user_id, review_id, reason, created_at) VALUES (?, ?, ?, ?)',
      [userId, reviewId, reason || 'Inappropriate content', new Date()]
    );

    // Increment report count on review
    await Review.query(
      'UPDATE reviews SET report_count = COALESCE(report_count, 0) + 1 WHERE id = ?',
      [reviewId]
    );

    res.json({
      success: true,
      message: 'Review reported successfully'
    });

  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reporting review'
    });
  }
});

// Get review statistics for a product
router.get('/stats/:productId', [
  param('productId').isInt().withMessage('Valid product ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId } = req.params;

    const statsQuery = `
      SELECT
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1,
        SUM(CASE WHEN verified_purchase = 1 THEN 1 ELSE 0 END) as verified_reviews
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `;

    const stats = await Review.query(statsQuery, [productId]);

    res.json({
      success: true,
      stats: stats[0] || {
        total_reviews: 0,
        average_rating: 0,
        rating_5: 0,
        rating_4: 0,
        rating_3: 0,
        rating_2: 0,
        rating_1: 0,
        verified_reviews: 0
      }
    });

  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching review statistics'
    });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const ratingQuery = `
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `;

    const result = await Review.query(ratingQuery, [productId]);
    const { avg_rating, review_count } = result[0];

    await Review.query(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
      [avg_rating || 0, review_count || 0, productId]
    );
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

// Admin: Get all reviews with moderation options
router.get('/admin/all', authenticate, authorize, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (status !== 'all') {
      whereClause += ' AND r.status = ?';
      queryParams.push(status);
    }

    const offset = (page - 1) * limit;

    const query = `
      SELECT r.*, u.name as user_name, p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(parseInt(limit), offset);

    const reviews = await Review.query(query, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;

    const countResult = await Review.query(countQuery, queryParams.slice(0, -2));
    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching admin reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// Admin: Update review status
router.put('/admin/:reviewId/status', authenticate, authorize, [
  param('reviewId').isInt().withMessage('Valid review ID required'),
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reviewId } = req.params;
    const { status } = req.body;

    await Review.query(
      'UPDATE reviews SET status = ?, updated_at = ? WHERE id = ?',
      [status, new Date(), reviewId]
    );

    // If approved, update product rating
    if (status === 'approved') {
      const review = await Review.query('SELECT product_id FROM reviews WHERE id = ?', [reviewId]);
      if (review.length > 0) {
        await updateProductRating(review[0].product_id);
      }
    }

    res.json({
      success: true,
      message: `Review ${status} successfully`
    });

  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review status'
    });
  }
});

module.exports = router;
