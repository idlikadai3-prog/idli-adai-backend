import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['buyer', 'seller'],
    default: null
  },
  action: { 
    type: String, 
    enum: ['login', 'registration', 'create_seller'],
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  error: {
    type: String,
    default: null
  },
  ip_address: {
    type: String,
    default: 'unknown'
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

export default LoginHistory;

