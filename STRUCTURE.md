# Backend Folder Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   └── constants.js       # App constants (JWT, PORT, etc.)
│
├── models/                 # MongoDB models/schemas
│   ├── User.js            # User model
│   ├── LoginHistory.js    # Login history model
│   ├── MenuItem.js        # Menu item model
│   └── Order.js           # Order model
│
├── controllers/           # Business logic
│   ├── auth.controller.js # Authentication logic
│   ├── menu.controller.js# Menu management logic
│   └── order.controller.js# Order management logic
│
├── routes/                 # API routes
│   ├── auth.routes.js     # Authentication routes
│   ├── menu.routes.js     # Menu routes
│   └── order.routes.js    # Order routes
│
├── middleware/            # Custom middleware
│   ├── auth.middleware.js # JWT authentication
│   └── ip.middleware.js   # IP capture middleware
│
├── utils/                  # Utility functions
│   ├── password.js        # Password hashing/verification
│   └── jwt.js             # JWT token creation/verification
│
├── server.js               # Main server file
├── package.json           # Dependencies
└── .env                   # Environment variables
```

## File Responsibilities

### Config
- **database.js**: Handles MongoDB connection
- **constants.js**: Stores app-wide constants (JWT secret, PORT, etc.)

### Models
- Define MongoDB schemas and models
- Each model in its own file for better organization

### Controllers
- Contains business logic for each feature
- Handles request/response
- Interacts with models

### Routes
- Defines API endpoints
- Maps routes to controller functions
- Applies middleware

### Middleware
- **auth.middleware.js**: JWT token verification and role checking
- **ip.middleware.js**: Captures client IP address

### Utils
- Reusable utility functions
- Password hashing/verification
- JWT token operations

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single responsibility
2. **Maintainability**: Easy to find and modify code
3. **Scalability**: Easy to add new features
4. **Testability**: Each module can be tested independently
5. **Readability**: Clear organization makes code easier to understand

