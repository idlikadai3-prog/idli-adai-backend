# Authentication System Summary

## Overview

The backend now supports two user roles:
- **Buyer**: Regular users who can browse menu and place orders
- **Seller**: Admin users who can manage menu items and orders

## Features Implemented

### 1. User Registration
- **Endpoint**: `POST /register`
- **Roles**: Supports both "buyer" and "seller" roles
- **Validation**: 
  - Username must be unique
  - Email must be unique
  - Role must be either "buyer" or "seller"
- **Logging**: All registrations are logged in the `login_history` collection

### 2. User Login
- **Endpoint**: `POST /token`
- **Authentication**: Uses JWT tokens
- **Logging**: 
  - All login attempts are logged (successful and failed)
  - Logs include:
    - Username
    - User ID (if user exists)
    - Role (if user exists)
    - Success/failure status
    - Error message (if failed)
    - IP address (captured via middleware)
    - Timestamp

### 3. Login History
- **Endpoint**: `GET /login-history`
- **Access**: Seller only
- **Returns**: Last 100 login/registration events

### 4. Default Seller Account
- **Username**: `seller`
- **Password**: `seller123`
- Created automatically on server startup if it doesn't exist

## Database Collections

### `users` Collection
Stores user accounts with:
- `username`: Unique username
- `email`: Unique email
- `hashed_password`: Bcrypt hashed password
- `role`: "buyer" or "seller"
- `created_at`: Registration timestamp

### `login_history` Collection
Stores all authentication events:
- `username`: Username used in login attempt
- `user_id`: User ID (if user exists)
- `role`: User role (if user exists)
- `action`: "login" or "registration"
- `success`: Boolean indicating success
- `error`: Error message (if failed)
- `ip_address`: Client IP address
- `timestamp`: Event timestamp

## API Endpoints

### Public Endpoints
- `POST /register` - Register new user (buyer or seller)
- `POST /token` - Login and get JWT token

### Protected Endpoints (Require Authentication)
- `GET /me` - Get current user info
- `GET /login-history` - Get login history (seller only)
- `GET /menu` - Get menu items
- `POST /menu` - Create menu item (seller only)
- `PUT /menu/{item_id}` - Update menu item (seller only)
- `DELETE /menu/{item_id}` - Delete menu item (seller only)
- `POST /orders` - Create order
- `GET /orders` - Get orders (buyer sees own, seller sees all)
- `PUT /orders/{order_id}/status` - Update order status (seller only)

## Testing

Run the test script:
```bash
python test_auth.py
```

This will:
1. Register a test buyer
2. Register a test seller
3. Test login for both
4. Test failed login (to verify logging)
5. View login history

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Tokens**: Secure token-based authentication
3. **Role-Based Access**: Endpoints protected by role
4. **Login Logging**: All login attempts logged for security monitoring
5. **IP Tracking**: Client IP addresses captured (when available)

## Next Steps

1. Test the authentication system using `test_auth.py`
2. Verify login history is being stored in MongoDB
3. Update frontend to use "buyer" and "seller" roles instead of "user" and "admin"

