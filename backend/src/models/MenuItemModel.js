const db = require('../database/database');

class MenuItemModel {
  static create(name, description, price, imageUrl) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO menu_items (name, description, price, image_url) 
        VALUES (?, ?, ?, ?)
      `;
      db.run(query, [name, description, price, imageUrl], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM menu_items WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM menu_items ORDER BY name';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static update(id, name, description, price, imageUrl, availabilityStatus) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE menu_items 
        SET name = ?, description = ?, price = ?, image_url = ?, availability_status = ? 
        WHERE id = ?
      `;
      db.run(query, [name, description, price, imageUrl, availabilityStatus, id], (err) => {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM menu_items WHERE id = ?';
      db.run(query, [id], (err) => {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = MenuItemModel;
