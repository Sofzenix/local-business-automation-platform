import subscriptionModel from "../subscription/subscription.model.js";
import Billing from "../billing/billing.model.js";

export async function subscriptionSummary() {
  const data = await subscriptionModel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const summary = {
    total: 0,
    TRIAL: 0,
    ACTIVE: 0,
    READ_ONLY: 0,
    SUSPENDED: 0
  };

  data.forEach(d => {
    summary[d._id] = d.count;
    summary.total += d.count;
  });

  return summary;
}

export async function billingSummary() {
  return Billing.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        amount: { $sum: "$amount" }
      }
    }
  ]);
}