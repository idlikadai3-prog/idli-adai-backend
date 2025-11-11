import User from '../models/User.js';
import LoginHistory from '../models/LoginHistory.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

// Initialize default seller
export const initSeller = async () => {
  try {
    const seller = await User.findOne({ username: 'seller' });
    if (!seller) {
      const hashedPassword = await bcrypt.hash('seller123', 10);
      await User.create({
        username: 'seller',
        email: 'seller@koththu.com',
        hashed_password: hashedPassword,
        role: 'seller'
      });
      console.log('Default seller created: username="seller", password="seller123"');
    }
  } catch (error) {
    console.error('Error initializing seller:', error);
  }
};

// Register user (buyer-only via public endpoint)
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Reject attempts to register as seller via public route
    if (role === 'seller') {
      return res.status(403).json({
        detail: 'Seller registration is not allowed via public signup'
      });
    }

    // Validate role value if provided
    if (role && !['buyer', 'seller'].includes(role)) {
      return res.status(400).json({ 
        detail: "Invalid role. Must be 'buyer' or 'seller'" 
      });
    }

    // Force buyer role for public registration
    const userRole = 'buyer';

    // Enforce unique username
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return res.status(400).json({ detail: 'Username already registered' });
    }

    // Allow up to 3 users per email
    const emailLower = (email || '').toLowerCase();
    const emailCount = await User.countDocuments({ email: emailLower });
    if (emailCount >= 3) {
      return res.status(400).json({ detail: 'This email has reached the maximum of 3 accounts' });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      email: emailLower,
      hashed_password: hashedPassword,
      role: userRole
    });

    // Log registration
    await LoginHistory.create({
      user_id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      action: 'registration',
      success: true,
      ip_address: req.clientIP,
      timestamp: new Date()
    });

    res.status(200).json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      detail: 'Registration failed', 
      error: error.message 
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        detail: 'Username and password are required' 
      });
    }

    const user = await User.findOne({ username });
    let loginSuccess = false;
    let loginError = null;

    if (!user) {
      loginError = 'User not found';
    } else {
      const isValidPassword = await verifyPassword(password, user.hashed_password);
      if (!isValidPassword) {
        loginError = 'Incorrect password';
      } else {
        loginSuccess = true;
      }
    }

    // Log login attempt
    await LoginHistory.create({
      username,
      user_id: user ? user._id.toString() : null,
      role: user ? user.role : null,
      action: 'login',
      success: loginSuccess,
      error: loginError,
      ip_address: req.clientIP,
      timestamp: new Date()
    });

    if (!loginSuccess) {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }

    const access_token = createToken(user.username);

    res.json({
      access_token,
      token_type: 'bearer',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      detail: 'Login failed', 
      error: error.message 
    });
  }
};

// Get current user
export const getCurrentUser = (req, res) => {
  res.json({
    id: req.user._id.toString(),
    username: req.user.username,
    email: req.user.email,
    role: req.user.role
  });
};

// Get login history (seller only)
export const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    const formattedHistory = history.map(item => ({
      id: item._id.toString(),
      username: item.username,
      user_id: item.user_id,
      role: item.role,
      action: item.action,
      success: item.success,
      error: item.error,
      ip_address: item.ip_address,
      timestamp: item.timestamp
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Login history error:', error);
    res.status(500).json({ 
      detail: 'Failed to fetch login history', 
      error: error.message 
    });
  }
};

// Create a seller account (seller-only action)
export const createSeller = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation (more detailed checks are in validation middleware, but keep guardrails here too)
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ detail: 'Username must be at least 3 characters' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ detail: 'Valid email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ detail: 'Password must be at least 6 characters' });
    }

    // Enforce unique username
    const existingByUsername = await User.findOne({ username });
    if (existingByUsername) {
      return res.status(400).json({ detail: 'Username already registered' });
    }

    // Allow up to 3 users per email
    const emailLower = (email || '').toLowerCase();
    const emailCount = await User.countDocuments({ email: emailLower });
    if (emailCount >= 3) {
      return res.status(400).json({ detail: 'This email has reached the maximum of 3 accounts' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      username,
      email: emailLower,
      hashed_password: hashedPassword,
      role: 'seller'
    });

    await LoginHistory.create({
      user_id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      action: 'create_seller',
      success: true,
      ip_address: req.clientIP,
      timestamp: new Date()
    });

    res.status(201).json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Create seller error:', error);
    // Handle duplicate key errors gracefully
    if (error?.code === 11000) {
      const dupField = Object.keys(error.keyValue || {})[0];
      const fieldName = dupField === 'username' ? 'Username' : dupField === 'email' ? 'Email' : 'Field';
      return res.status(400).json({ detail: `${fieldName} already registered` });
    }
    res.status(500).json({
      detail: 'Failed to create seller',
      error: error.message
    });
  }
};

