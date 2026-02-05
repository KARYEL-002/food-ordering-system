const db = require('../database/database');

class RoleModel {
  static create(roleName) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO roles (role_name) VALUES (?)';
      db.run(query, [roleName], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  static findByName(roleName) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM roles WHERE role_name = ?';
      db.get(query, [roleName], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM roles';
      db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }
}

module.exports = RoleModel;
