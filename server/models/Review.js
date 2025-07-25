const { pool } = require('../config/db');

class Review {
  static async getByProduct(productId, limit = 10, offset = 0) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT r.*, u.name as user_name_db
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ? AND r.is_approved = 1
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [productId, limit, offset]);

      return rows.map(row => ({
        ...row,
        user_name: row.user_name_db || row.user_name,
        user_name_db: undefined
      }));
    } catch (error) {
      console.error('Error getting reviews by product:', error);
      throw error;
    }
  }

  static async getProductRatingStats(productId) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT
          COUNT(*) as total_reviews,
          AVG(rating) as average_rating,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
        FROM reviews
        WHERE product_id = ? AND is_approved = 1
      `, [productId]);

      const stats = rows[0] || {};
      return {
        total_reviews: stats.total_reviews || 0,
        average_rating: stats.average_rating ? parseFloat(stats.average_rating).toFixed(1) : 0,
        rating_distribution: {
          5: stats.five_star || 0,
          4: stats.four_star || 0,
          3: stats.three_star || 0,
          2: stats.two_star || 0,
          1: stats.one_star || 0
        }
      };
    } catch (error) {
      console.error('Error getting product rating stats:', error);
      throw error;
    }
  }

  static async create(reviewData) {
    try {
      // Check if user already reviewed this product
      if (reviewData.user_id) {
        const [existing] = await pool.promise().execute(`
          SELECT id FROM reviews WHERE product_id = ? AND user_id = ?
        `, [reviewData.product_id, reviewData.user_id]);

        if (existing.length > 0) {
          throw new Error('User has already reviewed this product');
        }
      }

      // Check if it's a verified purchase
      let isVerifiedPurchase = false;
      if (reviewData.user_id) {
        const [orders] = await pool.promise().execute(`
          SELECT o.id
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
        `, [reviewData.user_id, reviewData.product_id]);

        isVerifiedPurchase = orders.length > 0;
      }

      const [result] = await pool.promise().execute(`
        INSERT INTO reviews (product_id, user_id, user_name, user_email, rating, comment, is_verified_purchase)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        reviewData.product_id,
        reviewData.user_id || null,
        reviewData.user_name,
        reviewData.user_email,
        reviewData.rating,
        reviewData.comment || null,
        isVerifiedPurchase ? 1 : 0
      ]);

      return await Review.getById(result.insertId);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT r.*, u.name as user_name_db
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
      `, [id]);

      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      return {
        ...row,
        user_name: row.user_name_db || row.user_name,
        user_name_db: undefined
      };
    } catch (error) {
      console.error('Error getting review by id:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [result] = await pool.promise().execute(`
        UPDATE reviews SET
          rating = COALESCE(?, rating),
          comment = COALESCE(?, comment),
          is_approved = COALESCE(?, is_approved),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        updateData.rating,
        updateData.comment,
        updateData.is_approved !== undefined ? (updateData.is_approved ? 1 : 0) : undefined,
        id
      ]);

      if (result.affectedRows === 0) {
        return null;
      }

      return await Review.getById(id);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.promise().execute(`
        DELETE FROM reviews WHERE id = ?
      `, [id]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  static async getAllForAdmin(limit = 50, offset = 0) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT r.*, u.name as user_name_db, p.name as product_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);

      return rows.map(row => ({
        ...row,
        user_name: row.user_name_db || row.user_name,
        user_name_db: undefined
      }));
    } catch (error) {
      console.error('Error getting all reviews for admin:', error);
      throw error;
    }
  }

  static async approve(id) {
    try {
      return await Review.update(id, { is_approved: true });
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  }

  static async reject(id) {
    try {
      return await Review.update(id, { is_approved: false });
    } catch (error) {
      console.error('Error rejecting review:', error);
      throw error;
    }
  }
}

module.exports = Review;
