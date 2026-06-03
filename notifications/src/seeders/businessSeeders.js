import mongoose from "mongoose";
import Business from "../models/Business.js";

await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/messaging-system");

async function seedBusinesses() {

  try {

    await Business.deleteMany(); // optional: clears old data

    const businesses = [
      {
        businessId: "MED001",
        userId: new mongoose.Types.ObjectId(), // temporary user
        businessName: "City Medical Store",
        businessType: "medical",
        location: "Main Market",
        whatsappNumber: "919111111111",
        status: "active"
      },
      {
        businessId: "TIF001",
        userId: new mongoose.Types.ObjectId(),
        businessName: "HomeStyle Tiffin Center",
        businessType: "tiffin",
        location: "Sector 5",
        whatsappNumber: "919222222222",
        status: "active"
      },
      {
        businessId: "KIR001",
        userId: new mongoose.Types.ObjectId(),
        businessName: "Sharma Kirana Store",
        businessType: "kirana",
        location: "Station Road",
        whatsappNumber: "919333333333",
        status: "active"
      }
    ];

    await Business.insertMany(businesses);

    console.log("✅ Businesses inserted successfully");

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }

}

seedBusinesses();