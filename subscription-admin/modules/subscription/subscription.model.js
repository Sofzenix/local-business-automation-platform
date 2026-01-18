import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema(
    {
    businessId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"businesses",
        required:true,
        unique:true
    },
    planType:{
        type:String,
        enum:["TRIAL","MONTHLY" ,"YEARLY"],
        default:"TRIAL"
    },
    status:{
        type:String,
        enum:["TRIAL","ACTIVE","READ_ONLY","SUSPENDED"] ,
        default:"TRIAL"
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date
    },
    graceEndsOn:{
        type:Date
    },
    paymentMode:{
        type:String,
        enum:["NONE","DEBIT CARD","UPI","ONLINE"],
        default:"NONE"
    },
},
{timestamps:true}
);

const subscriptionModel = mongoose.model("Subscription" , subscriptionSchema)
export default subscriptionModel;