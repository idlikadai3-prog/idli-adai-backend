# Environment Setup

## Create .env file

Create a file named `.env` in the `backend` folder with the following content:

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://dilakshanvinoth:123@cluster0.boopqui.mongodb.net/
DATABASE_NAME=koththu_shop

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION_HOURS=24h

# Server Configuration
PORT=8000

# Email Configuration (Optional - for order notifications)
# Option 1: Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Option 2: Custom SMTP
# EMAIL_SERVICE=smtp
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_SECURE=false
# EMAIL_USER=your-email@example.com
# EMAIL_PASSWORD=your-password
```

## Important: MongoDB Atlas Setup

Before connecting, make sure:

1. **IP Whitelist**: Add your IP address to MongoDB Atlas
   - Go to MongoDB Atlas Dashboard
   - Click "Network Access" → "Add IP Address"
   - Add your current IP or `0.0.0.0/0` for all IPs (development only)

2. **Database User**: Make sure the user has proper permissions
   - Go to "Database Access" in MongoDB Atlas
   - Verify user `dilakshanvinoth` has read/write access

3. **Cluster Status**: Make sure your cluster is running (not paused)

## After Setup

Start the server:
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
Default seller created: username="seller", password="seller123"
Server running on http://localhost:8000
```

