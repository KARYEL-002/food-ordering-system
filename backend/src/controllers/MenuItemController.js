const MenuItemService = require('../services/MenuItemService');

class MenuItemController {
  // Create menu item (Admin only)
  static async createMenuItem(req, res) {
    try {
      const { name, description, price, imageUrl } = req.body;
      const menuItem = await MenuItemService.createMenuItem(name, description, price, imageUrl);
      res.status(201).json({
        message: 'Menu item created successfully',
        data: menuItem,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all menu items
  static async getAllMenuItems(req, res) {
    try {
      const items = await MenuItemService.getAllMenuItems();
      res.status(200).json({
        message: 'Menu items retrieved successfully',
        data: items,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get menu item by ID
  static async getMenuItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await MenuItemService.getMenuItemById(id);
      res.status(200).json({
        message: 'Menu item retrieved successfully',
        data: item,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update menu item (Admin only)
  static async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, imageUrl, availabilityStatus } = req.body;
      const menuItem = await MenuItemService.updateMenuItem(
        id,
        name,
        description,
        price,
        imageUrl,
        availabilityStatus
      );
      res.status(200).json({
        message: 'Menu item updated successfully',
        data: menuItem,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete menu item (Admin only)
  static async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      const result = await MenuItemService.deleteMenuItem(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = MenuItemController;
