import {
  activateSubscription,
  extendSubscription,
  suspendSubscription,
  reactivateSubscription
} from "./admin.service.js";
import {
  subscriptionSummary,
  billingSummary
} from "./admin.report.service.js";


export async function activateSubscriptionController(req , res){
  try{
    const {businessId , planType , paymentMode} = req.body;
    const adminId = req.user.id;
    if(!businessId || !planType ){
      res.status(400).json({success:false , message:"businessId and planType is required"});
    }

    const result = await activateSubscription({businessId , planType , paymentMode ,adminId});
    
    return res.status(result.success?200:result.code).json(
      result.success ? result 
      :{success:false , message:result.message}
    );


  }catch(error){
    console.error(error);
    return res.status(500).json({
      success:false,
      code:"INTERNAL_SERVER_ERROR",
      message:"Error occur while activating subscription"
    })
  }
}

export async function extendSubscriptionController(req, res) {
  try {
    const { subscriptionId, extraDays } = req.body;

    if (!subscriptionId || !extraDays) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        message: "subscriptionId and extraDays are required"
      });
    }

    const result = await extendSubscription({
      subscriptionId,
      extraDays,
      adminId: req.user.id
    });

    return res.status(result.success ? 200 : result.code).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while extending subscription"
    });
  }
}

export async function suspendSubscriptionController(req, res) {
  try {
    const { subscriptionId } = req.body;
    if(!subscriptionId) return res.status(400).json({success:false , message:"subscriptionId required"})
    const result = await suspendSubscription(subscriptionId,req.user.id);

    return (result.success
    ? res.status(200).json(result)
    : res.status(result.code).json({success:false , message:result.message}));

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to suspend subscription"
    });
  }
}

export async function reactivateSubscriptionController(req, res) {
  try {
    const { subscriptionId } = req.body;
    if(!subscriptionId) return res.status(400).json({success:false , message:"subscriptionId is Required."})
    const result = await reactivateSubscription(
      subscriptionId,
      req.user.id
    );

    return (result.success
    ? res.status(200).json(result)
    : res.status(result.code).json({success:false , message:result.message}));

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Unable to reactivate subscription"
    });
  }
}

export async function getSubscriptionSummary(req, res) {
  try {
    const data = await subscriptionSummary();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch subscription summary"
    });
  }
}

export async function getBillingSummary(req, res) {
  try {
    const data = await billingSummary();

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch billing summary"
    });
  }
}