const { pool } = require('../config/db');

class Order {
  static async createOrder(userId, orderData) {
    try {
      // Start transaction
      await pool.promise().execute('BEGIN TRANSACTION');

      try {
        // Create the order
        const [orderResult] = await pool.promise().execute(`
          INSERT INTO orders (user_id, customer_name, customer_email, customer_phone,
                             shipping_address, shipping_city, shipping_postal_code,
                             payment_method, total_amount, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId,
          orderData.customer_name || null,
          orderData.customer_email || null,
          orderData.customer_phone || null,
          orderData.shipping_address || null,
          orderData.shipping_city || null,
          orderData.shipping_postal_code || null,
          orderData.payment_method || 'cash',
          orderData.total,
          'pending'
        ]);

        const orderId = orderResult.insertId;

        // Add order items
        if (orderData.items && orderData.items.length > 0) {
          for (const item of orderData.items) {
            await pool.promise().execute(`
              INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
              VALUES (?, ?, ?, ?, ?)
            `, [
              orderId,
              item.productId || item.product_id,
              item.name || item.product_name,
              item.quantity,
              item.price
            ]);
          }
        }

        // Commit transaction
        await pool.promise().execute('COMMIT');

        return await Order.getOrderById(orderId);
      } catch (error) {
        // Rollback transaction on error
        await pool.promise().execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getOrderById(orderId) {
    try {
      const [orderRows] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

      if (orderRows.length === 0) {
        return null;
      }

      const order = orderRows[0];

      // Get order items
      const [itemRows] = await pool.promise().execute(`
        SELECT * FROM order_items WHERE order_id = ?
      `, [orderId]);

      return {
        ...order,
        items: itemRows
      };
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  }

  static async getOrdersByUser(userId) {
    try {
      const [orderRows] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [userId]);

      // Get items for each order
      const ordersWithItems = await Promise.all(
        orderRows.map(async (order) => {
          const [itemRows] = await pool.promise().execute(`
            SELECT * FROM order_items WHERE order_id = ?
          `, [order.id]);

          return {
            ...order,
            items: itemRows
          };
        })
      );

      return ordersWithItems;
    } catch (error) {
      console.error('Error getting orders by user:', error);
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const [orderRows] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);

      // Get items for each order
      const ordersWithItems = await Promise.all(
        orderRows.map(async (order) => {
          const [itemRows] = await pool.promise().execute(`
            SELECT * FROM order_items WHERE order_id = ?
          `, [order.id]);

          return {
            ...order,
            items: itemRows
          };
        })
      );

      return ordersWithItems;
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  static async updateOrderStatus(orderId, status, notes = null, updatedBy = null, trackingNumber = null, estimatedDelivery = null) {
    try {
      // Start transaction
      await pool.promise().execute('BEGIN TRANSACTION');

      try {
        // Update order status
        let updateQuery = `
          UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP
        `;
        let updateParams = [status];

        if (trackingNumber) {
          updateQuery += `, tracking_number = ?`;
          updateParams.push(trackingNumber);
        }

        if (estimatedDelivery) {
          updateQuery += `, estimated_delivery = ?`;
          updateParams.push(estimatedDelivery);
        }

        if (status === 'delivered') {
          updateQuery += `, delivered_at = CURRENT_TIMESTAMP`;
        }

        updateQuery += ` WHERE id = ?`;
        updateParams.push(orderId);

        const [result] = await pool.promise().execute(updateQuery, updateParams);

        if (result.affectedRows === 0) {
          await pool.promise().execute('ROLLBACK');
          return null;
        }

        // Add to order status history
        await pool.promise().execute(`
          INSERT INTO order_status_history (order_id, status, notes, updated_by)
          VALUES (?, ?, ?, ?)
        `, [orderId, status, notes, updatedBy]);

        // Commit transaction
        await pool.promise().execute('COMMIT');

        return await Order.getOrderById(orderId);
      } catch (error) {
        await pool.promise().execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  static async getOrderStatusHistory(orderId) {
    try {
      const [rows] = await pool.promise().execute(`
        SELECT osh.*, u.name as updated_by_name
        FROM order_status_history osh
        LEFT JOIN users u ON osh.updated_by = u.id
        WHERE osh.order_id = ?
        ORDER BY osh.created_at ASC
      `, [orderId]);

      return rows;
    } catch (error) {
      console.error('Error getting order status history:', error);
      throw error;
    }
  }

  static async getOrderByTrackingNumber(trackingNumber) {
    try {
      const [orderRows] = await pool.promise().execute(`
        SELECT o.*, u.name as user_name, u.email as user_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.tracking_number = ?
      `, [trackingNumber]);

      if (orderRows.length === 0) {
        return null;
      }

      const order = orderRows[0];

      // Get order items
      const [itemRows] = await pool.promise().execute(`
        SELECT * FROM order_items WHERE order_id = ?
      `, [order.id]);

      // Get status history
      const statusHistory = await Order.getOrderStatusHistory(order.id);

      return {
        ...order,
        items: itemRows,
        statusHistory: statusHistory
      };
    } catch (error) {
      console.error('Error getting order by tracking number:', error);
      throw error;
    }
  }

  static async create(data) {
    // Alias method for payment controller compatibility
    return await Order.createOrder(data.userId, data.orderData);
  }

  static async updatePaymentStatus(paymentIntentId, status) {
    try {
      const [result] = await pool.promise().execute(`
        UPDATE orders SET
          payment_status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE payment_intent_id = ?
      `, [status, paymentIntentId]);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  static async deleteOrder(orderId) {
    try {
      // Start transaction
      await pool.promise().execute('BEGIN TRANSACTION');

      try {
        // Delete order items first
        await pool.promise().execute(`
          DELETE FROM order_items WHERE order_id = ?
        `, [orderId]);

        // Delete the order
        const [result] = await pool.promise().execute(`
          DELETE FROM orders WHERE id = ?
        `, [orderId]);

        // Commit transaction
        await pool.promise().execute('COMMIT');

        return result.affectedRows > 0;
      } catch (error) {
        // Rollback transaction on error
        await pool.promise().execute('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

module.exports = Order;
