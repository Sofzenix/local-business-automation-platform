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
import { listInvoices, markInvoicePaid } from "../billing/billing.controller.js";

const adminRouter = Router();

adminRouter.use(mockAuth, isAdmin);

/*------------------------------------------------------------------------------------------------------------
ROUTE 1 : ACTIVATE
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/activate
 * 
 * Initiate Activation of chosen plan marking status as ACTIVE
 * 
 * @body {string} [businessId] - it's 12 byte identifier (24 character hex string)
 * @body {"MONTHLY" | "YEARLY"} [planType] - subscription plan , chosen by user
 * @body {string} [paymentMode] - Payment method user used (UPI , CARD , CASH etc.)
 * 
 * @returns {Object} Success response
 * 
 * {  success:true ,
 *    message:"Your subscription is successfully activated.",
 *    data:{
 *            _id:ObjectId,
 *            businessId:ObjectId,
 *            planType:"MONTHLY"|"YEARLY",
 *            status:"ACTIVE",
 *            startDate:Date,
 *            endDate:Date,
 *            graceEndsOn:Date,
 *            paymentMode:"UPI"|"CARD"|"CASH" etc,
 *        }
 * }
 * 
 * 
 * Error Response:
 * - 400 : businessId and planType must be provided
 * - 400 : Plan already exists
 * - 404 : subscription not found
 * - 500 : Internal Server Error
 * 
 * Notes:
 * - Only one subscription can exists per business 
 * - already active subscription can not be activate again
 * - this endpoint mutate database 
 */
adminRouter.post("/activate" , activateSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 2 : EXTEND
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/extend 
 * 
 * Extend the user plan by increasing end date 
 * 
 * @body {ObjectId} [subscriptionId] - subscriptionId is identifier of your current subscription which you want to extend
 * @body {Number} [extraDays] - Number of days of which user want the extension
 * 
 * @return {Object} Success response
 * {
    success:true,
    message:"Successfully extended the subscription"
  }
 * Error Response:
  - 400 : Required input not provided subscriptionId and extraDays
  - 404 : Subscription does not exists 
  - 500 : Internal server Error
 */
adminRouter.post("/extend", extendSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 3 : SUSPEND
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/suspend
 * Suspend the user subscription immediately
 * 
 * @body {ObjectId} [subscriptionId] - 12 bytes identifier for subscription plan user own
 * 
 * @return {Object} Success response
 * {
      success:true,
      message:"Subscription is suspended successfully."
 * }

Error Response:
- 400 : subscription ID is not provided
- 404 : subscription not found
- 500 : internal server error
 */
adminRouter.post("/suspend", suspendSubscriptionController);

/*------------------------------------------------------------------------------------------------------------
ROUTE 4 : REACTIVATE
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/reactivate
 * Reactivate a suspended subscription
 * @body {ObjectId} subscriptionId - MongoDB ObjectId(24 char hex string)
 * 
 * @return {Object} 
 * 
 * Error Response -
 * - 400 : Subscription Id has not been provided
 * - 400 : Subscription already expired 
 * - 404 : Subscription does not exist
 * - 500 : Internal server Error
 */
adminRouter.post("/reactivate", reactivateSubscriptionController);


/*------------------------------------------------------------------------------------------------------------
ROUTE 5 : SUBSCRIPTION SUMMARY REPORTS
--------------------------------------------------------------------------------------------------------------*/
/**
 * GET /api/admin/reports/subscriptions
 * Get subscription summary reports
 * 
 * @return {Object}
 * {
 * success:true,
 * data:{
 *      total:Number,
 *      TRIAL:Number,
 *      ACTIVE:Number,
 *      READ_ONLY:Number,
 *      SUSPENDED:Number
 *      }
 * }
 */
adminRouter.get("/reports/subscriptions", getSubscriptionSummary);


/*------------------------------------------------------------------------------------------------------------
ROUTE 6 : BILLING - SUMMARY REPORTS
--------------------------------------------------------------------------------------------------------------*/

/**
 * GET /api/admin/reports/billing
 * Get billing summary report
 * 
 * @return {Object} 
 * Billing Statics 
 * {
 * success:true,
 * data:[{_id:"PENDING",count:Number , amount:Number},{_id:"OVERDUE",count:Number , amount:Number}...]
 * }
 */
adminRouter.get("/reports/billing", getBillingSummary);

/*------------------------------------------------------------------------------------------------------------
ROUTE 7 : BILLING - INVOICE LIST
--------------------------------------------------------------------------------------------------------------*/

/**
 * GET /api/admin/billing
 *
 * Description:
 * Returns a list of all invoices in the system.
 * Accessible only by platform admin.
 *
 * Query Params (optional):
 * - limit {number} → maximum number of invoices to return (default: 50, max: 100)
 *
 * Response (200):
 * {
 *   success: true,
 *   data: [
 *     {
 *       _id,
 *       invoiceNumber,
 *       businessId,
 *       subscriptionId,
 *       planType,
 *       amount,
 *       status,        // PENDING | PAID | CANCELLED | FAILED
 *       dueDate,
 *       paidAt,
 *       createdAt
 *     }
 *   ]
 * }
 *
 * Errors:
 * 500 → INTERNAL_SERVER_ERROR
 *
 * Notes:
 * - Used by admin panel to monitor payment status.
 * - Does not modify any data.
 */
adminRouter.get("/billing" , listInvoices);
/*------------------------------------------------------------------------------------------------------------
ROUTE 8 : BILLING - MARK INVOICE PAID
--------------------------------------------------------------------------------------------------------------*/
/**
 * POST /api/admin/billing/:invoiceId/pay
 *
 * Description:
 * Marks an invoice as PAID and automatically activates
 * the corresponding subscription.
 *
 * Access:
 * - Admin only
 *
 * Route Params:
 * - invoiceId {string} → MongoDB ObjectId of invoice
 *
 * Flow:
 * 1. Validates invoiceId
 * 2. Ensures invoice exists and is PENDING
 * 3. Updates invoice status to PAID
 * 4. Sets paidAt timestamp
 * 5. Activates or extends subscription
 * 6. Logs audit record
 *
 * Success Response (200):
 * {
 *   success: true,
 *   message: "Invoice successfully marked as paid."
 * }
 *
 * Failure Responses:
 * 400 → Invalid invoiceId
 * 400 → Invoice cannot be marked as paid
 * 404 → Invoice not found
 * 500 → INTERNAL_SERVER_ERROR
 *
 * Notes:
 * - Payment confirmation automatically triggers subscription activation.
 * - Activation is dependent on invoice planType.
 * - This endpoint represents payment confirmation logic.
 */
adminRouter.post("/billing/:invoiceId/pay" , markInvoicePaid);

/*------------------------------------------------------------------------------------------------------------
ROUTE 7 :AUDIT
--------------------------------------------------------------------------------------------------------------*/

adminRouter.use("/audit" , auditRouter);

export default adminRouter;
