const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phone, message) => {
  try {

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+" + phone
    });

    console.log("SMS sent:", response.sid);
    return response;

  } catch (error) {

    console.error("SMS sending failed:", error.message);
    throw error;

  }
};

module.exports = { sendSMS };