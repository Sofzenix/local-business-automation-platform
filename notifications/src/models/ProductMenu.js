// This is shared between:

// medicines

// hotel menu

// kirana products

//added stock field for low stock alert

const mongoose = require("mongoose");

const ProductMenuSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true
  },

  businessId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: "Business",
    required: true,
  },

  itemName: {
    type: String,
    required: true,
  },

  category: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },

  expiryDate: {
    type: Date,
  },
});

module.exports = mongoose.model("ProductMenu", ProductMenuSchema);
