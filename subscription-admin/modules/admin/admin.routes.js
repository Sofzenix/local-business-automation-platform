import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

import {
  activateSubscriptionController,
  extendSubscriptionController,
  suspendSubscriptionController,
  reactivateSubscriptionController,
  getSubscriptionSummary,
  getBillingSummary
} from "./admin.controller.js";
import auditRouter from "../audit/audit.router.js";
import { mockAuth } from "../middlewares/mock.auth.middleware.js";
import { activateSubscription } from "./admin.service.js";

const adminRouter = Router();

adminRouter.use(authMiddleware, isAdmin);

/*------------------------------------------------------------------------------------------------------------
ROUTE 1 : ACTIVATE
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/activate
 *
 * Activate a subscription for a business.
 *
 * @body {string} businessId - MongoDB ObjectId (24 char hex string)
 * @body {"MONTHLY" | "YEARLY"} planType - Subscription plan type
 * @body {string} [paymentMode] - Payment method (UPI, CARD, CASH, etc.)
 *
 * @returns {Object}
 * {
 *   success: true,
 *   message: "Subscription activated successfully.",
 *   data: {
 *     _id: ObjectId,
 *     businessId: ObjectId,
 *     planType: "MONTHLY" | "YEARLY",
 *     status: "ACTIVE",
 *     startDate: Date,
 *     endDate: Date,
 *     graceEndsOn: Date,
 *     paymentMode: string
 *   }
 * }
 *
 * Error Responses:
 * - 400: businessId and planType are required
 * - 404: Subscription not found
 * - 400: Subscription already active
 * - 500: Internal server error
 *
 * Notes:
 * - Only one subscription exists per business.
 * - This endpoint updates the database.
 */
adminRouter.post("/activate" , activateSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 2 : EXTEND
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/extend
 *
 * Extend an existing subscription by adding extra days.
 *
 * @body {string} subscriptionId - MongoDB ObjectId (24 char hex string)
 * @body {number} extraDays - Number of days to extend
 *
 * @returns {Object}
 * {
 *   success: true,
 *   message: "Subscription extended successfully."
 * }
 *
 * Error Responses:
 * - 400: subscriptionId and extraDays are required
 * - 404: Subscription not found
 * - 500: Internal server error
 */
adminRouter.post("/extend", extendSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 3 : SUSPEND
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/suspend
 *
 * Suspend a subscription immediately.
 *
 * @body {string} subscriptionId - MongoDB ObjectId (24 char hex string)
 *
 * @returns {Object}
 * {
 *   success: true,
 *   message: "Subscription suspended successfully."
 * }
 *
 * Error Responses:
 * - 400: subscriptionId is required
 * - 404: Subscription not found
 * - 500: Internal server error
 */
adminRouter.post("/suspend", suspendSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 4 : REACTIVE
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/reactivate
 *
 * Reactivate a suspended subscription.
 *
 * @body {string} subscriptionId - MongoDB ObjectId (24 char hex string)
 *
 * @returns {Object}
 * {
 *   success: true,
 *   message: "Subscription reactivated successfully."
 * }
 *
 * Error Responses:
 * - 400: subscriptionId is required
 * - 404: Subscription not found
 * - 500: Internal server error
 */
adminRouter.post("/reactivate", reactivateSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 5 : SUBSCRIPTION SUMMARY
--------------------------------------------------------------------------------------------------------------*/
/**
 * GET /api/admin/reports/subscriptions
 *
 * Get subscription summary report.
 *
 * @returns {Object}
 * Subscription statistics and summary data.
 */
adminRouter.get("/reports/subscriptions", getSubscriptionSummary);

/*------------------------------------------------------------------------------------------------------------
ROUTE 6 : BILLING SUMMARY
--------------------------------------------------------------------------------------------------------------*/
/**
 * GET /api/admin/reports/billing
 *
 * Get billing summary report.
 *
 * @returns {Object}
 * Billing statistics and revenue data.
 */
adminRouter.get("/reports/billing", getBillingSummary);

/*------------------------------------------------------------------------------------------------------------
ROUTE 7 : AUDIT
--------------------------------------------------------------------------------------------------------------*/
adminRouter.use("/audit" , auditRouter);

export default adminRouter;