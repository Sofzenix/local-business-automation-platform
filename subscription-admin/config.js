import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
export default async function connectToDB (){
    try{
        await mongoose.connect(process.env.MONGO_URI , {dbName:"local-business-platform"});
        console.log("connected to DB")
    }
    catch(err){
        console.log("Failed To connect : " ,err.message);
        process.exit(1)
    }
}