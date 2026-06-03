import dotenv from "dotenv";

import connectToDB from "./config/mongo.config.js";

// Single source of truth: root .env only (run `npm start` from repo root)
dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectToDB();

    // Load Express app + jobs only after MongoDB is connected (prevents query buffering timeouts)
    const { default: app } = await import("./app.js");

    const { startSubscriptionExpiryJob } =
      await import("./subscription-admin/jobs/subscriptionExpiry.job.js");
    const { startBillingReminderJob } =
      await import("./subscription-admin/jobs/bilingRemider.job.js");

    await import("./notifications/src/cron/expiryAlertCron.js");
    await import("./notifications/src/cron/lowStockCron.js");
    await import("./notifications/src/cron/dailySummaryCron.js");

    // Start subscription-related background jobs
    startSubscriptionExpiryJob();
    startBillingReminderJob();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
