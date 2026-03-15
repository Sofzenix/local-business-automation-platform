const axios = require("axios");
const config = require("../config/whatsappConfig");

/* -------------------------------
   RETRY CONFIGURATION
--------------------------------*/

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds


/* -------------------------------
   DELAY HELPER
--------------------------------*/

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* -------------------------------
   SEND WHATSAPP MESSAGE
--------------------------------*/

exports.sendMessage = async (phone, message, attempt = 1) => {

  const payload = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: message }
  };

  try {

    const response = await axios.post(
      config.baseURL,
      payload,
      {
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json"
        }
      }
    );

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

      return exports.sendMessage(phone, message, attempt + 1);

    }

    console.error("Max retry attempts reached. Message failed.");

    throw error;

  }

};