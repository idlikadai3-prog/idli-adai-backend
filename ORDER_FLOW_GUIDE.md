# Complete Order Flow Guide

## 📋 How the Order System Works

### Step-by-Step Order Process

1. **Buyer Browses Menu**
   - Buyer uses: `GET /menu`
   - Sees all available items with prices

2. **Buyer Places Order** ⭐
   - Buyer uses: `POST /orders`
   - Provides: items, quantities, customer info
   - **What happens automatically:**
     - ✅ Order saved to database
     - ✅ Email sent to buyer (confirmation)
     - ✅ Email sent to seller (notification)
     - ✅ Order appears in seller dashboard immediately

3. **Seller Gets Notified**
   - Seller receives email with order details
   - Seller can view order in dashboard: `GET /orders`

4. **Seller Updates Status**
   - Seller uses: `PUT /orders/:order_id/status?status=preparing`
   - Status flow: `pending` → `preparing` → `ready` → `completed`

5. **Buyer Checks Status**
   - Buyer uses: `GET /orders`
   - Sees their order status

---

## 🎯 Main Order API

### `POST /orders` - Place Order

**What it does:**
1. Saves order to database
2. Sends confirmation email to buyer
3. Sends notification email to seller immediately
4. Returns order information

**Request:**
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
  "customer_phone": "0771234567",
  "customer_email": "john@example.com"  // Optional
}
```

**Response:**
```json
{
  "id": "...",
  "orderId": "A1B2C3",
  "items": [...],
  "total": 900.0,
  "customer_name": "John Doe",
  "customer_phone": "0771234567",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00.000Z",
  "message": "Order created successfully. Confirmation email sent."
}
```

---

## 📧 Email System

### Buyer Email (Order Confirmation)
- **Subject:** "Order Confirmation - Order #A1B2C3"
- **Content:** Order details, items, total, customer info
- **Sent to:** Buyer's email (from account or provided)

### Seller Email (Order Notification)
- **Subject:** "New Order Received - Order #A1B2C3"
- **Content:** Order details, items, customer info, order ID
- **Sent to:** Seller's email (from seller account)
- **Purpose:** Immediate notification of new order

---

## 🔧 Email Configuration

Add to `.env` file:

### For Gmail:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Note:** For Gmail, you need to use an "App Password", not your regular password:
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password
4. Use that as EMAIL_PASSWORD

### For Custom SMTP:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

**Note:** If email is not configured, orders will still work but emails won't be sent (logged in console).

---

## 📊 All APIs Summary

| API | Purpose | Who Uses It |
|-----|---------|-------------|
| `POST /register` | Create account | Buyers & Sellers |
| `POST /token` | Login | Buyers & Sellers |
| `GET /me` | Get user info | Buyers & Sellers |
| `GET /login-history` | View login logs | Sellers only |
| `GET /menu` | Browse menu | Buyers (public) |
| `POST /menu` | Add menu item | Sellers only |
| `PUT /menu/:id` | Update menu item | Sellers only |
| `DELETE /menu/:id` | Delete menu item | Sellers only |
| **`POST /orders`** | **Place order** | **Buyers** |
| `GET /orders` | View orders | Buyers (own) & Sellers (all) |
| `PUT /orders/:id/status` | Update status | Sellers only |

---

## ✅ Testing the Order Flow

1. **Install nodemailer:**
   ```bash
   npm install
   ```

2. **Configure email in `.env`** (optional but recommended)

3. **Test order creation:**
   - Login as buyer
   - Get menu items
   - Create order with items
   - Check console for email logs
   - Check buyer and seller email inboxes

4. **Verify in database:**
   - Order should be in `orders` collection
   - Check MongoDB Atlas dashboard

---

## 🎉 Complete Flow Example

```
1. Buyer logs in → POST /token
2. Buyer gets menu → GET /menu
3. Buyer places order → POST /orders
   ├─ Order saved ✅
   ├─ Email to buyer ✅
   └─ Email to seller ✅
4. Seller views orders → GET /orders
5. Seller updates status → PUT /orders/:id/status?status=preparing
6. Buyer checks status → GET /orders
```

---

For detailed API documentation, see `API_DOCUMENTATION.md`

