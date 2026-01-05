// models/Business.js
const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  businessId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  businessName: String,
  businessType: { type: String, enum: ["Medical", "Hotel", "Tiffin"] },
  location: String,
  whatsappNumber: String,
  status: { type: String, default: "ACTIVE" },
  trialEndsAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);
