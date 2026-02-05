const express = require('express');
const OrderController = require('../controllers/OrderController');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');

const router = express.Router();

// Protected routes - all order routes require authentication
router.post('/', authenticateToken, OrderController.createOrder);
router.get('/my-orders', authenticateToken, OrderController.getUserOrders);
router.get('/:id', authenticateToken, OrderController.getOrderById);

// Admin only routes
router.get('/', authenticateToken, authorizeRole(['Admin']), OrderController.getAllOrders);
router.put(
  '/:id/status',
  authenticateToken,
  authorizeRole(['Admin']),
  OrderController.updateOrderStatus
);

module.exports = router;
