const AuthService = require('../services/AuthService');

class AuthController {
  // Register endpoint
  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      const user = await AuthService.register(name, email, password, role || 'Customer');
      res.status(201).json({
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Login endpoint
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await AuthService.login(email, password);
      res.status(200).json({
        message: 'Login successful',
        data: user,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      const user = await AuthService.getUserById(req.user.id);
      res.status(200).json({
        message: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
