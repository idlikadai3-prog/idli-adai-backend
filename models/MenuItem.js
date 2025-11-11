import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  image_url: {
    type: String,
    default: null
  },
  available: { 
    type: Boolean, 
    default: true 
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;

