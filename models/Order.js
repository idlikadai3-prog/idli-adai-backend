import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [{
    menu_item_id: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total: { 
    type: Number, 
    required: true,
    min: 0
  },
  customer_name: { 
    type: String, 
    required: true,
    trim: true
  },
  customer_phone: { 
    type: String, 
    required: true,
    trim: true
  },
  delivery_method: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup',
    required: true
  },
  // Human-written order description/instructions (independent of address)
  description: {
    type: String,
    trim: true
  },
  customer_address: {
    type: String,
    required: function() {
      return this.delivery_method === 'delivery';
    },
    trim: true
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled']
  },
  user_id: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

