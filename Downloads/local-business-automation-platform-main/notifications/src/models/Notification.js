const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({

 businessId: {
  type: String,
  ref: "Business"
 },

 eventType: {
  type: String,
  required: true
 },

 recipientPhone: {
  type: String,
  required: true
 },

 templateId: {
  type: String
 },

 channel: {
  type: String,
  enum: ["whatsapp", "sms"],
  default: "whatsapp"
 },

 status: {
  type: String,
  enum: ["pending", "sent", "failed"],
  default: "pending"
 },

 retryCount: {
  type: Number,
  default: 0
 },

 createdAt: {
  type: Date,
  default: Date.now
 }

});

module.exports = mongoose.model("Notification", NotificationSchema);