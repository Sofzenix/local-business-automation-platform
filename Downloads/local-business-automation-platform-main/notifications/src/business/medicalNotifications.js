const whatsappService = require("../services/whatsappService");
const smsService = require("../services/smsService");

const ProductMenu = require("../models/ProductMenu");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Business = require("../models/Business");
const MessageTemplate = require("../models/MessageTemplate");

/* -------------------------------
   TEMPLATE HELPERS
--------------------------------*/

async function getTemplate(eventType, businessType) {
  return await MessageTemplate.findOne({
    eventType,
    businessType,
    channel: "whatsapp",
  });
}

function fillTemplate(message, variables) {
  let finalMessage = message;

  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    finalMessage = finalMessage.replace(regex, variables[key]);
  }

  return finalMessage;
}

/* -------------------------------
   HANDLE EVENTS
--------------------------------*/

exports.handle = async (event, data) => {
  switch (event) {
    /* =====================================================
       DAILY SALES SUMMARY
    ===================================================== */

    // case "DAILY_SUMMARY":
    //   const { businessId, phone } = data;

    //   console.log("Generating daily summary for medical business:", businessId);

    //   const start = new Date();
    //   start.setHours(0, 0, 0, 0);

    //   const end = new Date();
    //   end.setHours(23, 59, 59, 999);

    //   const orders = await Order.find({
    //     businessId,
    //     createdAt: { $gte: start, $lte: end },
    //   });

    //   let totalSales = 0;

    //   orders.forEach((o) => (totalSales += o.totalAmount));

    //   const ordersCount = orders.length;

    //   const template = await getTemplate("DAILY_SUMMARY", "medical");

    //   if (!template) {
    //     console.log("Medical daily summary template not found");
    //     return;
    //   }

    //   const message = fillTemplate(template.message, {
    //     totalSales,
    //     ordersCount,
    //   });

    //   try {
    //     await whatsappService.sendMessage(phone, message);
    //     console.log("Medical daily summary sent");
    //   } catch (error) {
    //     console.log("WhatsApp failed. Sending SMS fallback...");

    //     try {
    //       await smsService.sendSMS(phone, message);
    //     } catch (smsError) {
    //       console.log("SMS fallback also failed:", smsError.message);
    //     }
    //   }

    //   break;

    case "DAILY_SUMMARY":
      const { businessId, phone } = data;

      console.log("Generating daily summary for medical business:", businessId);

      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const orders = await Order.find({
        businessId: businessId,
        orderDate: { $gte: start, $lte: end },
      });

      const ordersCount = orders.length;

      let totalSales = 0;
      orders.forEach((o) => (totalSales += o.totalAmount));

      const orderIds = orders.map((o) => o.orderId);

      const orderItems = await OrderItem.find({
        orderId: { $in: orderIds },
      });

      const itemMap = {};

      for (const item of orderItems) {
        const product = await ProductMenu.findOne({
          itemId: item.itemId,
        });

        if (!product) continue;

        const name = product.itemName;

        if (!itemMap[name]) itemMap[name] = 0;

        itemMap[name] += item.quantity;
      }

      let itemsSummary = "";

      for (const item in itemMap) {
        itemsSummary += `${item} - ${itemMap[item]}\n`;
      }

      const template = await getTemplate("DAILY_SUMMARY", "medical");

      const message = fillTemplate(template.message, {
        ordersCount,
        totalSales,
        itemsSummary,
      });

      await whatsappService.sendMessage(phone, message);

      console.log("Daily summary sent");

      break;

    /* =====================================================
       LOW STOCK ALERT
    ===================================================== */

    case "LOW_STOCK":
      const lowStockItems = await ProductMenu.find({
        businessId: data.businessId,
        stock: { $lte: 5 },
        isAvailable: true,
      });

      if (!lowStockItems.length) {
        console.log("No low stock medicines");
        return;
      }

      let lowStockList = "";

      lowStockItems.forEach((item) => {
        lowStockList += `${item.itemName} (Stock: ${item.stock})\n`;
      });

      const lowStockTemplate = await getTemplate("LOW_STOCK", "medical");

      if (!lowStockTemplate) {
        console.log("Low stock template not found");
        return;
      }

      const lowStockMessage = fillTemplate(lowStockTemplate.message, {
        items: lowStockList,
      });

      try {
        await whatsappService.sendMessage(data.phone, lowStockMessage);
        console.log("Low stock alert sent");
      } catch (error) {
        console.log("WhatsApp failed. Sending SMS fallback...");

        try {
          await smsService.sendSMS(data.phone, lowStockMessage);
        } catch (smsError) {
          console.log("SMS fallback also failed:", smsError.message);
        }
      }

      break;

    /* =====================================================
       EXPIRY ALERT
    ===================================================== */

    case "EXPIRY_ALERT":
      const today = new Date();

      const medicines = await ProductMenu.find({
        businessId: data.businessId,
        expiryDate: { $exists: true },
      });

      if (!medicines.length) {
        console.log("No medicines found");
        return;
      }

      let expiryList = "";

      for (const item of medicines) {
        const expiry = new Date(item.expiryDate);

        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        // if (diffDays === 30 || diffDays === 15 || diffDays === 7)
        if (diffDays <= 30 && diffDays > 0) {
          expiryList += `${item.itemName} - expires in ${diffDays} days\n`;
        }
      }

      if (!expiryList) {
        console.log("No expiry alerts today");
        return;
      }

      const expiryTemplate = await getTemplate("EXPIRY_ALERT", "medical");

      if (!expiryTemplate) {
        console.log("Expiry template not found");
        return;
      }

      const expiryMessage = fillTemplate(expiryTemplate.message, {
        items: expiryList,
      });

      try {
        await whatsappService.sendMessage(data.phone, expiryMessage);
        console.log("Expiry alert sent");
      } catch (error) {
        console.log("WhatsApp failed. Sending SMS fallback...");

        try {
          await smsService.sendSMS(data.phone, expiryMessage);
        } catch (smsError) {
          console.log("SMS fallback also failed:", smsError.message);
        }
      }

      break;
  }
};
