import MenuItem from '../models/MenuItem.js';
import mongoose from 'mongoose';

// Get all menu items
export const getMenu = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ available: true });
    res.json(menuItems.map(item => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url,
      available: item.available
    })));
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({ 
      detail: 'Failed to fetch menu', 
      error: error.message 
    });
  }
};

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available, image_url } = req.body;

    // If file uploaded, build a served URL
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }
    
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image_url: finalImageUrl,
      available: available !== undefined ? available : true
    });

    res.status(200).json({
      id: menuItem._id.toString(),
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      image_url: menuItem.image_url,
      available: menuItem.available
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ 
      detail: 'Failed to create menu item', 
      error: error.message 
    });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const { name, description, price, category, available, image_url } = req.body;

    if (!mongoose.Types.ObjectId.isValid(item_id)) {
      return res.status(400).json({ detail: 'Invalid item ID' });
    }

    // Determine image URL
    let finalImageUrl = image_url;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      item_id,
      { name, description, price, category, available, image_url: finalImageUrl },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ detail: 'Menu item not found' });
    }

    res.json({
      id: menuItem._id.toString(),
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      image_url: menuItem.image_url,
      available: menuItem.available
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ 
      detail: 'Failed to update menu item', 
      error: error.message 
    });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { item_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(item_id)) {
      return res.status(400).json({ detail: 'Invalid item ID' });
    }

    const result = await MenuItem.findByIdAndDelete(item_id);

    if (!result) {
      return res.status(404).json({ detail: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ 
      detail: 'Failed to delete menu item', 
      error: error.message 
    });
  }
};

