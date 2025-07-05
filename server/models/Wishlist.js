const { pool } = require('../config/db');

class Wishlist {
  static async addToWishlist(userId, productId) {
    try {
      const [result] = await pool.promise().execute(`
        INSERT IGNORE INTO wishlist (user_id, product_id)
        VALUES (?, ?)
      `, [userId, productId]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Product already in wishlist' };
      }

      return { success: true, message: 'Product added to wishlist' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  }

  static async removeFromWishlist(userId, productId) {
    try {
      const [result] = await pool.promise().execute(`
        DELETE FROM wishlist WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);

      if (result.affectedRows === 0) {
        return { success: false, message: 'Product not found in wishlist' };
      }

      return { success: true, message: 'Product removed from wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  }

  static async getUserWishlist(userId) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT w.*, p.name, p.name_ar, p.description, p.description_ar,
               p.price, p.image_url, p.stock_quantity, p.featured,
               c.name as category_name, c.name_ar as category_name_ar,
               COALESCE(AVG(r.rating), 0) as average_rating,
               COUNT(r.id) as review_count
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN reviews r ON p.id = r.product_id AND r.is_approved = 1
        WHERE w.user_id = ? AND p.is_active = 1
        GROUP BY w.id, p.id
        ORDER BY w.created_at DESC
      `, [userId]);

      return rows.map(row => ({
        wishlist_id: row.id,
        product_id: row.product_id,
        added_at: row.created_at,
        product: {
          id: row.product_id,
          name: row.name,
          name_ar: row.name_ar,
          description: row.description,
          description_ar: row.description_ar,
          price: row.price,
          image_url: row.image_url,
          stock_quantity: row.stock_quantity,
          featured: row.featured,
          category_name: row.category_name,
          category_name_ar: row.category_name_ar,
          average_rating: parseFloat(row.average_rating).toFixed(1),
          review_count: parseInt(row.review_count)
        }
      }));
    } catch (error) {
      console.error('Error getting user wishlist:', error);
      throw error;
    }
  }

  static async isInWishlist(userId, productId) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT 1 FROM wishlist WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);

      return rows.length > 0;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      throw error;
    }
  }

  static async getWishlistCount(userId) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT COUNT(*) as count FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ? AND p.is_active = 1
      `, [userId]);

      return rows[0].count;
    } catch (error) {
      console.error('Error getting wishlist count:', error);
      throw error;
    }
  }

  static async clearUserWishlist(userId) {
    try {
      const [result] = await pool.promise().execute(`
        DELETE FROM wishlist WHERE user_id = ?
      `, [userId]);

      return { success: true, message: `Removed ${result.affectedRows} items from wishlist` };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }
}

module.exports = Wishlist;
