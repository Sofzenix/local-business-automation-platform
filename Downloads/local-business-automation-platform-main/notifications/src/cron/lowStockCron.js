const cron = require("node-cron");
const Business = require("../models/Business");
const dispatcher = require("../events/eventDispatcher");

/*
 Runs every day at 10:00 AM
 Checks low stock medicines
*/

cron.schedule("0 10 * * *", async () => {

  console.log("Running low stock alert cron...");

  const businesses = await Business.find({
    businessType: "medical",
    status: "active"
  });

  for (const business of businesses) {

    console.log("Checking low stock for:", business.businessName);
     
        await dispatcher.dispatch("LOW_STOCK", {
          businessType: business.businessType,
          businessId: business.businessId,
          phone: business.whatsappNumber,
        });
      

  }

});