import {
  getSubscriptionDetail,
  startTrialService,
  upgradePlanService
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

    return res.status(details.code?details.code:200).json({
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
    const {businessId , planType ,paymentMode} = req.body;
    const result = await upgradePlanService({businessId , planType , paymentMode});
    return res.status(result.code ?result.code:200).json(
      result.code
      ?result.message
      :result
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Upgrade failed"
    });
  }
}