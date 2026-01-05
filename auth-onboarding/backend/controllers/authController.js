// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { saveOTP, verifyOTP } = require("../utils/otpStore");


exports.sendOTP = async (req, res) => {
  const { mobileNumber } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  saveOTP(mobileNumber, otp);

  // TODO: Integrate WhatsApp/SMS API
  console.log("OTP:", otp);

  res.json({ message: "OTP sent successfully" });
};

// Verify OTP & Issue JWT
exports.verifyOTPLogin = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  const isValid = verifyOTP(mobileNumber, otp);
  if (!isValid) return res.status(401).json({ message: "Invalid OTP" });

  let user = await User.findOne({ mobileNumber });
  if (!user) {
    user = await User.create({ mobileNumber, isVerified: true });
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
};
