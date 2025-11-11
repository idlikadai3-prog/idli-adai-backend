# Postman Testing Guide

## Starting the Server

### Prerequisites
1. Make sure MongoDB is running on your system
2. Install Node.js dependencies:
   ```bash
   cd backend
   npm install
   ```

### Start the Server

**Option 1: Production mode**
```bash
cd backend
npm start
```

**Option 2: Development mode (with auto-reload)**
```bash
cd backend
npm run dev
```

The server will start at: **http://localhost:8000**

You can verify it's running by visiting: http://localhost:8000 (should show `{"message":"Koththu Shop API"}`)

---

## API Endpoints for Postman Testing

### Base URL
```
http://localhost:8000
```

---

## 1. Register a Buyer

**Method:** `POST`  
**URL:** `http://localhost:8000/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "buyer1",
  "email": "buyer1@test.com",
  "password": "buyer123",
  "role": "buyer"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "username": "buyer1",
  "email": "buyer1@test.com",
  "role": "buyer"
}
```

---

## 2. Register a Seller

**Method:** `POST`  
**URL:** `http://localhost:8000/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "seller1",
  "email": "seller1@test.com",
  "password": "seller123",
  "role": "seller"
}
```

**Expected Response (200 OK):**
```json
{
  "id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "username": "seller1",
  "email": "seller1@test.com",
  "role": "seller"
}
```

---

## 3. Login as Buyer

**Method:** `POST`  
**URL:** `http://localhost:8000/token`  
**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Body (x-www-form-urlencoded):**
```
username: buyer1
password: buyer123
```

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "username": "buyer1",
    "email": "buyer1@test.com",
    "role": "buyer"
  }
}
```

**⚠️ Important:** Save the `access_token` for authenticated requests!

---

## 4. Login as Seller

**Method:** `POST`  
**URL:** `http://localhost:8000/token`  
**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Body (x-www-form-urlencoded):**
```
username: seller
password: seller123
```

**Note:** This uses the default seller account created on server startup.

**Expected Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "username": "seller",
    "email": "seller@koththu.com",
    "role": "seller"
  }
}
```

---

## 5. Get Current User Info

**Method:** `GET`  
**URL:** `http://localhost:8000/me`  
**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "id": "...",
  "username": "buyer1",
  "email": "buyer1@test.com",
  "role": "buyer"
}
```

---

## 6. View Login History (Seller Only)

**Method:** `GET`  
**URL:** `http://localhost:8000/login-history`  
**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN_HERE
```

**Expected Response (200 OK):**
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
    "timestamp": "2024-01-15T10:30:00.000000"
  },
  {
    "id": "...",
    "username": "seller",
    "user_id": "...",
    "role": "seller",
    "action": "registration",
    "success": true,
    "error": null,
    "ip_address": "unknown",
    "timestamp": "2024-01-15T10:00:00.000000"
  }
]
```

**Note:** This endpoint is only accessible by sellers. Buyers will get a 403 Forbidden error.

---

## 7. Test Failed Login (to verify logging)

**Method:** `POST`  
**URL:** `http://localhost:8000/token`  
**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Body (x-www-form-urlencoded):**
```
username: buyer1
password: wrongpassword
```

**Expected Response (401 Unauthorized):**
```json
{
  "detail": "Incorrect username or password"
}
```

**Note:** This failed attempt will still be logged in the database!

---

## 8. Get Menu Items

**Method:** `GET`  
**URL:** `http://localhost:8000/menu`  
**Headers:** None required (public endpoint)

**Expected Response (200 OK):**
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

---

## 9. Create Menu Item (Seller Only)

**Method:** `POST`  
**URL:** `http://localhost:8000/menu`  
**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Chicken Koththu",
  "description": "Spicy chicken koththu roti with vegetables",
  "price": 450.0,
  "category": "Koththu",
  "available": true
}
```

**Expected Response (200 OK):**
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

---

## 10. Update Menu Item (Seller Only)

**Method:** `PUT`  
**URL:** `http://localhost:8000/menu/{item_id}`  
**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Chicken Koththu",
  "description": "Updated description",
  "price": 500.0,
  "category": "Koththu",
  "available": true
}
```

---

## 11. Delete Menu Item (Seller Only)

**Method:** `DELETE`  
**URL:** `http://localhost:8000/menu/{item_id}`  
**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN_HERE
```

---

## 12. Create Order

**Method:** `POST`  
**URL:** `http://localhost:8000/orders`  
**Headers:**
```
Authorization: Bearer BUYER_ACCESS_TOKEN_HERE
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "items": [
    {
      "menu_item_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "quantity": 2,
      "name": "Chicken Koththu",
      "price": 450.0
    }
  ],
  "total": 900.0,
  "customer_name": "John Doe",
  "customer_phone": "0771234567"
}
```

---

## 13. Get Orders

**Method:** `GET`  
**URL:** `http://localhost:8000/orders`  
**Headers:**
```
Authorization: Bearer ACCESS_TOKEN_HERE
```

**Note:** 
- Buyers see only their own orders
- Sellers see all orders

---

## 14. Update Order Status (Seller Only)

**Method:** `PUT`  
**URL:** `http://localhost:8000/orders/{order_id}/status?status=preparing`  
**Headers:**
```
Authorization: Bearer SELLER_ACCESS_TOKEN_HERE
```

**Query Parameters:**
- `status`: One of: `pending`, `preparing`, `ready`, `completed`, `cancelled`

---

## Postman Collection Setup Tips

### 1. Create Environment Variables
In Postman, create an environment with:
- `base_url`: `http://localhost:8000`
- `buyer_token`: (set after buyer login)
- `seller_token`: (set after seller login)

### 2. Use Pre-request Scripts
For login endpoints, you can use this script to automatically save tokens:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("buyer_token", jsonData.access_token);
}
```

### 3. Use Authorization Tab
For protected endpoints, use the Authorization tab:
- Type: Bearer Token
- Token: `{{buyer_token}}` or `{{seller_token}}`

---

## Testing Flow

1. **Register a buyer** → Save user ID
2. **Register a seller** → Save user ID
3. **Login as buyer** → Save access token
4. **Login as seller** → Save access token
5. **Get current user** (test with buyer token)
6. **View login history** (test with seller token - should work)
7. **View login history** (test with buyer token - should fail with 403)
8. **Create menu item** (test with seller token)
9. **Get menu** (no token needed)
10. **Create order** (test with buyer token)
11. **Get orders** (test with both tokens to see difference)

---

## Common Issues

### Issue: "Connection refused"
**Solution:** Make sure the server is running on port 8000

### Issue: "401 Unauthorized"
**Solution:** Check that you're including the Bearer token in the Authorization header

### Issue: "403 Forbidden"
**Solution:** You're trying to access a seller-only endpoint with a buyer token

### Issue: "422 Validation Error"
**Solution:** Check that your JSON body matches the expected format

### Issue: "MongoDB connection error"
**Solution:** Make sure MongoDB is running on your system

### Issue: "Cannot find module"
**Solution:** Run `npm install` in the backend directory

---

## Default Credentials

**Default Seller Account:**
- Username: `seller`
- Password: `seller123`

This account is created automatically when the server starts.

