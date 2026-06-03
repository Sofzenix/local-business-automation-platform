import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({

 businessId: {
  type: String,
  required: true,
  unique: true
 },

 userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
 },

 businessName: {
  type: String,
  required: true
 },

 businessType: {
  type: String,
  enum: ["medical", "tiffin", "kirana"],
  required: true
 },

 location: {
  type: String
 },

 whatsappNumber: {
  type: String,
  required: true
 },

 status: {
  type: String,
  enum: ["active", "suspended"],
  default: "active"
 },

 createdAt: {
  type: Date,
  default: Date.now
 }

});

export default mongoose.model("Business", BusinessSchema);