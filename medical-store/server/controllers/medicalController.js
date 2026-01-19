const mongoose = require("mongoose");
const ProductMenu = require("../models/ProductMenu");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");
const sendWhatsAppAlert = require("../utils/whatsappService");

exports.addMedicine = async (req, res) => {
  try {
    let {
      businessId,
      itemName,
      price,
      expiryDate,
      stockQty,
      minThreshold,
    } = req.body;

    if (
      !businessId ||
      !itemName ||
      !price ||
      !expiryDate ||
      !stockQty ||
      !minThreshold
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Convert string → ObjectId
    businessId = new mongoose.Types.ObjectId(businessId);

    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({ message: "Expiry must be a future date" });
    }

    const existing = await ProductMenu.findOne({ businessId, itemName });
    if (existing) {
      return res.status(400).json({ message: "Medicine already exists" });
    }

    const medicine = await ProductMenu.create({
      businessId,
      itemName,
      price,
      expiryDate,
    });

    await Inventory.create({
      itemId: medicine._id,
      stockQty,
      minThreshold,
    });

    res.status(201).json({
      message: "Medicine added successfully",
    });
  } catch (err) {
    console.error("ADD MEDICINE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// SALE ENTRY + AUTO STOCK DEDUCTION
exports.addSale = async (req, res) => {
  try {
    let { businessId, itemId, quantity } = req.body;

    if (!businessId || !itemId || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    businessId = new mongoose.Types.ObjectId(businessId);
    itemId = new mongoose.Types.ObjectId(itemId);

    // Find inventory
    const inventory = await Inventory.findOne({ itemId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Check stock
    if (inventory.stockQty < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Deduct stock
    inventory.stockQty -= quantity;
    inventory.lastUpdated = new Date();
    await inventory.save();

    // Fetch medicine details
    const medicine = await ProductMenu.findById(itemId);

    // ✅ LOW STOCK ALERT (WhatsApp + console)
    if (inventory.stockQty <= inventory.minThreshold) {
      console.log("====================================");
      console.log("⚠️ LOW STOCK ALERT");
      console.log("Medicine:", medicine.itemName);
      console.log("Remaining Stock:", inventory.stockQty);
      console.log("Minimum Threshold:", inventory.minThreshold);
      console.log("====================================");

      await sendWhatsAppAlert(
        `⚠️ LOW STOCK ALERT\nMedicine: ${medicine.itemName}\nRemaining Stock: ${inventory.stockQty}`
      );
    }

    // Create order
    const order = await Order.create({
      businessId,
      items: [
        {
          itemId,
          quantity,
          price: medicine.price,
        },
      ],
      totalAmount: medicine.price * quantity,
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      remainingStock: inventory.stockQty,
    });
  } catch (err) {
    console.error("SALE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL INVENTORY (DEBUG / DEV)
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("itemId");
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
