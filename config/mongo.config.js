import mongoose from "mongoose";

function cleanEnv(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export default async function connectToDB() {
  const mongoUri = cleanEnv(process.env.MONGO_URI);
  const dbName = cleanEnv(process.env.DB_NAME);

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in .env");
  }

  if (!dbName) {
    throw new Error("DB_NAME is missing in .env");
  }

  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to DB");
    return;
  }

  try {
    await mongoose.connect(mongoUri, { dbName });

    // Ensure the default connection is fully ready before handling requests
    await mongoose.connection.asPromise();

    console.log(`Connected to DB (${dbName})`);
  } catch (err) {
    console.error("Failed to connect:", err.message);
    process.exit(1);
  }
}
