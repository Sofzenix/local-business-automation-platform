// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  mobileNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ["OWNER", "ADMIN"], default: "OWNER" },
  language: { type: String, enum: ["te", "en"], default: "te" },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
