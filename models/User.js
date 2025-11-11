import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    // Allow up to 3 accounts per email (app-level validation enforces the limit)
    // Do not mark unique here to avoid duplicate key errors
    trim: true,
    lowercase: true
  },
  hashed_password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['buyer', 'seller'], 
    required: true,
    default: 'buyer'
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Helpful non-unique index for faster email lookups/counts
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;

