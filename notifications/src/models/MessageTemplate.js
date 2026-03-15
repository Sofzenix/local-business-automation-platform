const mongoose = require("mongoose");

const MessageTemplateSchema = new mongoose.Schema({

 templateId: {
  type: String,
  unique: true,
  required: true
 },

 businessType: {
  type: String,
  enum: ["medical", "hotel", "tiffin", "kirana", "all"]
 },

 eventType: {
  type: String,
  required: true
 },

 message: {
  type: String,
  required: true
 },

 variables: [String],

 channel: {
  type: String,
  default: "whatsapp"
 }

});

module.exports = mongoose.model("MessageTemplate", MessageTemplateSchema);