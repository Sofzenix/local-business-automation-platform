const cron = require("node-cron");
const ProductMenu = require("../models/ProductMenu");
const sendWhatsAppAlert = require("../utils/whatsappService");

console.log("✅ Expiry cron file loaded");

// ⏰ every 10 seconds (for testing)
cron.schedule("*/10 * * * * *", async () => {
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
        
        // ✅ Console log
        console.log(
          `⏰ EXPIRY ALERT: ${med.itemName} expires in ${diffDays} days`
        );

        // ✅ EVENT LOG (IMPORTANT FOR TEAM)
        console.log("EVENT: EXPIRY_ALERT", {
          itemName: med.itemName,
          daysLeft: diffDays,
          expiryDate: expiryDate.toDateString()
        });

        // ✅ WhatsApp (for demo)
        await sendWhatsAppAlert(
          `⏰ EXPIRY ALERT (${diffDays} days)\nMedicine: ${med.itemName}\nExpiry: ${expiryDate.toDateString()}`
        );
      }
    }
  } catch (error) {
    console.error("❌ Expiry Cron Error:", error);
  }
});