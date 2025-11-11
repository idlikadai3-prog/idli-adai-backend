import express from 'express';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menu.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requireSeller } from '../middleware/auth.middleware.js';
import { validateMenuItem } from '../middleware/validation.middleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, `menu-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

// Public route
router.get('/', getMenu);

// Protected routes (seller only)
router.post('/', authenticateToken, requireSeller, upload.single('image'), validateMenuItem, createMenuItem);
router.put('/:item_id', authenticateToken, requireSeller, upload.single('image'), validateMenuItem, updateMenuItem);
router.delete('/:item_id', authenticateToken, requireSeller, deleteMenuItem);

export default router;

