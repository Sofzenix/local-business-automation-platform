const cron = require("node-cron");
const Order = require("../models/Order");

// ⏰ Runs every day at 11:59 PM
cron.schedule("59 23 * * *", async () => {
  console.log("📊 Running Daily Sales Summary Cron");

  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
    });

    const totalSales = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    console.log("🧾 Total Orders Today:", orders.length);
    console.log("💰 Total Sales Amount: ₹", totalSales);
  } catch (error) {
    console.error("Daily Sales Cron Error:", error);
  }
});
