const cron = require("node-cron");
const Business = require("../models/Business");
const dispatcher = require("../events/eventDispatcher");

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
