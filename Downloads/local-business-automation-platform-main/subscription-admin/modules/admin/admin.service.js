import subscriptionModel from "../subscription/subscription.model.js";
import { SUBSCRIPTION_STATUS } from "../subscription/subscription.constants.js";
import { logAudit } from "../audit/audit.service.js";
import { SYSTEM_VAR } from "../subscription/subscription.constants.js";

export async function activateSubscription({ businessId, planType, paymentMode ,adminId }) {
  const subscription = await subscriptionModel.findOne({ businessId });

  if (!subscription) {
    return { success: false, message: "Subscription not found" , code:404 };
  }

  if(subscription.status === "ACTIVE"){
    return {success:false , message:"Plan already exists." , code:400}
  }

  const startDate = new Date();
  const endDate = new Date(startDate);

  if (planType === "MONTHLY") endDate.setDate(endDate.getDate() + SYSTEM_VAR.MONTHLY);
  if (planType === "YEARLY") endDate.setDate(endDate.getDate() + SYSTEM_VAR.YEARLY);

  subscription.planType = planType;
  subscription.status = SUBSCRIPTION_STATUS.ACTIVE;
  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.paymentMode = paymentMode || "CASH";

  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_ACTIVATED",
    performedBy:adminId
  });

  return { success: true, message:"Your plan Activated successfully." ,data: subscription };
}

export async function extendSubscription({ subscriptionId, extraDays, adminId }) {
  const subscription = await subscriptionModel.findById(subscriptionId);

  if (!subscription) {
    return { success: false, message: "Subscription not found" , code:404 };
  }

  const baseDate =
    subscription.endDate && subscription.endDate > new Date()
      ? subscription.endDate
      : new Date();

  baseDate.setDate(baseDate.getDate() + extraDays);

  subscription.endDate = baseDate;
  subscription.status = subscription.status === "TRIAL"?"TRIAL":SUBSCRIPTION_STATUS.ACTIVE;
  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_EXTENDED",
    metadata: { extraDays },
    performedBy: adminId
  });

  return { success: true , message:"Successfully extended the subscription."};
}

export async function suspendSubscription(subscriptionId, adminId) {
  const subscription = await subscriptionModel.findById(subscriptionId);

  if (!subscription) return { success: false ,message:"Subscription not found" , code:404};

  subscription.status = SUBSCRIPTION_STATUS.SUSPENDED;
  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_SUSPENDED",
    performedBy: adminId
  });

  return { success: true , message:"Subscription is suspended successfully."};
}

export async function reactivateSubscription(subscriptionId, adminId) {
  const subscription = await subscriptionModel.findById(subscriptionId);

  if (!subscription) {
    return { success: false, message: "Invalid subscriptionId" };
  }

  subscription.status = SUBSCRIPTION_STATUS.ACTIVE;
  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_REACTIVATED",
    performedBy: adminId
  });

  return { success: true };
}