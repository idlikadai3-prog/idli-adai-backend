import Order from '../models/Order.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { ORDER_STATUSES } from '../config/constants.js';
import { 
  sendOrderConfirmationToBuyer, 
  sendOrderNotificationToSeller 
} from '../services/email.service.js';

// Create order
export const createOrder = async (req, res) => {
  try {
    const { items, total, customer_name, customer_phone, customer_address, delivery_method, customer_email, description } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ detail: 'Items are required' });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ detail: 'Valid total is required' });
    }
    const method = (delivery_method || 'pickup').toLowerCase();
    if (!customer_name || !customer_phone) {
      return res.status(400).json({ detail: 'Customer name and phone are required' });
    }
    // Always collect an order description (customer_address)

    // Get buyer email from user account
    const buyer = await User.findById(req.user._id);
    const buyerEmail = customer_email || buyer?.email;

    // Create order
    const order = await Order.create({
      items,
      total,
      customer_name,
      customer_phone,
      delivery_method: method,
      description: description,
      customer_address,
      status: 'pending',
      user_id: req.user._id.toString(),
      created_at: new Date()
    });

    const orderId = order._id.toString().slice(-6).toUpperCase();

    // Prepare order data for emails
    const orderData = {
      orderId: orderId,
      items: order.items,
      total: order.total,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      delivery_method: order.delivery_method,
      description: order.description,
      customer_address: order.customer_address,
      status: order.status,
      created_at: order.created_at,
      user_id: order.user_id
    };

    // Send email to buyer (order confirmation)
    if (buyerEmail) {
      try {
        await sendOrderConfirmationToBuyer(orderData, buyerEmail);
        console.log(`✅ Order confirmation email sent to buyer: ${buyerEmail}`);
      } catch (emailError) {
        console.error('Failed to send buyer email:', emailError);
        // Don't fail the order if email fails
      }
    }

    // Send email to seller (order notification)
    try {
      // Find seller account
      const seller = await User.findOne({ role: 'seller' });
      if (seller && seller.email) {
        await sendOrderNotificationToSeller(orderData, seller.email);
        console.log(`✅ Order notification email sent to seller: ${seller.email}`);
      }
    } catch (emailError) {
      console.error('Failed to send seller email:', emailError);
      // Don't fail the order if email fails
    }

    res.status(200).json({
      id: order._id.toString(),
      orderId: orderId,
      items: order.items,
      total: order.total,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      delivery_method: order.delivery_method,
      description: order.description,
      customer_address: order.customer_address,
      status: order.status,
      created_at: order.created_at,
      message: 'Order created successfully. Confirmation email sent.'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      detail: 'Failed to create order', 
      error: error.message 
    });
  }
};

// Get orders
export const getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'seller') {
      orders = await Order.find().sort({ created_at: -1 });
    } else {
      orders = await Order.find({ 
        user_id: req.user._id.toString() 
      }).sort({ created_at: -1 });
    }

    res.json(orders.map(order => ({
      id: order._id.toString(),
      items: order.items,
      total: order.total,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      delivery_method: order.delivery_method,
      description: order.description || order.customer_address || '',
      customer_address: order.customer_address,
      status: order.status,
      created_at: order.created_at
    })));
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      detail: 'Failed to fetch orders', 
      error: error.message 
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    // Accept status from query or body to be flexible with clients
    const status = req.query.status || req.body.status;

    if (!mongoose.Types.ObjectId.isValid(order_id)) {
      return res.status(400).json({ detail: 'Invalid order ID' });
    }

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ 
        detail: `Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}` 
      });
    }

    const order = await Order.findByIdAndUpdate(
      order_id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ detail: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', status: order.status });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      detail: 'Failed to update order status', 
      error: error.message 
    });
  }
};

