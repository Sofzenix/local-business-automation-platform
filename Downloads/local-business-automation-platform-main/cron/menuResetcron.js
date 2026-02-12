import { schedule } from "node-cron";
import Menu from "../models/Menumodel.js";

// Daily menu reset at 5:00 AM
schedule("0 5 * * *", async () => {
  try {
    await Menu.updateMany({}, { isAvailable: false });
    console.log("[CRON] Daily menu reset completed");
  } catch (error) {
    console.error("[CRON] Menu reset failed:", error.message);
  }
});
