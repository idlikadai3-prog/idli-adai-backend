# Testing Authentication System

This guide explains how to test the buyer and seller authentication system.

## Prerequisites

1. Make sure MongoDB is running
2. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

3. Install test dependencies:
   ```bash
   pip install -r requirements-test.txt
   ```

## Running Tests

Run the test script:
```bash
python test_auth.py
```

## What the Tests Do

1. **Register a Buyer**: Creates a new buyer account
2. **Register a Seller**: Creates a new seller account
3. **Test Buyer Login**: Logs in as the buyer
4. **Test Seller Login**: Logs in as the seller
5. **Test Default Seller Login**: Logs in with the default seller account
6. **Test Failed Login**: Attempts login with wrong credentials (to test logging)
7. **View Login History**: Tests the login history endpoint (seller only)

## Default Seller Account

- **Username**: `seller`
- **Password**: `seller123`

## Checking the Database

After running tests, check your MongoDB database:

### Users Collection
```javascript
db.users.find().pretty()
```
Should show:
- Default seller account
- Test buyer account (if registered)
- Test seller account (if registered)

### Login History Collection
```javascript
db.login_history.find().sort({timestamp: -1}).pretty()
```
Should show:
- All registration events
- All login attempts (successful and failed)
- IP addresses (if available)
- Timestamps
- Success/failure status

## Expected Results

✅ All registration and login attempts should be logged in the `login_history` collection
✅ Successful logins should return JWT tokens
✅ Failed logins should be rejected but still logged
✅ Login history endpoint should only be accessible by sellers

