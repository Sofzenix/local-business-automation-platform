const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTPLogin } = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTPLogin);

module.exports = router;
