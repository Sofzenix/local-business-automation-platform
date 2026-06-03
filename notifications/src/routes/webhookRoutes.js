import { Router } from "express";
import { verifyWebhook, whatsappWebhook } from "../controllers/webhookController.js";

const router = Router();

// Webhook verification (required by Meta)
router.get("/whatsapp", verifyWebhook);

// Receive incoming WhatsApp messages
router.post("/whatsapp", whatsappWebhook);

export default router;