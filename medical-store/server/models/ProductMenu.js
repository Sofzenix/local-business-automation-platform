const mongoose = require("mongoose");

const productMenuSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ THIS LINE IS CRITICAL
module.exports = mongoose.model("ProductMenu", productMenuSchema);

