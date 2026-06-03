import mongoose from "mongoose";

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

export default mongoose.model("User", UserSchema);