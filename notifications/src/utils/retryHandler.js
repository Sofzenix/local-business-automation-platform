import { sendMessage } from "../services/whatsappService.js";
import { sendSMS } from "../services/smsService.js";

export async function retrySend(phone, message) {
  for (let i = 0; i < 2; i++) {
    try {
      await sendMessage(phone, message);
      return true;
    } catch (err) {}
  }
  await sendSMS(phone, message);
  return false;
}