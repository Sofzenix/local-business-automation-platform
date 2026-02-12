import { getSubscriptionDetail } from "../subscription/subscription.service.js";
import { SUBSCRIPTION_STATUS } from "../subscription/subscription.constants.js";

export function checkSubscription(accessType = "read") {
  return async function (req, res, next) {
    try {
      // Assumption: auth middleware sets req.user.businessId
      const { businessId } = req.user || {};

      if (!businessId) {
        return res.status(401).json({
          success: false,
          code: "UNAUTHORIZED",
          message: "Business context missing"
        });
      }

      const subscription = await getSubscriptionDetail(businessId);

      if (subscription.status === SUBSCRIPTION_STATUS.NO_SUBSCRIPTION) {
        return res.status(403).json({
          success: false,
          code: "SUBSCRIPTION_REQUIRED",
          message: "Subscription not initialized"
        });
      }

      if (subscription.status === SUBSCRIPTION_STATUS.SUSPENDED) {
        return res.status(403).json({
          success: false,
          code: "SUBSCRIPTION_SUSPENDED",
          message: "Subscription suspended"
        });
      }

      if (
        accessType === "write" &&
        subscription.status === SUBSCRIPTION_STATUS.READ_ONLY
      ) {
        return res.status(403).json({
          success: false,
          code: "READ_ONLY_MODE",
          message: "Upgrade subscription to perform this action"
        });
      }

      // Attach subscription context for downstream handlers
      req.subscription = subscription;

      return next();

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Subscription check failed"
      });
    }
  };
}