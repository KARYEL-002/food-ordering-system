const db = require('../database/database');

class UserModel {
  static create(name, email, hashedPassword, roleId) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)';
      db.run(query, [name, email, hashedPassword, roleId], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.email = ?
      `;
      db.get(query, [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.*, r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id 
        WHERE u.id = ?
      `;
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id, u.name, u.email, u.created_at, r.role_name 
        FROM users u 
        JOIN roles r ON u.role_id = r.id
      `;
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = UserModel;
