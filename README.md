# Koththu Shop Backend (Node.js/Express)

A well-organized Node.js Express backend for the Koththu Shop application with a clean MVC-like architecture.

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   └── constants.js       # App constants
│
├── models/                 # MongoDB models
│   ├── User.js
│   ├── LoginHistory.js
│   ├── MenuItem.js
│   └── Order.js
│
├── controllers/           # Business logic
│   ├── auth.controller.js
│   ├── menu.controller.js
│   └── order.controller.js
│
├── routes/                 # API routes
│   ├── auth.routes.js
│   ├── menu.routes.js
│   └── order.routes.js
│
├── middleware/            # Custom middleware
│   ├── auth.middleware.js
│   └── ip.middleware.js
│
├── utils/                  # Utility functions
│   ├── password.js
│   └── jwt.js
│
├── server.js               # Main entry point
└── package.json
```

## 🚀 Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=koththu_shop
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION_HOURS=24h
PORT=8000
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 📋 API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /token` - Login
- `GET /me` - Get current user
- `GET /login-history` - Get login history (seller only)

### Menu
- `GET /menu` - Get all menu items
- `POST /menu` - Create menu item (seller only)
- `PUT /menu/:item_id` - Update menu item (seller only)
- `DELETE /menu/:item_id` - Delete menu item (seller only)

### Orders
- `POST /orders` - Create order
- `GET /orders` - Get orders
- `PUT /orders/:order_id/status` - Update order status (seller only)

## 🔑 Default Seller Account

- Username: `seller`
- Password: `seller123`

## 📚 Code Organization

### Models (`models/`)
- Define MongoDB schemas
- Each model in separate file
- Validation and schema definitions

### Controllers (`controllers/`)
- Business logic
- Request/response handling
- Database operations

### Routes (`routes/`)
- API endpoint definitions
- Route-to-controller mapping
- Middleware application

### Middleware (`middleware/`)
- Authentication/authorization
- Request processing
- IP capture

### Utils (`utils/`)
- Reusable helper functions
- Password hashing
- JWT operations

### Config (`config/`)
- Database connection
- App constants
- Environment configuration

## 🧪 Testing

See `POSTMAN_TESTING_GUIDE.md` for detailed testing instructions.

## 📖 Documentation

- `STRUCTURE.md` - Detailed folder structure explanation
- `POSTMAN_TESTING_GUIDE.md` - API testing guide
- `QUICK_START.md` - Quick reference
