const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const MenuItemModel = require('../models/MenuItemModel');

class OrderService {
  // Create order with items
  static async createOrder(userId, items) {
    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    let totalAmount = 0;

    // Validate all items and calculate total
    for (const item of items) {
      const menuItem = await MenuItemModel.findById(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }

      if (!menuItem.availability_status) {
        throw new Error(`Menu item ${menuItem.name} is not available`);
      }

      totalAmount += menuItem.price * item.quantity;
    }

    // Create order
    const orderResult = await OrderModel.create(userId, totalAmount);
    const orderId = orderResult.id;

    // Add order items
    for (const item of items) {
      const menuItem = await MenuItemModel.findById(item.menuItemId);
      await OrderItemModel.create(orderId, item.menuItemId, item.quantity, menuItem.price);
    }

    return { id: orderId, userId, totalAmount, status: 'pending' };
  }

  // Get order by ID with items
  static async getOrderById(orderId) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const items = await OrderItemModel.getByOrderId(orderId);
    return { ...order, items };
  }

  // Get all orders for a user
  static async getUserOrders(userId) {
    const orders = await OrderModel.getByUserId(userId);
    const ordersWithItems = [];

    for (const order of orders) {
      const items = await OrderItemModel.getByOrderId(order.id);
      ordersWithItems.push({ ...order, items });
    }

    return ordersWithItems;
  }

  // Get all orders (Admin only)
  static async getAllOrders() {
    const orders = await OrderModel.getAll();
    const ordersWithItems = [];

    for (const order of orders) {
      const items = await OrderItemModel.getByOrderId(order.id);
      ordersWithItems.push({ ...order, items });
    }

    return ordersWithItems;
  }

  // Update order status (Admin only)
  static async updateOrderStatus(orderId, status) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid order status');
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await OrderModel.updateStatus(orderId, status);
    return { id: orderId, status };
  }
}

module.exports = OrderService;
