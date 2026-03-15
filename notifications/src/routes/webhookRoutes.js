const express = require("express");
const router = express.Router();
const controller = require("../controllers/webhookController");

// Webhook verification (required by Meta)
router.get("/whatsapp", controller.verifyWebhook);

// Receive incoming WhatsApp messages
router.post("/whatsapp", controller.whatsappWebhook);

module.exports = router;