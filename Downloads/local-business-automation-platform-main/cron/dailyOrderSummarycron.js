import { schedule } from "node-cron";
import Order from "../models/Ordermodel.js";

// Daily order summary at 11:59 PM
schedule("59 23 * * *", async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      orderDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    console.log("📊 Daily Order Summary");
    console.log("Total Orders:", totalOrders);
    console.log("Total Revenue:", totalRevenue);

    // 🔔 WhatsApp summary trigger will be added here later
  } catch (error) {
    console.error("[CRON] Order summary failed:", error.message);
  }
});
