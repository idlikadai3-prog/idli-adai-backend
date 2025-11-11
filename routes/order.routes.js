import express from 'express';
import {
  createOrder,
  getOrders,
  updateOrderStatus
} from '../controllers/order.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireSeller } from '../middleware/auth.middleware.js';
import { validateOrder } from '../middleware/validation.middleware.js';

const router = express.Router();

// Protected routes
router.post('/', authenticateToken, validateOrder, createOrder);
router.get('/', authenticateToken, getOrders);
router.put('/:order_id/status', authenticateToken, requireSeller, updateOrderStatus);

export default router;

