const db = require('../database/database');

class OrderItemModel {
  static create(orderId, menuItemId, quantity, price) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO order_items (order_id, menu_item_id, quantity, price) 
        VALUES (?, ?, ?, ?)
      `;
      db.run(query, [orderId, menuItemId, quantity, price], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  static getByOrderId(orderId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT oi.*, mi.name, mi.description 
        FROM order_items oi 
        JOIN menu_items mi ON oi.menu_item_id = mi.id 
        WHERE oi.order_id = ?
      `;
      db.all(query, [orderId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}

module.exports = OrderItemModel;
