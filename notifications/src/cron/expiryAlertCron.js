import cron from "node-cron";
import Business from "../models/Business.js";
import dispatcher from "../events/eventDispatcher.js";

/*
 Runs every day at 9:00 AM
*/

cron.schedule("0 09 * * *", async () => {
  console.log("Running expiry alert cron...");

  const businesses = await Business.find({
    businessType: "medical",
    status: "active",
  });

  for (const business of businesses) {
    console.log("Checking expiry medicines for:", business.businessName);

    await dispatcher.dispatch("EXPIRY_ALERT", {
      businessType: "medical",
      businessId: business.businessId,
      phone: business.whatsappNumber,
    });
  }
});
