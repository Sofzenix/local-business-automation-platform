import { Router } from "express";
import {
  getStatus,
  startTrial,
  upgradePlan,
  adminUpdateSubscription,
  activateSubscription
} from "./subscription.controller.js";

const router = Router();

router.get("/status/:businessId", getStatus);
router.post("/start-trial", startTrial);
router.post("/upgrade", upgradePlan);
router.post("/admin/update", adminUpdateSubscription);
router.post("/admin/activate" , activateSubscription);

export default router;