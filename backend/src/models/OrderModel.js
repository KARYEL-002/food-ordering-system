const db = require('../database/database');

class OrderModel {
  static create(userId, totalAmount) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)';
      db.run(query, [userId, totalAmount, 'pending'], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders WHERE id = ?';
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
      db.all(query, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM orders ORDER BY created_at DESC';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  static updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE orders SET status = ? WHERE id = ?';
      db.run(query, [status, id], (err) => {
        if (err) reject(err);
        else resolve({ id });
      });
    });
  }
}

module.exports = OrderModel;
