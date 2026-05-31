import mongoose from "mongoose";

export default async function connectToDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  if (!process.env.DB_NAME) {
    throw new Error("DB_NAME is missing in .env");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log("Connected to DB");
  } catch (err) {
    console.error("Failed to connect:", err.message);
    process.exit(1);
  }
}