const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const RoleModel = require('../models/RoleModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class AuthService {
  // Register new user
  static async register(name, email, password, roleName = 'Customer') {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Get role ID
    let role = await RoleModel.findByName(roleName);
    if (!role) {
      // Create role if it doesn't exist
      const roleResult = await RoleModel.create(roleName);
      role = { id: roleResult.id };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await UserModel.create(name, email, hashedPassword, role.id);

    // Return JWT token
    const token = jwt.sign(
      { id: userResult.id, email, role: roleName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { id: userResult.id, email, token };
  }

  // Login user
  static async login(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role_name,
      token,
    };
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  // Get user by ID
  static async getUserById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = AuthService;
