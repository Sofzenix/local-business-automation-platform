import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    businessId: {
      type: Schema.Types.ObjectId,
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

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "CONFIRMED"
    },

    orderDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default model("Order", orderSchema);
