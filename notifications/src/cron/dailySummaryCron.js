import cron from "node-cron";
import Business from "../models/Business.js";
import dispatcher from "../events/eventDispatcher.js";

cron.schedule("30 23 * * *", async () => {
  const businesses = await Business.find({ status: "active" });

  for (const b of businesses) {
    await dispatcher.dispatch("DAILY_SUMMARY", {
      businessType: b.businessType,
      businessId: b.businessId,
      phone: b.whatsappNumber,
    });
  }
});
