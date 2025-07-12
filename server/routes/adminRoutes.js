const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/role', adminController.updateUserRole);

// Inventory management
router.get('/inventory', adminController.getInventoryReport);
router.get('/products', adminController.getAllProducts);
router.get('/stock-alerts', adminController.getStockAlerts);
router.put('/products/:productId/stock', adminController.updateProductStock);
router.put('/products/bulk-stock-update', adminController.bulkUpdateStock);

// Analytics
router.get('/analytics', adminController.getSalesAnalytics);

module.exports = router;
