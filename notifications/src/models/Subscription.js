import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({

 subscriptionId: {
  type: String,
  required: true,
  unique: true
 },

 businessId: {
  type: String,
  ref: "Business",
  required: true
 },

 planType: {
  type: String,
  enum: ["monthly", "yearly", "trial"]
 },

 startDate: {
  type: Date
 },

 endDate: {
  type: Date
 },

 status: {
  type: String,
  enum: ["active", "expired", "cancelled"],
  default: "active"
 },

 paymentMode: {
  type: String
 }

});

export default mongoose.model("Subscription", SubscriptionSchema);