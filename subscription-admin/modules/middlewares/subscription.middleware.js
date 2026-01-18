import { getSubscriptionDetail } from "../subscription/subscription.service.js";

export function checkSubscription(accessType = "read"){
    return async function(req , res , next){
        try{
            // const {businessId} = req.user; //assuming auth middleware already sat req.user 
            const {businessId} = req.params;

            const subscription = await getSubscriptionDetail(businessId);

            if(subscription.status === "NO_SUBSCRIPTION"){
                return res.status(403).json({
                    success:false,
                    code:"SUBSCRIPTION_REQUIRED",
                    message:"Subscription not initialized"
                });
            }

            if(subscription.status === "SUSPENDED"){
                return res.status(403).json({
                    success:false ,
                    code:"SUBSCRIPTION_SUSPENDED",
                    message:"Subscription suspended"
                });
            }

            //TRIAL OR ACTIVE
            if(accessType === "write" && subscription.status === "READ_ONLY"){
                return res.status(403).json({
                    success:false,
                    code:"READ_ONLY_MODE",
                    message:"Upgrade subscription to perform this action"
                });
            }
            req.subscription = subscription;//no need to fetch subscription detail further
            next();
        }catch(error){
            return res.status(500).json({
                success:false,
                message:"Subscription check failed"
            })
        }
    }
}