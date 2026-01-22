import subscriptionModel from "./subscription.model.js";
import { isValidObjectId } from "./subscription.utils.js";
import { SUBSCRIPTION_STATUS } from "./subscription.constants.js";

const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 7);
const GRACE_DAYS = Number(process.env.GRACE_DAYS || 3);

export async function getSubscriptionDetail(businessId) {

  if (!isValidObjectId(businessId)) {
    return {code:404,  status: SUBSCRIPTION_STATUS.INVALID_ID };
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