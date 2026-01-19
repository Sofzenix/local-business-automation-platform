import { Router } from "express";
import { createOrder } from "../controllers/ordercontroller.js";

const router = Router();

// Create order (WhatsApp / Manual)
router.post("/orders", createOrder);

export default router;
