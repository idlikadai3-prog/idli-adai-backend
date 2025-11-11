# MongoDB Atlas Setup Guide

## Quick Setup

1. Create a `.env` file in the `backend` folder (copy from `.env.example`)

2. Add your MongoDB Atlas connection string:

```env
MONGODB_URL=mongodb+srv://dilakshanvinoth:123@cluster0.boopqui.mongodb.net/
DATABASE_NAME=koththu_shop
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRATION_HOURS=24h
PORT=8000
```

## Important Notes

### 1. IP Whitelist
Make sure your IP address is whitelisted in MongoDB Atlas:
- Go to MongoDB Atlas Dashboard
- Click "Network Access" in the left sidebar
- Click "Add IP Address"
- Add your current IP or use `0.0.0.0/0` for all IPs (development only, not recommended for production)

### 2. Database User
- Make sure the user `dilakshanvinoth` has read/write permissions
- Go to "Database Access" in MongoDB Atlas
- Verify the user has appropriate permissions

### 3. Connection String Format
The connection string should end with `/` and the database name will be appended automatically:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
```

Or you can include the database name directly:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/koththu_shop
```

## Testing the Connection

After setting up your `.env` file, start the server:

```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
Default seller created: username="seller", password="seller123"
Server running on http://localhost:8000
```

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Check your username and password in the connection string
- Verify the database user exists in MongoDB Atlas

### Error: "MongoServerSelectionError: connection timed out"
- Check your IP whitelist in MongoDB Atlas
- Make sure your internet connection is working
- Verify the cluster is running (not paused)

### Error: "MongoServerError: not authorized"
- Check user permissions in MongoDB Atlas
- Make sure the user has read/write access to the database

