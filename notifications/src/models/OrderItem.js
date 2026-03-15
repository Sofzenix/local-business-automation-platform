const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    orderItemId: {
      type: String,
      required: true,
      unique: true,
    },
    
    orderId: {
      type: String,
      ref: "Order",
      required: true,
    },

    itemId: {
      type: String,
      ref: "ProductMenu",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("OrderItem", OrderItemSchema);
