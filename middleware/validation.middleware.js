// Validation middleware for request validation

export const validateOrder = (req, res, next) => {
  const { items, total, customer_name, customer_phone, customer_address, delivery_method } = req.body;
  const errors = [];

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Items array is required and must not be empty');
  } else {
    items.forEach((item, index) => {
      if (!item.menu_item_id) {
        errors.push(`Item ${index + 1}: menu_item_id is required`);
      }
      if (!item.name) {
        errors.push(`Item ${index + 1}: name is required`);
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Item ${index + 1}: quantity must be at least 1`);
      }
      if (!item.price || item.price < 0) {
        errors.push(`Item ${index + 1}: price must be a positive number`);
      }
    });
  }

  // Validate total
  if (!total || total <= 0) {
    errors.push('Total must be a positive number');
  }

  // Delivery method optional; defaults to pickup if not provided
  const method = (delivery_method || 'pickup').toLowerCase();
  if (delivery_method && !['pickup', 'delivery'].includes(method)) {
    errors.push('Delivery method must be either "pickup" or "delivery"');
  }

  // Validate customer info
  if (!customer_name || customer_name.trim().length < 2) {
    errors.push('Customer name is required and must be at least 2 characters');
  }
  if (!customer_phone || customer_phone.trim().length < 10) {
    errors.push('Customer phone is required and must be at least 10 characters');
  }
  // Always require an order description (customer_address repurposed as description)
  if (!customer_address || customer_address.trim().length < 5) {
    errors.push('Order description is required and must be at least 5 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      detail: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateMenuItem = (req, res, next) => {
  const { name, description, price, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters');
  }
  if (!price || price <= 0) {
    errors.push('Price must be a positive number');
  }
  if (!category || category.trim().length < 2) {
    errors.push('Category is required and must be at least 2 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      detail: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateRegister = (req, res, next) => {
  const { username, email, password, role } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (role && !['buyer', 'seller'].includes(role)) {
    errors.push('Role must be either "buyer" or "seller"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      detail: 'Validation failed',
      errors: errors
    });
  }

  next();
};

