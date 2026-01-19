import mongoose from 'mongoose'

const billingSchema = new mongoose.Schema({
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:"Business",
        required:true
    },
    subscriptionId:{
        type:mongoose.Types.ObjectId,
        ref:"subscription",
        required:true
    },
    invoiceNumber:{
        type:String,
        required:true,
        unique:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        default:"INR"
    },
    status:{
        type:String,
        enum:["PENDING","PAID" ,"OVERDUE"],
        default:"PENDING"
    },
    paidAt:{
        type:Date
    }
},
{timestamps:true}
);

export default mongoose.model("Billing" , billingSchema);