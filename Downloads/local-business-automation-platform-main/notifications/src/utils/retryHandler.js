const whatsappService = require("../services/whatsappService");
const smsService = require("../services/smsService");

exports.retrySend = async (phone, message) => {
  for (let i = 0; i < 2; i++) {
    try {
      await whatsappService.sendMessage(phone, message);
      return true;
    } catch (err) {}
  }
  await smsService.sendSMS(phone, message);
  return false;
};