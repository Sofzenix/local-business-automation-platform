import { Router } from "express";
import {
  getStatus,
  startTrial,
  upgradePlan
} from "./subscription.controller.js";

const router = Router();

// user-facing subscription APIs

/**
 * GET /api/subscription/status/:businessId
 * 
 * Return the current subscription state for a business.
 * @param{String} - Business identifier it's 12 byte (24 character hex string)
 * @returns{Object} Success response
 * {
 *  success:true,
 *  message:"Subscription status fetched"
 *  data:{
 *          status:"TRIAL" | "ACTIVE" | "READ_ONLY" | "SUSPENDED",
 *          planType?:string,
 *          daysRemaining?:number
 *        }
 * }
 * 
 * Error Responses:
 * --400:Invalid businessId
 * --404:Subscription not found | Invalid businessId
 * --500:Internal server error
 */

router.get("/status/:businessId", getStatus);


/**
 * POST /api/subscription/start-trial
 * @body {string} - businessId : it's 12 byte (24 character hex string)
 * @returns {Object} Success response
 * {
 *    success:true,
 *    message:"Trial started successfully",
 *    data:{
 *            _id:ObjectId,
 *             businessId:ObjectId,
 *             planType:"TRIAL",
 *             status:"TRIAL",
 *             startDate:Date,
 *             endDate:Date,
 *             graceEndsOn:Date,
 *             paymentMode:"NONE"
 *             
 *          }
 * }
 * 
 * Error Response:
 * - 400 : Invalid businessId
 * - 400 : Subscription already exists
 * - 500 : Internal server error
 * 
 * Notes:
 * - Only one subscription can exist per business
 * - Trial duration and grace period are controlled by environment variables
 * - This endpoint mutate database state
 */
router.post("/start-trial", startTrial);

/**
 * POST /api/subscription/upgrade
 * 
 * Initiate an upgrade from trial or active or read_only or suspended or new subscription
 * to a paid plan (MONTHLY or YEARLY)
 * 
 * @body {string} [businessId] - it's a 12 byte identifier(24 character hex string)
 * @body {"MONTHLY" | "YEARLY" } [planType] - subscription plan to which user wants upgrade
 * @body {string} [paymentMode] - Payment method (UPI , CARD etc.)
 * 
 * 
 */
router.post("/upgrade", upgradePlan);

export default router;