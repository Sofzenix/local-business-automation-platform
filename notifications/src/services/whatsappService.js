import axios from "axios";
import config from "../../../config/whatsappConfig.js";
import { sendSMS } from "./smsService.js";

/* -------------------------------
   RETRY CONFIGURATION
--------------------------------*/

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

/* -------------------------------
   DELAY HELPER
--------------------------------*/

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -------------------------------
   SEND WHATSAPP MESSAGE
--------------------------------*/

export async function sendMessage(phone, message, attempt = 1) {
  console.log(`Sending WhatsApp message (attempt ${attempt}) to: ${phone}`);
  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: message },
  };

  try {
    const response = await axios.post(config.baseURL, payload, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`WhatsApp message sent to: ${phone}`);

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data || error.message;

    console.error(`WhatsApp send error (Attempt ${attempt}):`, errorMessage);

    /* -------------------------------
       RETRY LOGIC
    --------------------------------*/

    if (attempt < MAX_RETRIES) {
      console.log(`Retrying WhatsApp message in ${RETRY_DELAY / 1000}s...`);

      await delay(RETRY_DELAY);

      return sendMessage(phone, message, attempt + 1);
    }

    console.error("Max retry attempts reached. Message failed.");

    throw error;
  }
}

export async function sendMessageWithSmsFallback(phone, message) {
  try {
    return await sendMessage(phone, message);
  } catch (error) {
    console.log("WhatsApp failed; attempting SMS fallback...");
    try {
      await sendSMS(phone, message);
    } catch (smsError) {
      // Preserve original WhatsApp error context; SMS error is logged by smsService.
    }
    throw error;
  }
}
