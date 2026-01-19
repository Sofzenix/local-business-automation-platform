const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsAppAlert = async (message) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
      body: message,
    });

    console.log("📲 WhatsApp alert sent");
  } catch (error) {
    console.error("WhatsApp Error:", error.message);
  }
};

module.exports = sendWhatsAppAlert;
