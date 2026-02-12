// controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { saveOTP, verifyOTP } = require("../utils/otpStore");


exports.sendOTP = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    // Validation
    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOTP(mobileNumber, otp);

    // TODO: Integrate WhatsApp/SMS API
    console.log("OTP for", mobileNumber, ":", otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP & Issue JWT
exports.verifyOTPLogin = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    // Validation
    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: "Mobile number and OTP are required" });
    }

    const isValid = verifyOTP(mobileNumber, otp);
    if (!isValid) return res.status(401).json({ message: "Invalid or expired OTP" });

    let user = await User.findOne({ mobileNumber });
    if (!user) {
      user = await User.create({ mobileNumber, isVerified: true });
    } else {
      user.isVerified = true;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
