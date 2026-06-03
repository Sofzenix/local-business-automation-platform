import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({

  orderId: {
    type: String,
    required: true,
    unique: true
  },

  businessId: {
    type: String,
    ref: "Business",
    required: true
  },

  orderSource: {
    type: String,
    enum: ["WhatsApp", "Manual"],
    default: "WhatsApp"
  },

  totalAmount: {
    type: Number,
    required: true
  },

  orderDate: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "completed"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", OrderSchema);