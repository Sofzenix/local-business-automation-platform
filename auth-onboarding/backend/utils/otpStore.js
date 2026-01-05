// utils/otpStore.js
const otpMap = new Map();

exports.saveOTP = (mobile, otp) => {
  otpMap.set(mobile, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
};

exports.verifyOTP = (mobile, otp) => {
  const data = otpMap.get(mobile);
  if (!data) return false;
  if (Date.now() > data.expiresAt) return false;
  return data.otp === otp;
};
