import subscriptionModel from "../subscription/subscription.model.js";
import { SUBSCRIPTION_STATUS } from "../subscription/subscription.constants.js";
import { logAudit } from "../audit/audit.service.js";

export async function activateSubscription({ businessId, planType, paymentMode }) {
  const subscription = await subscriptionModel.findOne({ businessId });

  if (!subscription) {
    return { success: false, message: "Subscription not found" };
  }

  const startDate = new Date();
  const endDate = new Date(startDate);

  if (planType === "MONTHLY") endDate.setDate(endDate.getDate() + 30);
  if (planType === "YEARLY") endDate.setDate(endDate.getDate() + 365);

  subscription.planType = planType;
  subscription.status = SUBSCRIPTION_STATUS.ACTIVE;
  subscription.startDate = startDate;
  subscription.endDate = endDate;
  subscription.paymentMode = paymentMode || "CASH";

  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_ACTIVATED"
  });

  return { success: true, data: subscription };
}

export async function extendSubscription({ subscriptionId, extraDays, adminId }) {
  const subscription = await subscriptionModel.findById(subscriptionId);

  if (!subscription) {
    return { success: false, message: "Subscription not found" };
  }

  const baseDate =
    subscription.endDate && subscription.endDate > new Date()
      ? subscription.endDate
      : new Date();

  baseDate.setDate(baseDate.getDate() + extraDays);

  subscription.endDate = baseDate;
  subscription.status = SUBSCRIPTION_STATUS.ACTIVE;
  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_EXTENDED",
    metadata: { extraDays },
    performedBy: adminId
  });

  return { success: true };
}

export async function suspendSubscription(subscriptionId, adminId) {
  const subscription = await subscriptionModel.findById(subscriptionId);

  if (!subscription) return { success: false };

  subscription.status = SUBSCRIPTION_STATUS.SUSPENDED;
  await subscription.save();

  await logAudit({
    entityType: "SUBSCRIPTION",
    entityId: subscription._id,
    action: "SUBSCRIPTION_SUSPENDED",
    performedBy: adminId
  });

  return { success: true };
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