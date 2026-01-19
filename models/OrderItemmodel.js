import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model("OrderItem", orderItemSchema);
