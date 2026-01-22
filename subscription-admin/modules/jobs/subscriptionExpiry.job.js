import cron from "node-cron";
import subscriptionModel from "../subscription/subscription.model.js";

export async function startSubscriptionExpiryJob() {

  // -------------------------------
  // Expiry & suspension job (00:05)
  // -------------------------------
  cron.schedule("5 0 * * *", async () => {
    const today = new Date();

    try {
      // TRIAL / ACTIVE -> READ_ONLY
      const expired = await subscriptionModel.updateMany(
        {
          status: { $in: ["TRIAL", "ACTIVE"] },
          endDate: { $lt: today }
        },
        { $set: { status: "READ_ONLY" } }
      );

      // READ_ONLY -> SUSPENDED
      const suspended = await subscriptionModel.updateMany(
        {
          status: "READ_ONLY",
          graceEndsOn: { $lt: today }
        },
        { $set: { status: "SUSPENDED" } }
      );

      console.log(
        `[SUBSCRIPTION JOB] Expired: ${expired.modifiedCount}, Suspended: ${suspended.modifiedCount}`
      );

    } catch (error) {
      console.error("Subscription expiry job failed", error);
    }
  });

  // ---------------------------------
  // Reminder job (09:00, read-only)
  // ---------------------------------
  cron.schedule("0 9 * * *", async () => {
    const today = new Date();
    const MS_IN_DAY = 1000 * 60 * 60 * 24;

    // Reminder job: read-only, no state mutation
    const subs = await subscriptionModel.find({
      status: { $in: ["TRIAL", "ACTIVE", "READ_ONLY"] }
    });

    for (const sb of subs) {
      const diffDays = Math.ceil((sb.endDate - today) / MS_IN_DAY);
      const graceDays = sb.graceEndsOn
        ? Math.ceil((sb.graceEndsOn - today) / MS_IN_DAY)
        : null;

      // Expiry reminders
      if (diffDays === 3 || diffDays === 1) {
        console.log(
          `[SUBSCRIPTION REMINDER] D-${diffDays} for business ${sb.businessId}`
        );
      }

      // Grace reminder (final warning)
      if (sb.status === "READ_ONLY" && graceDays === 1) {
        console.log(
          `[GRACE REMINDER] Account will be suspended tomorrow for business ${sb.businessId}`
        );
      }
    }
  });
}