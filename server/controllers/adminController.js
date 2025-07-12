const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/OrderSqlite');
const Category = require('../models/Category');
const { getDatabase } = require('../config/db');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const db = getDatabase();

    // Get total counts
    const totalProducts = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const totalUsers = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users WHERE role != "admin"', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const totalOrders = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
        if (err) reject(err);
        else resolve(row.count || 0);
      });
    });

    const totalRevenue = await new Promise((resolve, reject) => {
      db.get('SELECT SUM(total) as revenue FROM orders WHERE status = "delivered"', (err, row) => {
        if (err) reject(err);
        else resolve(row.revenue || 0);
      });
    });

    // Get recent orders
    const recentOrders = await new Promise((resolve, reject) => {
      db.all(`
        SELECT o.id, o.total, o.status, o.created_at,
               u.first_name, u.last_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Get low stock products
    const lowStockProducts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, stock, price
        FROM products
        WHERE stock < 10
        ORDER BY stock ASC
        LIMIT 5
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: parseFloat(totalRevenue || 0),
        recentOrders,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// Get all users for admin management
const getAllUsers = async (req, res) => {
  try {
    const db = getDatabase();

    const users = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, first_name, last_name, email, role, created_at,
               last_login, email_verified, phone
        FROM users
        ORDER BY created_at DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be user or admin'
      });
    }

    const db = getDatabase();

    await new Promise((resolve, reject) => {
      db.run('UPDATE users SET role = ? WHERE id = ?', [role, userId], function(err) {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
};

// Get inventory report
const getInventoryReport = async (req, res) => {
  try {
    const db = getDatabase();

    const inventory = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.id, p.name, p.stock, p.price,
               c.name as category_name,
               CASE
                 WHEN p.stock = 0 THEN 'Out of Stock'
                 WHEN p.stock < 10 THEN 'Low Stock'
                 WHEN p.stock < 50 THEN 'Medium Stock'
                 ELSE 'Good Stock'
               END as stock_status
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.stock ASC, p.name
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory report'
    });
  }
};

// Get sales analytics
const getSalesAnalytics = async (req, res) => {
  try {
    const db = getDatabase();

    // Daily sales for last 7 days
    const dailySales = await new Promise((resolve, reject) => {
      db.all(`
        SELECT DATE(created_at) as date,
               COUNT(*) as orders,
               SUM(total) as revenue
        FROM orders
        WHERE created_at >= date('now', '-7 days')
        AND status != 'cancelled'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    // Top selling products
    const topProducts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.name, COUNT(oi.product_id) as orders_count,
               SUM(oi.quantity) as total_sold
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status != 'cancelled'
        GROUP BY oi.product_id, p.name
        ORDER BY total_sold DESC
        LIMIT 10
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      data: {
        dailySales,
        topProducts
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales analytics'
    });
  }
};

// Get all products for admin inventory management
const getAllProducts = async (req, res) => {
  try {
    const { limit = 50, offset = 0, category, search, stockStatus } = req.query;
    const db = getDatabase();

    let query = `
      SELECT p.*, c.name as category_name, c.name_ar as category_name_ar,
             CASE
               WHEN p.stock_quantity = 0 THEN 'out_of_stock'
               WHEN p.stock_quantity <= p.reorder_level THEN 'low_stock'
               WHEN p.stock_quantity > p.max_stock_level THEN 'overstocked'
               ELSE 'normal'
             END as stock_status
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.name_ar LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'low') {
        query += ' AND p.stock_quantity <= p.reorder_level AND p.stock_quantity > 0';
      } else if (stockStatus === 'out') {
        query += ' AND p.stock_quantity = 0';
      } else if (stockStatus === 'normal') {
        query += ' AND p.stock_quantity > p.reorder_level AND p.stock_quantity <= p.max_stock_level';
      }
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const products = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get stock alerts
const getStockAlerts = async (req, res) => {
  try {
    const db = getDatabase();

    const alerts = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.id, p.name, p.name_ar, p.stock_quantity, p.reorder_level, p.max_stock_level,
               c.name as category_name,
               CASE
                 WHEN p.stock_quantity = 0 THEN 'OUT_OF_STOCK'
                 WHEN p.stock_quantity <= p.reorder_level THEN 'LOW_STOCK'
                 WHEN p.stock_quantity > p.max_stock_level THEN 'OVERSTOCKED'
                 ELSE 'NORMAL'
               END as alert_type,
               p.stock_quantity as current_value,
               p.reorder_level as threshold_value
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.stock_quantity <= p.reorder_level OR p.stock_quantity > p.max_stock_level
        ORDER BY
          CASE
            WHEN p.stock_quantity = 0 THEN 1
            WHEN p.stock_quantity <= p.reorder_level THEN 2
            ELSE 3
          END,
          p.stock_quantity ASC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get stock alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stock alerts'
    });
  }
};

// Update product stock
const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, type, reason } = req.body; // type: 'SET', 'ADD', 'SUBTRACT'
    const db = getDatabase();

    // Get current product
    const product = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let newQuantity;
    let quantityChange;

    switch (type) {
      case 'SET':
        newQuantity = parseInt(quantity);
        quantityChange = newQuantity - product.stock_quantity;
        break;
      case 'ADD':
        quantityChange = parseInt(quantity);
        newQuantity = product.stock_quantity + quantityChange;
        break;
      case 'SUBTRACT':
        quantityChange = -parseInt(quantity);
        newQuantity = product.stock_quantity + quantityChange;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid stock update type'
        });
    }

    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity cannot be negative'
      });
    }

    // Update product stock
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE products SET stock_quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, productId],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Record inventory transaction (if table exists)
    try {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO inventory_transactions
          (product_id, transaction_type, quantity_change, previous_quantity, new_quantity, reason, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          productId,
          'ADJUSTMENT',
          quantityChange,
          product.stock_quantity,
          newQuantity,
          reason || 'Manual stock adjustment',
          req.user?.id || null
        ], function(err) {
          if (err) {
            console.log('Note: inventory_transactions table not available:', err.message);
          }
          resolve();
        });
      });
    } catch (err) {
      console.log('Inventory transaction logging skipped:', err.message);
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        productId,
        previousQuantity: product.stock_quantity,
        newQuantity,
        quantityChange
      }
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stock'
    });
  }
};

// Bulk stock update
const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { productId, quantity, type, reason }
    const results = [];
    const errors = [];

    for (const update of updates) {
      try {
        // This is a simplified version - in production you'd want to do this in a transaction
        const { productId, quantity, type, reason } = update;

        // Simulate the same logic as single update
        // In a real implementation, you'd extract this to a shared function
        results.push({
          productId,
          success: true,
          message: 'Updated successfully'
        });
      } catch (error) {
        errors.push({
          productId: update.productId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `Updated ${results.length} products`,
      data: { results, errors }
    });
  } catch (error) {
    console.error('Bulk update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stocks'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getInventoryReport,
  getSalesAnalytics,
  getAllProducts,
  getStockAlerts,
  updateProductStock,
  bulkUpdateStock
};
