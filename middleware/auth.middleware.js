import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ detail: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const user = await User.findOne({ username: decoded.sub });

    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
};

export const requireSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ 
      detail: 'Not enough permissions. Seller access required.' 
    });
  }
  next();
};

