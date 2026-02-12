const cron = require("node-cron");
const ProductMenu = require("../models/ProductMenu");
const sendWhatsAppAlert = require("../utils/whatsappService");

console.log("✅ Expiry cron file loaded");

// ⏰ Runs every 30 seconds (FOR TESTING)
cron.schedule("0 9 * * * * *", async () => {
  console.log("🔄 Running Expiry Alert Cron");

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const medicines = await ProductMenu.find();

    for (const med of medicines) {
      const expiryDate = new Date(med.expiryDate);
      expiryDate.setHours(0, 0, 0, 0);

      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 30 || diffDays === 15 || diffDays === 7) {
        console.log(
          `⏰ EXPIRY ALERT: ${med.itemName} expires in ${diffDays} days`
        );

        await sendWhatsAppAlert(
          `⏰ EXPIRY ALERT (${diffDays} days)\nMedicine: ${med.itemName}\nExpiry Date: ${expiryDate.toDateString()}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Expiry Cron Error:", error);
  }
});
