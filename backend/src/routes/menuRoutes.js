const express = require('express');
const MenuItemController = require('../controllers/MenuItemController');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/authorize');

const router = express.Router();

// Public routes
router.get('/', MenuItemController.getAllMenuItems);
router.get('/:id', MenuItemController.getMenuItemById);

// Admin only routes
router.post(
  '/',
  authenticateToken,
  authorizeRole(['Admin']),
  MenuItemController.createMenuItem
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['Admin']),
  MenuItemController.updateMenuItem
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['Admin']),
  MenuItemController.deleteMenuItem
);

module.exports = router;
