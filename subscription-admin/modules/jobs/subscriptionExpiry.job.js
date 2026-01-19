import cron from 'node-cron'
import subscriptionModel from '../subscription/subscription.model.js'

export async function startSubscriptionExpiryJob(){
    cron.schedule("5 0 * * *" , async ()=>{
        const today = new Date();
        try{
            //TRIAL / ACTIVE -> READ_ONLY
            const expired = await subscriptionModel.updateMany(
                {status:{$in:["TRIAL" , "ACTIVE"]},
                 endDate:{$lt:today}
                },
                {$set:{status:"READ_ONLY"}}
            );

            //READ_ONLY -> SUSPENDED
            const suspended = await subscriptionModel.updateMany(
                {status:"READ_ONLY",
                 graceEndsOn:{$lt:today}
                },
                {$set:{status:"SUSPENDED"}}
            );
            console.log(`ACTIVE/TRIAL -> READ_ONLY : ${expired.modifiedCount} \n READ_ONLY -> SUSPENDED ; ${suspended.matchedCount}`)
        }catch(error){
            console.log("Subscription expiry job failed.")
        }
    })
}