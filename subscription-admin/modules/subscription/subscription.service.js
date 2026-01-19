import subscriptionModel from "./subscription.model.js";
import { ObjectId } from 'mongodb'
const TRIAL_DAYS = Number(process.env.TRIAL_DAYS || 7);
const GRACE_DAYS = Number(process.env.GRACE_DAYS || 3);

export async function getSubscriptionDetail(businessId) {
    //get the subscription from DB
    // console.log("businessId: ", new ObjectId(businessId));

    const subscription = await subscriptionModel.findOne({ businessId: new ObjectId(businessId) });
    // console.log("subscription:", subscription)
    //if no subscription exists
    if (!subscription) {
        return {
            status: "NO_SUBSCRIPTION",
        }
    }

    const today = new Date();

    //hard coding --
    if (subscription.status === "SUSPENDED") {
        return { status: "SUSPENDED", planType: subscription.planType };
    }

    if (subscription.graceEndsOn && today > subscription.graceEndsOn) {
        return {
            status: "SUSPENDED",
            planType: subscription.planType,
        }
    }
    if (subscription.endDate && today >= subscription.endDate) {//grace days still remaining
        return {
            status: "READ_ONLY",
            planType: subscription.planType,
        }
    }

    //calculating remaining days
    const daysRemaining = subscription
        ?.endDate
        ? Math.ceil((subscription.endDate - today) / (1000 * 60 * 60 * 24))
        : null;

    //TRIAL or ACTIVE
    return {
        status: subscription.status,
        planType: subscription.planType,
        daysRemaining,
    }
}


export async function startTrialService(businessId) {
    
    //check is businessId valid or not
    // const isValid = await Business.exists({_id:businessId});
    // if(!isValid) return {success:false , message:"Invalid businessId"}

    //check already subscribed or not
    const existing = await subscriptionModel.findOne({ businessId });
    if (existing) {
        return { success: false, message: "Subscription already exists" }
    }
    //if not subscribed start the free trial
    //calculating dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + TRIAL_DAYS);

    const graceEndsOn = new Date();
    graceEndsOn.setDate(graceEndsOn.getDate() + GRACE_DAYS);

    //trial subscription
    const subscription = await subscriptionModel.create({
        businessId,
        planType: "TRIAL",
        status: "TRIAL",
        startDate,
        endDate,
        graceEndsOn,
        paymentMode: "NONE"
    });

    return { success: true, message: "Trial started successfully", data: subscription }

}

export async function activateSubscriptionService({ businessId, planType, paymentMode }) {
    const subscription = await subscriptionModel.findOne({ businessId });

    if (!subscription) {
        return { success: false, message: "Subscription not found" }
    }

    const startDate = new Date();
    const endDate = new Date();

    if (planType === "MONTHLY") {
        endDate.setDate(endDate.getDate() + 30);//assuming 30days month
    }
    else if (planType === "YEARLY") {
        endDate.setDate(endDate.getDate() + 365);//assumption year = 365 days
    }

    const graceEndsOn = new Date(endDate);
    graceEndsOn.setDate(graceEndsOn.getDate() + 3);

    subscription.planType = planType;
    subscription.status = "ACTIVE";
    subscription.startDate = startDate;
    subscription.endDate = endDate;
    subscription.graceEndsOn = graceEndsOn;
    subscription.paymentMode = paymentMode || "CASH";

    await subscription.save();

    return { success: true, message: "Subscription activated", data: subscription }


}