const { getDatabase } = require('../config/db');

class Order {
  static async createOrder(userId, orderData) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      // Start transaction
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Create the order
        db.run(`
          INSERT INTO orders (
            user_id, total_amount, status, shipping_address,
            payment_method, payment_status, coupon_code,
            discount_amount, shipping_cost
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          orderData.total || orderData.total_amount,
          'pending',
          orderData.shipping_address || '',
          orderData.payment_method || 'cash',
          'pending',
          orderData.coupon_code || null,
          orderData.discount_amount || 0,
          orderData.shipping_cost || 0
        ], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return reject(err);
          }

          const orderId = this.lastID;

          // Add order items if provided
          if (orderData.items && orderData.items.length > 0) {
            let itemsProcessed = 0;
            const totalItems = orderData.items.length;

            orderData.items.forEach(item => {
              db.run(`
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
              `, [
                orderId,
                item.product_id || item.productId,
                item.quantity,
                item.price
              ], function(err) {
                if (err) {
                  db.run('ROLLBACK');
                  return reject(err);
                }

                itemsProcessed++;
                if (itemsProcessed === totalItems) {
                  db.run('COMMIT', (err) => {
                    if (err) {
                      return reject(err);
                    }
                    Order.getOrderById(orderId).then(resolve).catch(reject);
                  });
                }
              });
            });
          } else {
            db.run('COMMIT', (err) => {
              if (err) {
                return reject(err);
              }
              Order.getOrderById(orderId).then(resolve).catch(reject);
            });
          }
        });
      });
    });
  }

  static async getOrderById(orderId) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.get(`
        SELECT o.*, u.first_name, u.last_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId], (err, order) => {
        if (err) {
          return reject(err);
        }

        if (!order) {
          return resolve(null);
        }

        // Get order items
        db.all(`
          SELECT oi.*, p.name as product_name, p.image_url
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [orderId], (err, items) => {
          if (err) {
            return reject(err);
          }

          order.items = items || [];
          resolve(order);
        });
      });
    });
  }

  static async getUserOrders(userId) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(`
        SELECT * FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
      `, [userId], (err, orders) => {
        if (err) {
          return reject(err);
        }
        resolve(orders || []);
      });
    });
  }

  static async updateOrderStatus(orderId, status) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.run(`
        UPDATE orders
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, orderId], function(err) {
        if (err) {
          return reject(err);
        }
        resolve(this.changes > 0);
      });
    });
  }

  static async getAllOrders() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();

      db.all(`
        SELECT o.*, u.first_name, u.last_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `, (err, orders) => {
        if (err) {
          return reject(err);
        }
        resolve(orders || []);
      });
    });
  }
}

module.exports = Order;
