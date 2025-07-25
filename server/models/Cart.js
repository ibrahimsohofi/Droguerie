const { db } = require('../config/db');

class Cart {
  static async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.name, p.name_ar, p.price, p.image_url, p.stock_quantity, p.discount_percentage
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.is_active = 1
        ORDER BY c.created_at DESC
      `;

      db.all(query, [userId], (err, rows) => {
        if (err) {
          console.error('Error getting cart by user ID:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async addItem(userId, productId, quantity = 1) {
    return new Promise((resolve, reject) => {
      // First check if item already exists in cart
      db.get(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, existingItem) => {
          if (err) {
            console.error('Error checking existing cart item:', err);
            reject(err);
            return;
          }

          if (existingItem) {
            // Update existing item
            const newQuantity = existingItem.quantity + quantity;
            db.run(
              'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
              [newQuantity, userId, productId],
              function(err) {
                if (err) {
                  console.error('Error updating cart item:', err);
                  reject(err);
                } else {
                  resolve({ id: existingItem.id, user_id: userId, product_id: productId, quantity: newQuantity });
                }
              }
            );
          } else {
            // Add new item
            const stmt = db.prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)');
            stmt.run([userId, productId, quantity], function(err) {
              if (err) {
                console.error('Error adding cart item:', err);
                reject(err);
              } else {
                resolve({ id: this.lastID, user_id: userId, product_id: productId, quantity });
              }
            });
            stmt.finalize();
          }
        }
      );
    });
  }

  static async updateQuantity(userId, productId, quantity) {
    return new Promise((resolve, reject) => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        this.removeItem(userId, productId)
          .then(resolve)
          .catch(reject);
        return;
      }

      db.run(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId],
        function(err) {
          if (err) {
            console.error('Error updating cart quantity:', err);
            reject(err);
          } else {
            resolve({ user_id: userId, product_id: productId, quantity, changes: this.changes });
          }
        }
      );
    });
  }

  static async removeItem(userId, productId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        function(err) {
          if (err) {
            console.error('Error removing cart item:', err);
            reject(err);
          } else {
            resolve({ user_id: userId, product_id: productId, changes: this.changes });
          }
        }
      );
    });
  }

  static async clearCart(userId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM cart WHERE user_id = ?',
        [userId],
        function(err) {
          if (err) {
            console.error('Error clearing cart:', err);
            reject(err);
          } else {
            resolve({ user_id: userId, changes: this.changes });
          }
        }
      );
    });
  }

  static async getCartTotal(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          SUM(c.quantity * p.price * (1 - p.discount_percentage / 100)) as total,
          SUM(c.quantity) as total_items
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.is_active = 1
      `;

      db.get(query, [userId], (err, row) => {
        if (err) {
          console.error('Error getting cart total:', err);
          reject(err);
        } else {
          resolve({
            total: row ? (row.total || 0) : 0,
            total_items: row ? (row.total_items || 0) : 0
          });
        }
      });
    });
  }

  static async getCartCount(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT SUM(quantity) as count FROM cart WHERE user_id = ?',
        [userId],
        (err, row) => {
          if (err) {
            console.error('Error getting cart count:', err);
            reject(err);
          } else {
            resolve(row ? (row.count || 0) : 0);
          }
        }
      );
    });
  }

  static async validateCartItems(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, p.stock_quantity, p.is_active, p.name
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `;

      db.all(query, [userId], (err, rows) => {
        if (err) {
          console.error('Error validating cart items:', err);
          reject(err);
        } else {
          const issues = [];

          rows.forEach(item => {
            if (!item.is_active) {
              issues.push({
                product_id: item.product_id,
                name: item.name,
                issue: 'Product is no longer available'
              });
            } else if (item.quantity > item.stock_quantity) {
              issues.push({
                product_id: item.product_id,
                name: item.name,
                issue: `Insufficient stock. Available: ${item.stock_quantity}, Requested: ${item.quantity}`
              });
            }
          });

          resolve({
            valid: issues.length === 0,
            issues: issues
          });
        }
      });
    });
  }

  static async getCartItemById(userId, productId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
        [userId, productId],
        (err, row) => {
          if (err) {
            console.error('Error getting cart item:', err);
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async transferGuestCart(guestCartItems, userId) {
    return new Promise(async (resolve, reject) => {
      try {
        // Clear existing cart for user
        await this.clearCart(userId);

        // Add guest cart items
        for (const item of guestCartItems) {
          await this.addItem(userId, item.product_id, item.quantity);
        }

        resolve({ success: true });
      } catch (error) {
        console.error('Error transferring guest cart:', error);
        reject(error);
      }
    });
  }
}

module.exports = Cart;
