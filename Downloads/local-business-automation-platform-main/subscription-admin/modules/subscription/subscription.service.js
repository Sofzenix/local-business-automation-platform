import subscriptionModel from "./subscription.model.js";
import { isValidObjectId } from "./subscription.utils.js";
import { SUBSCRIPTION_STATUS, SYSTEM_VAR ,PLAN_PRICING} from "./subscription.constants.js";
import { generateInvoice } from "../billing/billing.service.js";

const TRIAL_DAYS = Number(SYSTEM_VAR.TRIAL_DAYS || 7);
const GRACE_DAYS = Number(SYSTEM_VAR.GRACE_DAYS || 3);

export async function getSubscriptionDetail(businessId) {

  if (!isValidObjectId(businessId)) {
    return {code:404,  status:SUBSCRIPTION_STATUS.INVALID_ID };
  }

  const subscription = await subscriptionModel.findOne({ businessId });

  if (!subscription) {
    return {code:404 ,  status: SUBSCRIPTION_STATUS.NO_SUBSCRIPTION };
  }

  const today = new Date();

  // HARD STOP
  if (subscription.status === SUBSCRIPTION_STATUS.SUSPENDED) {
    return {
      
      status: SUBSCRIPTION_STATUS.SUSPENDED,
      planType: subscription.planType
    };
  }

  // Grace expired
  if (subscription.graceEndsOn && today > subscription.graceEndsOn) {
    return {
      status: SUBSCRIPTION_STATUS.SUSPENDED,
      planType: subscription.planType
    };
  }

  // Subscription expired but grace still active
  if (subscription.endDate && today > subscription.endDate) {
    return {
      status: SUBSCRIPTION_STATUS.READ_ONLY,
      planType: subscription.planType
    };
  }

  // Still active / trial
  const daysRemaining = subscription.endDate
    ? Math.ceil(
        (subscription.endDate - today) / (1000 * 60 * 60 * 24)
      )
    : null;

  return {
    
    status: subscription.status,
    planType: subscription.planType,
    daysRemaining
  };
}

export async function startTrialService(businessId) {

  if (!isValidObjectId(businessId)) {
    return { success: false, message: "Invalid businessId" };
  }

  const existing = await subscriptionModel.findOne({ businessId });

  if (existing) {
    return { success: false, message: "Subscription already exists" };
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DAYS);

  const graceEndsOn = new Date(endDate);
  graceEndsOn.setDate(graceEndsOn.getDate() + GRACE_DAYS);

  const subscription = await subscriptionModel.create({
    businessId,
    planType: SUBSCRIPTION_STATUS.TRIAL,
    status: SUBSCRIPTION_STATUS.TRIAL,
    startDate,
    endDate,
    graceEndsOn,
    paymentMode: "NONE"
  });

  return {
    success: true,
    message: "Trial started successfully",
    data: subscription
  };
}


export async function upgradePlanService({ businessId, planType, paymentMode }) {

  //Validate businessId
  if (!isValidObjectId(businessId)) {
    return {
      code: 400,
      message: "Invalid businessId"
    };
  }

  //Fetch subscription
  const subscription = await subscriptionModel.findOne({ businessId });

  if (!subscription) {
    return {
      code: 404,
      message: "Subscription not found. Start trial first."
    };
  }

  //Validate planType
  const amount = PLAN_PRICING[planType];
  if (!amount) {
    return {
      code: 400,
      message: "Invalid plan type"
    };
  }

  //Check existing pending invoice 
  const existingInvoice = await Billing.findOne({
    subscriptionId: subscription._id,
    status: "PENDING"
  });

  if (existingInvoice) {
    if (existingInvoice.planType === planType) {
      return {
        success: true,
        message: "Payment already pending for selected plan",
        data: {
          invoiceId: existingInvoice._id,
          planType: existingInvoice.planType,
          amount: existingInvoice.amount,
          dueDate: existingInvoice.dueDate
        }
      };
    }

    // cancel old invoice
    existingInvoice.status = "CANCELLED";
    await existingInvoice.save();
  }

  //Compute due date (policy-driven)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + SYSTEM_VAR.INVOICE_DUE_DAYS);

  //Generate new invoice
  const invoice = await generateInvoice({
    businessId,
    subscriptionId: subscription._id,
    planType,
    amount,
    dueDate,
    paymentMode
  });

  return {
    success: true,
    message: "Upgrade initiated. Payment pending.",
    data: {
      invoiceId: invoice._id,
      planType,
      amount: invoice.amount,
      dueDate: invoice.dueDate
    }
  };
}