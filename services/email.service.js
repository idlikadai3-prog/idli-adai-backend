import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create transporter
const createTransporter = () => {
  // For Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
      }
    });
  }

  // For custom SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email templates
export const emailTemplates = {
  // Buyer order confirmation
  buyerOrderConfirmation: (orderData) => {
    const itemsList = orderData.items.map(item => 
      `  - ${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return {
      subject: `Order Confirmation - Order #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Order Confirmed!</h2>
          <p>Dear ${orderData.customer_name || orderData.customerName || 'Customer'},</p>
          <p>Thank you for your order! We have received your order and it's being prepared.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> ${orderData.status}</p>
            <p><strong>Method:</strong> ${orderData.delivery_method === 'delivery' ? 'Home Delivery' : 'Pickup'}</p>
            
            <h4>Items Ordered:</h4>
            <pre style="background-color: white; padding: 10px; border-radius: 3px;">${itemsList}</pre>
            
            <p style="font-size: 18px; font-weight: bold; color: #4CAF50;">
              Total: Rs. ${orderData.total.toFixed(2)}
            </p>
          </div>
          
          <p><strong>Order & Delivery Information:</strong></p>
          <p>Name: ${orderData.customer_name || orderData.customerName || ''}</p>
          <p>Phone: ${orderData.customer_phone || orderData.customerPhone || ''}</p>
          <p>Order Description: ${orderData.description || orderData.customer_address || orderData.customerAddress || ''}</p>
          
          <p>We'll notify you once your order is ready for pickup/delivery.</p>
          <p>Thank you for choosing idli kadai!</p>
        </div>
      `,
      text: `
        Order Confirmed!
        
        Dear ${orderData.customer_name || orderData.customerName || 'Customer'},
        
        Thank you for your order! We have received your order and it's being prepared.
        
        Order Details:
        Order ID: ${orderData.orderId}
        Order Date: ${new Date(orderData.created_at).toLocaleString()}
        Status: ${orderData.status}
        Method: ${orderData.delivery_method === 'delivery' ? 'Home Delivery' : 'Pickup'}
        
        Items Ordered:
        ${orderData.items.map(item => 
          `  - ${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')}
        
        Total: Rs. ${orderData.total.toFixed(2)}
        
        Order & Delivery Information:
        Name: ${orderData.customer_name || orderData.customerName || ''}
        Phone: ${orderData.customer_phone || orderData.customerPhone || ''}
        Order Description: ${orderData.description || orderData.customer_address || orderData.customerAddress || ''}
        
        We'll notify you once your order is ready.
        Thank you for choosing idli kadai!
      `
    };
  },

  // Seller order notification
  sellerOrderNotification: (orderData) => {
    const itemsList = orderData.items.map(item => 
      `  - ${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    return {
      subject: `New Order Received - Order #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff9800;">New Order Received!</h2>
          <p>You have received a new order that needs to be processed.</p>
          
          <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ff9800;">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">${orderData.status.toUpperCase()}</span></p>
            
            <h4>Items Ordered:</h4>
            <pre style="background-color: white; padding: 10px; border-radius: 3px;">${itemsList}</pre>
            
            <p style="font-size: 18px; font-weight: bold; color: #ff9800;">
              Total: Rs. ${orderData.total.toFixed(2)}
            </p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3>Order & Customer Information</h3>
            <p><strong>Name:</strong> ${orderData.customer_name || orderData.customerName || ''}</p>
            <p><strong>Phone:</strong> ${orderData.customer_phone || orderData.customerPhone || ''}</p>
            <p><strong>Order Description:</strong> ${orderData.description || orderData.customer_address || orderData.customerAddress || ''}</p>
            <p><strong>User ID:</strong> ${orderData.user_id}</p>
          </div>
          
          <p style="color: #f44336; font-weight: bold;">Please process this order as soon as possible.</p>
          <p>Login to your seller dashboard to update the order status.</p>
        </div>
      `,
      text: `
        New Order Received!
        
        You have received a new order that needs to be processed.
        
        Order Details:
        Order ID: ${orderData.orderId}
        Order Date: ${new Date(orderData.created_at).toLocaleString()}
        Status: ${orderData.status}
        
        Items Ordered:
        ${orderData.items.map(item => 
          `  - ${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')}
        
        Total: Rs. ${orderData.total.toFixed(2)}
        
        Customer & Order Information:
        Name: ${orderData.customer_name || orderData.customerName || ''}
        Phone: ${orderData.customer_phone || orderData.customerPhone || ''}
        Order Description: ${orderData.description || orderData.customer_address || orderData.customerAddress || ''}
        User ID: ${orderData.user_id}
        
        Please process this order as soon as possible.
        Login to your seller dashboard to update the order status.
      `
    };
  }
};

// Send email function
export const sendEmail = async (to, subject, html, text) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email not configured. Skipping email send.');
      console.warn('Email would be sent to:', to);
      console.warn('Subject:', subject);
      return { success: false, message: 'Email not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"idli kadai" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Verify transporter on startup and log result
export const verifyEmailTransport = async () => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email credentials not set. Emails will be skipped.');
      return { configured: false };
    }
    const transporter = createTransporter();
    await transporter.verify();
    console.log('📧 Email transport verified and ready.');
    return { configured: true };
  } catch (err) {
    console.warn('⚠️ Email transport verification failed:', err.message);
    return { configured: false, error: err.message };
  }
};

// Send order confirmation to buyer
export const sendOrderConfirmationToBuyer = async (orderData, buyerEmail) => {
  const template = emailTemplates.buyerOrderConfirmation(orderData);
  return await sendEmail(buyerEmail, template.subject, template.html, template.text);
};

// Send order notification to seller
export const sendOrderNotificationToSeller = async (orderData, sellerEmail) => {
  const template = emailTemplates.sellerOrderNotification(orderData);
  return await sendEmail(sellerEmail, template.subject, template.html, template.text);
};

