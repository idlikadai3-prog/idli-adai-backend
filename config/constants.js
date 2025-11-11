import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION_HOURS || '24h';
export const PORT = process.env.PORT || 5000;

export const CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:3000'];

export const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
export const USER_ROLES = ['buyer', 'seller'];

