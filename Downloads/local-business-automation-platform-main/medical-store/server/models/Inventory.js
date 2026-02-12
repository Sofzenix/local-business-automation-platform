const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductMenu",
      required: true,
    },
    stockQty: {
      type: Number,
      required: true,
    },
    minThreshold: {
      type: Number,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
