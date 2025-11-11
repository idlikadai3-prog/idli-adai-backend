import express from 'express';
import cors from 'cors';
import mongoose, { connectDB } from './config/database.js';
import { PORT, CORS_ORIGINS } from './config/constants.js';
import { captureIP } from './middleware/ip.middleware.js';
import { initSeller } from './controllers/auth.controller.js';
import { verifyEmailTransport } from './services/email.service.js';
import User from './models/User.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/order.routes.js';
import emailRoutes from './routes/email.routes.js';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
}));
// Ensure preflight requests are handled
app.options('*', cors({
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(captureIP);

// Serve static uploads
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB and initialize seller, then start server
connectDB()
  .then(async () => {
    // Ensure email index is not unique (allow up to 3 via app logic)
    try {
      const indexes = await User.collection.indexes();
      const emailIndex = indexes.find(ix => ix.key && ix.key.email === 1 && ix.unique);
      if (emailIndex && emailIndex.name) {
        try {
          await User.collection.dropIndex(emailIndex.name);
          console.log('🔧 Dropped unique email index to allow multiple accounts per email.');
        } catch (dropErr) {
          console.warn('⚠️ Failed to drop unique email index:', dropErr.message);
        }
      }
      // Ensure a non-unique index exists on email for performance
      await User.collection.createIndex({ email: 1 }, { unique: false });
    } catch (ixErr) {
      console.warn('⚠️ Email index ensure step skipped:', ixErr.message);
    }

    initSeller();
    // Verify email transport (non-blocking)
    verifyEmailTransport();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'idli kadai API' });
});

// Health check
app.get('/health', (req, res) => {
  const mongoState = mongoose.connection?.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    mongodb: states[mongoState] || 'unknown'
  });
});

// Auth routes
app.use('/', authRoutes);

// Menu routes
app.use('/menu', menuRoutes);

// Order routes
app.use('/orders', orderRoutes);

// Email routes (health and test)
app.use('/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    detail: 'Internal server error', 
    error: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close().catch(() => {});
  process.exit(0);
});
