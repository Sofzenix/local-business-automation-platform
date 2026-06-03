import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({

 inventoryId: {
  type: String,
  required: true
 },

 itemId: {
  type: String,
  ref: "ProductMenu",
  required: true
 },

 stockQty: {
  type: Number,
  default: 0
 },

 minThreshold: {
  type: Number,
  default: 5
 },

 lastUpdated: {
  type: Date,
  default: Date.now
 }

});

export default mongoose.model("Inventory", InventorySchema);