import Menumodel from "../models/Menumodel.js";

/**
 * Add new menu item
 */
export const addMenuItem = async (req, res) => {
  try {
    const { businessId, itemName, price, category } = req.body;

    if (!businessId || !itemName || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const menuItem = await Menumodel.create({
      businessId,
      itemName,
      price,
      category
    });

    res.status(201).json({
      message: "Menu item added successfully",
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to insert data",
      details: error.message
    });
  }
};

/**
 * Toggle menu availability
 */
export const toggleMenuAvailability = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { businessId } = req.body;

    const menuItem = await Menumodel.findOne({
      _id: menuId,
      businessId
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.json({
      message: "Menu availability updated",
      isAvailable: menuItem.isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get today's available menu (customer view)
 */
export const getTodayMenu = async (req, res) => {
  try {
    const { businessId } = req.params;

    const menu = await Menumodel.find({
      businessId,
      isAvailable: true
    });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Generate menu share link
 */
export const menuShareLink = async (req, res) => {
  try {
    const { businessId } = req.params;

    const link = `https://yourapp.com/menu/${businessId}`;

    res.json({
      message: "Menu share link generated",
      link
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
