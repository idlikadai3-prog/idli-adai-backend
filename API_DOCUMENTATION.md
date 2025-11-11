# API Documentation - Koththu Shop

Complete API documentation for all endpoints and their purposes.

## Base URL
```
http://localhost:8000
```

---

## 🔐 Authentication APIs

### 1. Register User
**Purpose:** Create a new buyer or seller account

**Endpoint:** `POST /register`

**Auth Required:** No

**Request Body (JSON):**
```json
{
  "username": "buyer1",
  "email": "buyer1@example.com",
  "password": "password123",
  "role": "buyer"  // or "seller"
}
```

**Response (200 OK):**
```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "username": "buyer1",
  "email": "buyer1@example.com",
  "role": "buyer"
}
```

**What it does:**
- Creates a new user account
- Hashes the password securely
- Logs registration in login_history
- Returns user information

---

### 2. Login
**Purpose:** Authenticate user and get access token

**Endpoint:** `POST /token`

**Auth Required:** No

**Request Body (form-urlencoded or JSON):**
```
username: buyer1
password: password123
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "username": "buyer1",
    "email": "buyer1@example.com",
    "role": "buyer"
  }
}
```

**What it does:**
- Validates username and password
- Logs login attempt (success/failure) in database
- Returns JWT token for authenticated requests
- Returns user information

---

### 3. Get Current User
**Purpose:** Get authenticated user's information

**Endpoint:** `GET /me`

**Auth Required:** Yes (Bearer Token)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200 OK):**
```json
{
  "id": "...",
  "username": "buyer1",
  "email": "buyer1@example.com",
  "role": "buyer"
}
```

**What it does:**
- Returns current authenticated user's details
- Used to verify token validity
- Used to get user role for frontend

---

### 4. Get Login History
**Purpose:** View all login attempts and registrations (Seller only)

**Endpoint:** `GET /login-history`

**Auth Required:** Yes (Bearer Token - Seller only)

**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN
```

**Response (200 OK):**
```json
[
  {
    "id": "...",
    "username": "buyer1",
    "user_id": "...",
    "role": "buyer",
    "action": "login",
    "success": true,
    "error": null,
    "ip_address": "127.0.0.1",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
```

**What it does:**
- Returns last 100 login/registration events
- Shows success/failure status
- Includes IP addresses and timestamps
- Security monitoring for sellers

---

## 🍽️ Menu APIs

### 5. Get Menu Items
**Purpose:** Get all available menu items for buyers to browse

**Endpoint:** `GET /menu`

**Auth Required:** No

**Response (200 OK):**
```json
[
  {
    "id": "...",
    "name": "Chicken Koththu",
    "description": "Spicy chicken koththu roti",
    "price": 450.0,
    "category": "Koththu",
    "available": true
  }
]
```

**What it does:**
- Returns all menu items marked as available
- Used by buyers to browse and select items
- Public endpoint (no authentication needed)

---

### 6. Create Menu Item
**Purpose:** Add new item to menu (Seller only

**Endpoint:** `POST /menu`

**Auth Required:** Yes (Bearer Token - Seller only)

**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "name": "Chicken Koththu",
  "description": "Spicy chicken koththu roti with vegetables",
  "price": 450.0,
  "category": "Koththu",
  "available": true
}
```

**Response (200 OK):**
```json
{
  "id": "...",
  "name": "Chicken Koththu",
  "description": "Spicy chicken koththu roti with vegetables",
  "price": 450.0,
  "category": "Koththu",
  "available": true
}
```

**What it does:**
- Creates new menu item in database
- Only sellers can add items
- Used to manage menu inventory

---

### 7. Update Menu Item
**Purpose:** Edit existing menu item (Seller only)

**Endpoint:** `PUT /menu/:item_id`

**Auth Required:** Yes (Bearer Token - Seller only)

**Request Body (JSON):**
```json
{
  "name": "Chicken Koththu",
  "description": "Updated description",
  "price": 500.0,
  "category": "Koththu",
  "available": true
}
```

**What it does:**
- Updates menu item details
- Can change price, description, availability
- Used to manage menu

---

### 8. Delete Menu Item
**Purpose:** Remove item from menu (Seller only)

**Endpoint:** `DELETE /menu/:item_id`

**Auth Required:** Yes (Bearer Token - Seller only)

**What it does:**
- Permanently removes menu item
- Used to manage menu inventory

---

## 🛒 Order APIs

### 9. Create Order ⭐ (Main Order Flow)
**Purpose:** Buyer places an order with items and customer information

**Endpoint:** `POST /orders`

**Auth Required:** Yes (Bearer Token - Buyer)

**Headers:**
```
Authorization: Bearer BUYER_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body (JSON):**
```json
{
  "items": [
    {
      "menu_item_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "quantity": 2,
      "name": "Chicken Koththu",
      "price": 450.0
    },
    {
      "menu_item_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "quantity": 1,
      "name": "Egg Koththu",
      "price": 350.0
    }
  ],
  "total": 1250.0,
  "customer_name": "John Doe",
  "customer_phone": "0771234567",
  "customer_email": "john@example.com"  // Optional, uses account email if not provided
}
```

**Response (200 OK):**
```json
{
  "id": "...",
  "orderId": "A1B2C3",
  "items": [...],
  "total": 1250.0,
  "customer_name": "John Doe",
  "customer_phone": "0771234567",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z",
  "message": "Order created successfully. Confirmation email sent."
}
```

**What it does:**
1. ✅ **Saves order to database** - Creates order record
2. ✅ **Sends email to buyer** - Order confirmation email with order details
3. ✅ **Sends email to seller** - Immediate notification of new order
4. ✅ **Returns order information** - Confirms order creation

**Email Flow:**
- Buyer receives: "Order Confirmation" email with order details
- Seller receives: "New Order Received" email with order details and customer info

---

### 10. Get Orders
**Purpose:** Get order history

**Endpoint:** `GET /orders`

**Auth Required:** Yes (Bearer Token)

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
```

**Response for Buyer (200 OK):**
```json
[
  {
    "id": "...",
    "items": [...],
    "total": 1250.0,
    "customer_name": "John Doe",
    "customer_phone": "0771234567",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Response for Seller (200 OK):**
```json
[
  // All orders from all buyers
]
```

**What it does:**
- **Buyers:** See only their own orders
- **Sellers:** See all orders from all buyers
- Used to track order history and status

---

### 11. Update Order Status
**Purpose:** Seller updates order status (pending → preparing → ready → completed)

**Endpoint:** `PUT /orders/:order_id/status?status=preparing`

**Auth Required:** Yes (Bearer Token - Seller only)

**Query Parameters:**
- `status`: One of: `pending`, `preparing`, `ready`, `completed`, `cancelled`

**Response (200 OK):**
```json
{
  "message": "Order status updated successfully"
}
```

**What it does:**
- Updates order status in database
- Used by seller to track order progress
- Status flow: pending → preparing → ready → completed

---

## 📧 Email Configuration

To enable email functionality, add to your `.env` file:

```env
# For Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# OR for Custom SMTP
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

**Note:** If email is not configured, orders will still be created but emails won't be sent (logged in console).

---

## 🔄 Complete Order Flow

1. **Buyer browses menu** → `GET /menu`
2. **Buyer places order** → `POST /orders`
   - Order saved to database ✅
   - Email sent to buyer (confirmation) ✅
   - Email sent to seller (notification) ✅
3. **Seller views orders** → `GET /orders`
4. **Seller updates status** → `PUT /orders/:order_id/status?status=preparing`
5. **Buyer checks order status** → `GET /orders`

---

## 🎯 API Summary by Purpose

| Purpose | Endpoint | Method | Auth | Role |
|---------|----------|--------|------|------|
| Register account | `/register` | POST | No | - |
| Login | `/token` | POST | No | - |
| Get user info | `/me` | GET | Yes | Any |
| View login history | `/login-history` | GET | Yes | Seller |
| Browse menu | `/menu` | GET | No | - |
| Add menu item | `/menu` | POST | Yes | Seller |
| Update menu item | `/menu/:item_id` | PUT | Yes | Seller |
| Delete menu item | `/menu/:item_id` | DELETE | Yes | Seller |
| **Place order** | `/orders` | POST | Yes | Buyer |
| View orders | `/orders` | GET | Yes | Any |
| Update order status | `/orders/:order_id/status` | PUT | Yes | Seller |

---

## 📝 Notes

- All timestamps are in UTC
- Order IDs are last 6 characters of MongoDB ObjectId (uppercase)
- Email sending is non-blocking (order created even if email fails)
- All login attempts are logged for security
- IP addresses are captured for login history

