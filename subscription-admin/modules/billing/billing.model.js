import mongoose from 'mongoose'

const billingSchema = new mongoose.Schema({
    businessId:{
        type:mongoose.Types.ObjectId,
        ref:"Business",
        required:true,
        index:true
    },
    subscriptionId:{
        type:mongoose.Types.ObjectId,
        ref:"subscription",
        required:true,
        index:true
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
    planType:{
        type:String,
        enum:["MONTHLY","YEARLY"],
        required:true
    },
    status:{
        type:String,
        enum:["PENDING","PAID" ,"OVERDUE","CANCELLED","FAILED"],
        default:"PENDING",
        index:true
    },
    paymentMode:{
        type:String,
        enum:["UPI","CARD","NETBANKING","CASH"],
        default:"NONE"
    },
    dueDate:{
        type:Date
    },
    paidAt:{
        type:Date
    }

},
{timestamps:true}
);

export default mongoose.model("Billing" , billingSchema);