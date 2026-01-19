import {
  activateSubscriptionService,
  extendSubscription,
  getSubscriptionDetail,
  reactiveSubscription,
  startTrialService,
  suspendSubscription
} from "./subscription.service.js";

export async function getStatus(req, res) {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        message: "businessId is required"
      });
    }

    const details = await getSubscriptionDetail(businessId);

    return res.status(200).json({
      success: true,
      message: "Subscription status fetched",
      data: details
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch subscription status"
    });
  }
}

export async function startTrial(req, res) {
  try {
    const { businessId } = req.body;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        message: "businessId is required"
      });
    }

    const result = await startTrialService(businessId);

    return res
      .status(result.success ? 201 : 400)
      .json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not start trial"
    });
  }
}

export async function upgradePlan(req, res) {
  try {
    // TODO (Phase 2):
    // - validate input
    // - generate invoice
    // - update subscription after payment

    return res.status(501).json({
      success: false,
      code: "NOT_IMPLEMENTED",
      message: "Upgrade flow will be implemented in Phase 2"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Upgrade failed"
    });
  }
}