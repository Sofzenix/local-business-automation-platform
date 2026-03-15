const dispatcher = require("../events/eventDispatcher");
const MessageLog = require("../models/MessageLog");
const Business = require("../models/Business");

/* -------------------------------
   VERIFY WEBHOOK
--------------------------------*/

exports.verifyWebhook = (req, res) => {

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};


/* -------------------------------
   WHATSAPP WEBHOOK
--------------------------------*/

exports.whatsappWebhook = async (req, res) => {

  try {

    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const phone = message.from;
    const text = message.text?.body || "";

    console.log("Incoming message:", phone, text);

    /* -------------------------------
       DETECT BUSINESS FROM METADATA
    ------------------------------- */

    const businessPhone = change?.metadata?.display_phone_number;

    const business = await Business.findOne({
      whatsappNumber: businessPhone,
      status: "active"
    });

    if (!business) {
      console.log("Business not found for number:", businessPhone);
      return res.sendStatus(200);
    }

    console.log("Incoming message:", phone, text);
    console.log("Detected Business:", business.businessName);
    console.log("Business Type:", business.businessType);

    /* -------------------------------
       SAVE MESSAGE LOG
    ------------------------------- */

    await MessageLog.create({
      phone,
      message: text,
      direction: "incoming",
      status: "received",
    });

    /* -------------------------------
       DISPATCH EVENT TO BUSINESS
    ------------------------------- */

    await dispatcher.dispatch("INCOMING_MESSAGE", {
      phone,
      text,
      businessId: business._id,
      businessType: business.businessType,
      ownerPhone: business.whatsappNumber
    });

    res.sendStatus(200);

  } catch (error) {

    console.error("Webhook error:", error.message);
    res.sendStatus(200);

  }

};