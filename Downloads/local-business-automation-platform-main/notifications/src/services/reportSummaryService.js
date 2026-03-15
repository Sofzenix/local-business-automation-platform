const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

async function generateDailySummary(businessId) {

 const start = new Date();
 start.setHours(0,0,0,0);

 const end = new Date();
 end.setHours(23,59,59,999);

 const orders = await Order.find({
  businessId,
  createdAt: { $gte: start, $lte: end }
 });

 const ordersCount = orders.length;

 let totalSales = 0;
 orders.forEach(o => totalSales += o.totalAmount);

 const orderIds = orders.map(o => o._id);

 const items = await OrderItem.find({
  orderId: { $in: orderIds }
 }).populate("itemId");

 const itemMap = {};

 items.forEach(i => {

  const name = i.itemId.itemName;

  if (!itemMap[name]) itemMap[name] = 0;

  itemMap[name] += i.quantity;

 });

 let itemsSummary = "";

 for (const item in itemMap) {
  itemsSummary += `${item} - ${itemMap[item]}\n`;
 }

 return {
  ordersCount,
  totalSales,
  itemsSummary
 };

}

module.exports = { generateDailySummary };