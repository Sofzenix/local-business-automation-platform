const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

 userId: {
  type: String,
  required: true,
  unique: true
 },

 name: {
  type: String,
  required: true
 },

 mobileNumber: {
  type: String,
  required: true,
  unique: true
 },

 language: {
  type: String,
  default: "english"
 },

 role: {
  type: String,
  enum: ["OWNER", "ADMIN"],
  default: "OWNER"
 },

 createdAt: {
  type: Date,
  default: Date.now
 }

});

module.exports = mongoose.model("User", UserSchema);