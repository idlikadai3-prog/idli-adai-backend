import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  getLoginHistory,
  createSeller
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireSeller } from '../middleware/auth.middleware.js';
import { validateRegister } from '../middleware/validation.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/token', login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.get('/login-history', authenticateToken, requireSeller, getLoginHistory);

// Seller management (create new seller accounts)
router.post('/sellers', authenticateToken, requireSeller, createSeller);
router.post('/auth/sellers', authenticateToken, requireSeller, createSeller); // alias for compatibility
router.post('/admin/sellers', authenticateToken, requireSeller, createSeller); // alias for frontend fallback

export default router;

