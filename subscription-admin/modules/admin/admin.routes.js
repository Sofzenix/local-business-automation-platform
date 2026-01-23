import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; 
import {
  extendSubscriptionController,
  suspendSubscriptionController,
  reactivateSubscriptionController,
  getSubscriptionSummary,
  getBillingSummary
} from "./admin.controller.js";

const adminRouter = Router();

adminRouter.use(authMiddleware, isAdmin);

adminRouter.post("/activate" , activateSubscriptionController);

adminRouter.post("/extend", extendSubscriptionController);
adminRouter.post("/suspend", suspendSubscriptionController);
adminRouter.post("/reactivate", reactivateSubscriptionController);

adminRouter.get("/reports/subscriptions", getSubscriptionSummary);
adminRouter.get("/reports/billing", getBillingSummary);

export default adminRouter;