import { Router } from "express";
import {
  getStatus,
  startTrial,
  upgradePlan
} from "./subscription.controller.js";

const router = Router();

// user-facing subscription APIs
router.get("/status/:businessId", getStatus);
router.post("/start-trial", startTrial);
router.post("/upgrade", upgradePlan);

export default router;