const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductMenu",
        },
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "COMPLETED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
