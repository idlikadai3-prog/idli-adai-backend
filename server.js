// server.js
import express from "express";
import cors from "cors";
import mongoose, { connectDB } from "./config/database.js";
import { PORT, CORS_ORIGINS } from "./config/constants.js";
import { captureIP } from "./middleware/ip.middleware.js";
import { initSeller } from "./controllers/auth.controller.js";
import { verifyEmailTransport } from "./services/email.service.js";
import User from "./models/User.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(captureIP);

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB and start server
connectDB().then(async () => {
  try {
    // Ensure non-unique email index
    const indexes = await User.collection.indexes();
    const emailIndex = indexes.find(
      (ix) => ix.key && ix.key.email === 1 && ix.unique
    );
    if (emailIndex && emailIndex.name) {
      await User.collection.dropIndex(emailIndex.name);
      console.log("🔧 Dropped unique email index for email field.");
    }
    await User.collection.createIndex({ email: 1 }, { unique: false });
  } catch (ixErr) {
    console.warn("⚠️ Email index ensure step skipped:", ixErr.message);
  }

  // Init seller + verify email
  initSeller();
  verifyEmailTransport();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

// Routes
app.get("/", (req, res) => res.json({ message: "idli kadai API" }));

app.get("/health", (req, res) => {
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    mongodb: states[mongoose.connection?.readyState] || "unknown",
  });
});

// Attach routes
app.use("/", authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/email", emailRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ detail: "Internal server error", error: err.message });
});

// 404 handler
app.use((req, res) => res.status(404).json({ detail: "Route not found" }));

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
