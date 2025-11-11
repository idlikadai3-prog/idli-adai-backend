# Quick Start Guide

## 🚀 Start the Server

```bash
cd backend
npm install
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server will run at: **http://localhost:8000**

---

## 📋 Quick Endpoint Reference

### Base URL
```
http://localhost:8000
```

### Authentication Endpoints

| Method | Endpoint | Auth Required | Role |
|--------|----------|---------------|------|
| POST | `/register` | No | - |
| POST | `/token` | No | - |
| GET | `/me` | Yes | Any |
| GET | `/login-history` | Yes | Seller |

### Menu Endpoints

| Method | Endpoint | Auth Required | Role |
|--------|----------|---------------|------|
| GET | `/menu` | No | - |
| POST | `/menu` | Yes | Seller |
| PUT | `/menu/{item_id}` | Yes | Seller |
| DELETE | `/menu/{item_id}` | Yes | Seller |

### Order Endpoints

| Method | Endpoint | Auth Required | Role |
|--------|----------|---------------|------|
| POST | `/orders` | Yes | Buyer |
| GET | `/orders` | Yes | Any |
| PUT | `/orders/{order_id}/status` | Yes | Seller |

---

## 🔑 Default Seller Account

- **Username:** `seller`
- **Password:** `seller123`

---

## 📝 Postman Testing Examples

### 1. Register Buyer
```
POST http://localhost:8000/register
Content-Type: application/json

{
  "username": "buyer1",
  "email": "buyer1@test.com",
  "password": "buyer123",
  "role": "buyer"
}
```

### 2. Login
```
POST http://localhost:8000/token
Content-Type: application/x-www-form-urlencoded

username=buyer1
password=buyer123
```

**Save the `access_token` from response!**

### 3. Get Current User
```
GET http://localhost:8000/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 4. View Login History (Seller Only)
```
GET http://localhost:8000/login-history
Authorization: Bearer SELLER_ACCESS_TOKEN
```

---

## 🧪 Test Flow

1. Register buyer → Get user ID
2. Register seller → Get user ID  
3. Login as buyer → Save token
4. Login as seller → Save token
5. Test `/me` with buyer token
6. Test `/login-history` with seller token ✅
7. Test `/login-history` with buyer token ❌ (should fail)

---

For detailed instructions, see `POSTMAN_TESTING_GUIDE.md`

