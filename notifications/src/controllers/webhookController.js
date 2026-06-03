import mongoose from "mongoose";
import dispatcher from "../events/eventDispatcher.js";
import MessageLog from "../models/MessageLog.js";
import Business from "../models/Business.js";

async function ensureDbReady() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connection.asPromise();
}

/* -------------------------------
   VERIFY WEBHOOK
--------------------------------*/

export function verifyWebhook(req, res) {

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}


/* -------------------------------
   WHATSAPP WEBHOOK
--------------------------------*/

export async function whatsappWebhook(req, res) {

  try {
    console.log("Webhook hit: /webhook/whatsapp");

    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const providerMessageId = message.id;
    const phone = message.from;
    const text = message.text?.body || "";

    console.log("Parsed message id:", providerMessageId || "(missing)");

    await ensureDbReady();

    // Idempotency guard: Meta can retry webhooks; don't process the same message twice.
    if (providerMessageId) {
      const alreadyProcessed = await MessageLog.exists({
        providerMessageId,
        direction: "incoming",
      });
      if (alreadyProcessed) {
        console.log("Duplicate webhook delivery ignored for message id:", providerMessageId);
        return res.sendStatus(200);
      }
    }

    console.log("Incoming message:", phone, text);

    /* -------------------------------
       DETECT BUSINESS FROM METADATA
    ------------------------------- */

    const businessPhone = change?.metadata?.display_phone_number;
    console.log("Business phone (metadata.display_phone_number):", businessPhone);

    const business = await Business.findOne({
      whatsappNumber: businessPhone,
      status: "active"
    });

    if (!business) {
      console.log("Business not found for number:", businessPhone);
      return res.sendStatus(200);
    }

    // Keep the same log as before (this line existed twice earlier).
    console.log("Incoming message:", phone, text);
    console.log("Detected Business:", business.businessName);
    console.log("Business Type:", business.businessType);

    /* -------------------------------
       SAVE MESSAGE LOG
    ------------------------------- */

    await MessageLog.create({
      phone,
      providerMessageId,
      message: text,
      direction: "incoming",
      status: "received",
    });
    console.log("Message log saved");

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
    console.log("Event dispatched");

    res.sendStatus(200);

  } catch (error) {

    console.error("Webhook error:", error.message);
    res.sendStatus(200);

  }

}