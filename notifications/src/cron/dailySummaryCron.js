const cron = require("node-cron");
const Business = require("../models/Business");
const dispatcher = require("../events/eventDispatcher");

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
