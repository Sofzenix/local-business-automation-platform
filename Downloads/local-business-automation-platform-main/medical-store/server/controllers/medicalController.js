const mongoose = require("mongoose");
const ProductMenu = require("../models/ProductMenu");
const Inventory = require("../models/Inventory");
const Order = require("../models/Order");
const sendWhatsAppAlert = require("../utils/whatsappService");

// ADD MEDICINE
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
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "All fields are required",
      });
    }

    businessId = new mongoose.Types.ObjectId(businessId);

    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EXPIRY",
        message: "Expiry must be a future date",
      });
    }

    const existing = await ProductMenu.findOne({ businessId, itemName });

    if (existing) {
      return res.status(400).json({
        success: false,
        code: "DUPLICATE_ITEM",
        message: "Medicine already exists",
      });
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
      success: true,
      message: "Medicine added successfully",
    });
  } catch (err) {
    console.error("ADD MEDICINE ERROR:", err);
    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Server error",
    });
  }
};

exports.addSale = async (req, res) => {
  try {
    let { itemId, quantity } = req.body;

    // ✅ get businessId (integration-ready)
    const businessId = new mongoose.Types.ObjectId(
      req.user?.businessId || "64f123abc456789012345678"
    );

    if (!itemId || !quantity) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "All fields are required",
      });
    }

    // ✅ convert itemId safely
    itemId = new mongoose.Types.ObjectId(itemId);

    // 🔍 Find inventory
    const inventory = await Inventory.findOne({ itemId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        code: "NOT_FOUND",
        message: "Inventory not found",
      });
    }

    // ❌ insufficient stock
    if (inventory.stockQty < quantity) {
      return res.status(400).json({
        success: false,
        code: "INSUFFICIENT_STOCK",
        message: "Insufficient stock",
      });
    }

    // ✅ Deduct stock
    inventory.stockQty -= quantity;
    inventory.lastUpdated = new Date();
    await inventory.save();

    // 🔍 Get medicine
    const medicine = await ProductMenu.findById(itemId);

    // ⚠️ LOW STOCK ALERT
    if (inventory.stockQty <= inventory.minThreshold) {
      console.log("====================================");
      console.log("⚠️ LOW STOCK ALERT");
      console.log("Medicine:", medicine.itemName);
      console.log("Remaining Stock:", inventory.stockQty);
      console.log("====================================");

      // ✅ EVENT LOG (integration-ready)
      console.log("EVENT: LOW_STOCK_ALERT", {
        itemName: medicine.itemName,
        stock: inventory.stockQty,
      });

      // ✅ WhatsApp (for demo)
      await sendWhatsAppAlert(
        `⚠️ LOW STOCK ALERT\nMedicine: ${medicine.itemName}\nRemaining Stock: ${inventory.stockQty}`
      );
    }

    // 🧾 Create order
    await Order.create({
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

    // ✅ SUCCESS RESPONSE (team format)
    res.status(201).json({
      success: true,
      message: "Sale recorded successfully",
      data: {
        remainingStock: inventory.stockQty,
      },
    });

  } catch (err) {
    console.error("SALE ERROR:", err);

    res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Server error",
    });
  }
};

// GET INVENTORY
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("itemId");

   res.json({
  success: true,
  message: "Inventory fetched successfully",
  data: inventory
});

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};