const OrderService = require('../services/OrderService');

class OrderController {
  // Create order
  static async createOrder(req, res) {
    try {
      const { items } = req.body;
      const userId = req.user.id;

      const order = await OrderService.createOrder(userId, items);
      res.status(201).json({
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get order by ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);

      // Check if user is authorized to view this order (unless admin)
      if (req.user.role !== 'Admin' && order.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to view this order' });
      }

      res.status(200).json({
        message: 'Order retrieved successfully',
        data: order,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Get user orders
  static async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await OrderService.getUserOrders(userId);
      res.status(200).json({
        message: 'User orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all orders (Admin only)
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({
        message: 'All orders retrieved successfully',
        data: orders,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update order status (Admin only)
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await OrderService.updateOrderStatus(id, status);
      res.status(200).json({
        message: 'Order status updated successfully',
        data: order,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
