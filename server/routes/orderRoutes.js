const express = require('express');
const orderController = require('../controllers/orderController');
const OrderTrackingController = require('../controllers/orderTrackingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public tracking route
router.get('/track/:trackingNumber', orderController.trackOrder);

// User routes
router.post('/', orderController.placeOrder);
router.get('/user/:userId', orderController.getOrdersByUser);

// Admin routes
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.put('/:orderId/status', protect, adminOnly, orderController.updateOrderStatus);
router.get('/:orderId/history', orderController.getOrderStatusHistory);
router.delete('/:orderId', protect, adminOnly, orderController.deleteOrder);

// Enhanced tracking routes
router.get('/tracking/:identifier', OrderTrackingController.trackOrder);
router.put('/tracking/:orderId/status', protect, adminOnly, OrderTrackingController.updateOrderStatus);
router.get('/statuses', OrderTrackingController.getOrderStatuses);
router.put('/batch-update', protect, adminOnly, OrderTrackingController.batchUpdateOrders);

module.exports = router;
