import { activateSubscriptionService, getSubscriptionDetail ,startTrialService } from "./subscription.service.js";

export async function getStatus(req , res ){
    try{
        const {businessId} = req.params;
        const details = await getSubscriptionDetail(businessId);

        return res.json({
            success:true,
            message:"Subscription status fetched.",
            data:details
        })

    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Failed to fetch subscription status"
        })
    }
}

export async function startTrial(req, res) {
  try {
    console.log(req.body);
    const { businessId } = req.body;
    const result = await startTrialService(businessId);

    result.success ? res.status(201).json(result)
    :res.status(400).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Could not start trial"
    });
  }
}

export async function activateSubscription(req , res){
    try{
        const {businessId , planType , paymentMode} = req.body;
        const result = await activateSubscriptionService({businessId , planType , paymentMode});
        result.success ?
        res.json(result):
        res.status(404).json(result);
    }catch(error){
        console.error(error);
        res.status(500).json({success:false , message:"Failed to activate subscription"})
    }
}


export async function upgradePlan(req, res) {
  try {
    const { businessId, planType, paymentMode } = req.body;

    // get existing subscription
    // based on planType set new endDate
    // update status to ACTIVE
    // save paymentMode

    return res.json({
      success: true,
      message: "Plan upgraded"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Upgrade failed"
    });
  }
}


export async function adminUpdateSubscription(req, res) {
  try {
    const { businessId, status, extendDays } = req.body;

    // find subscription
    // if extendDays is given, add it to endDate
    // if status is given, update status
    // save updated record

    return res.json({
      success: true,
      message: "Subscription updated"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
}