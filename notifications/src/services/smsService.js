import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(phone, message) {
  try {
    console.log("Sending SMS to:", phone);

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
}