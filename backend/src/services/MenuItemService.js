const MenuItemModel = require('../models/MenuItemModel');

class MenuItemService {
  // Create menu item (Admin only)
  static async createMenuItem(name, description, price, imageUrl) {
    if (!name || !price) {
      throw new Error('Name and price are required');
    }

    const result = await MenuItemModel.create(name, description, price, imageUrl);
    return { id: result.id, name, description, price, imageUrl };
  }

  // Get all menu items
  static async getAllMenuItems() {
    const items = await MenuItemModel.getAll();
    return items;
  }

  // Get menu item by ID
  static async getMenuItemById(id) {
    const item = await MenuItemModel.findById(id);
    if (!item) {
      throw new Error('Menu item not found');
    }
    return item;
  }

  // Update menu item (Admin only)
  static async updateMenuItem(id, name, description, price, imageUrl, availabilityStatus) {
    const item = await MenuItemModel.findById(id);
    if (!item) {
      throw new Error('Menu item not found');
    }

    await MenuItemModel.update(id, name, description, price, imageUrl, availabilityStatus);
    return { id, name, description, price, imageUrl, availabilityStatus };
  }

  // Delete menu item (Admin only)
  static async deleteMenuItem(id) {
    const item = await MenuItemModel.findById(id);
    if (!item) {
      throw new Error('Menu item not found');
    }

    await MenuItemModel.delete(id);
    return { message: 'Menu item deleted successfully' };
  }
}

module.exports = MenuItemService;
