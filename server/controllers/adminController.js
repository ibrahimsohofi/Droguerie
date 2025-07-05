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

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getInventoryReport,
  getSalesAnalytics
};
