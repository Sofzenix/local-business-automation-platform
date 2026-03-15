const whatsappService = require("../services/whatsappService");
const smsService = require("../services/smsService");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const ProductMenu = require("../models/ProductMenu");
const Business = require("../models/Business");
const MessageTemplate = require("../models/MessageTemplate");

const { parseOrder } = require("../utils/orderParser");

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
   GENERATE MENU TEXT
--------------------------------*/

// async function generateMenuText() {
//   const menuItems = await ProductMenu.find({ isAvailable: true });

//   let menuText = "";

//   menuItems.forEach((item) => {
//     menuText += `${item.itemName} - ₹${item.price}\n`;
//   });

//   return menuText;
// }

async function generateMenuText(businessId) {
  const menuItems = await ProductMenu.find({
    businessId: businessId,
    isAvailable: true,
  });

  let menuText = "";
  console.log("Fetching menu for businessId:", businessId);
  menuItems.forEach((item) => {
    menuText += `${item.itemName} - ₹${item.price}\n`;
  });

  return menuText;
}

/* -------------------------------
   CONVERSATION TRACKING
--------------------------------*/

const conversationTracker = new Map();

function isNewConversation(phone) {
  const now = Date.now();
  const lastTime = conversationTracker.get(phone);

  if (!lastTime) {
    conversationTracker.set(phone, now);
    return true;
  }

  const diff = now - lastTime;

  // 10 minutes = 600000 ms
  if (diff > 600000) {
    conversationTracker.set(phone, now);
    return true;
  }

  conversationTracker.set(phone, now);
  return false;
}

/* -------------------------------
   HANDLE EVENTS
--------------------------------*/

exports.handle = async (event, data) => {
  switch (event) {
    /* -------------------------------
       INCOMING MESSAGE
    --------------------------------*/

    case "INCOMING_MESSAGE":
      const { phone, text, businessId, ownerPhone } = data;

      const business = await Business.findById(businessId);

      /* -------------------------------
      CHECK NEW CONVERSATION
      --------------------------------*/

      const newConversation = isNewConversation(phone);

      if (newConversation) {
        console.log("New conversation detected");

        const welcomeTemplate = await getTemplate(
          "welcome_message",
          business.businessType,
        );

        if (welcomeTemplate) {
          const menuText = await generateMenuText(business.businessId);

          const messageText = fillTemplate(welcomeTemplate.message, {
            menu: menuText,
          });

          try {
            await whatsappService.sendMessage(phone, messageText);
            console.log("Welcome message sent");
          } catch (error) {
            console.log("Welcome message failed:", error.message);
          }
        }
      }

      if (!business) {
        console.log("Business not found");
        return;
      }
      // const businessCode = business.businessId;

      console.log("Parsing order:", text);
      const orderItems = await parseOrder(text);

      /* -------------------------------
         ORDER DETECTED
      --------------------------------*/

      console.log("Order detected:", orderItems);

      if (orderItems) {
        let totalAmount = 0;
        let customerSummary = "";
        let ownerSummary = "";

        const orderItemsToInsert = [];

        for (const item of orderItems) {
          const menuItem = await ProductMenu.findOne({
            businessId: business.businessId,
            itemName: { $regex: `^${item.name.trim()}$`, $options: "i" },
          });
          if (!menuItem) {
            console.log(`Menu item not found for: ${item.name}`);
            continue;
          }
          console.log(`Menu item matched: ${menuItem.itemName}`);

          const itemTotal = menuItem.price * item.quantity;

          totalAmount += itemTotal;

          customerSummary += `${item.quantity} ${menuItem.itemName}\n`;
          ownerSummary += `${item.quantity} ${menuItem.itemName}\n`;

          orderItemsToInsert.push({
            itemId: menuItem._id,
            quantity: item.quantity,
            price: menuItem.price,
          });
        }

        /* CREATE ORDER */

        function generateOrderId() {
          return "ORD" + Date.now();
        }

        const order = await Order.create({
          orderId: generateOrderId(),
          businessId: business.businessId,
          orderSource: "WhatsApp",
          totalAmount: totalAmount,
          status: "pending",
        });

        /* CREATE ORDER ITEMS */

        function generateOrderItemId() {
          return "ITEM" + Date.now() + Math.floor(Math.random() * 1000);
        }

        for (const item of orderItemsToInsert) {
          await OrderItem.create({
            orderItemId: generateOrderItemId(),
            orderId: order.orderId,
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
          });
        }

        /* SEND CONFIRMATION TO CUSTOMER */

        const customerTemplate = await getTemplate(
          "ORDER_CONFIRMATION_CUSTOMER",
          business.businessType,
        );

        if (customerTemplate) {
          const messageText = fillTemplate(customerTemplate.message, {
            customerName: phone,
            shopName: business.businessName,
            items: customerSummary,
            amount: totalAmount,
          });

          await whatsappService.sendMessage(phone, messageText);
        }

        /* SEND ORDER TO OWNER */

        const ownerTemplate = await getTemplate(
          "NEW_ORDER_OWNER",
          business.businessType,
        );

        let ownerMessage = "";

        if (ownerTemplate) {
          ownerMessage = fillTemplate(ownerTemplate.message, {
            customerName: phone,
            items: ownerSummary,
            amount: totalAmount,
          });
        }

        const cleanOwnerPhone = ownerPhone.replace(/\D/g, "");

        try {
          await whatsappService.sendMessage(cleanOwnerPhone, ownerMessage);
          console.log("Owner WhatsApp message sent");
        } catch (error) {
          console.log("WhatsApp failed for owner. Sending SMS fallback...");

          try {
            await smsService.sendSMS(cleanOwnerPhone, ownerMessage);
            console.log("SMS sent to owner successfully");
          } catch (smsError) {
            console.log("SMS sending also failed:", smsError.message);
          }
        }
      } else {
        /* -------------------------------
         ORDER NOT DETECTED
      --------------------------------*/
        const menuText = await generateMenuText(business.businessId);

        const template = await getTemplate(
          "order_correction",
          business.businessType,
        );

        if (template) {
          const messageText = fillTemplate(template.message, {
            menu: menuText,
          });

          await whatsappService.sendMessage(phone, messageText);
        }
      }

      break;

    /* -------------------------------
       DAILY SUMMARY
    --------------------------------*/

    case "DAILY_SUMMARY":
      const { businessId: summaryBusinessId, phone: ownerNumber } = data;

      const summaryBusiness = await Business.findOne({
        businessId: summaryBusinessId,
      });

      if (!summaryBusiness) {
        console.log("Business not found for daily summary");
        return;
      }

      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      const businessCode = summaryBusiness.businessId;
      const orders = await Order.find({
        businessId: businessCode,
        createdAt: { $gte: start, $lte: end },
      });

      const ordersCount = orders.length;

      let totalSales = 0;
      orders.forEach((o) => (totalSales += o.totalAmount));

      const orderIds = orders.map((o) => o.orderId);

      const items = await OrderItem.find({
        orderId: { $in: orderIds },
      }).populate("itemId");

      const itemMap = {};

      items.forEach((i) => {
        const name = i.itemId.itemName;

        if (!itemMap[name]) itemMap[name] = 0;

        itemMap[name] += i.quantity;
      });

      let itemsSummary = "";

      for (const item in itemMap) {
        itemsSummary += `${item} - ${itemMap[item]}\n`;
      }

      const summaryTemplate = await getTemplate(
        "DAILY_SUMMARY",
        summaryBusiness.businessType,
      );

      if (!summaryTemplate) {
        console.log("Daily summary template not found");
        return;
      }

      const messageText = fillTemplate(summaryTemplate.message, {
        ordersCount,
        totalSales,
        itemsSummary,
      });

      const cleanOwnerPhone = ownerNumber.replace(/\D/g, "");

      try {
        await whatsappService.sendMessage(cleanOwnerPhone, messageText);
        console.log("Daily summary sent successfully");
      } catch (error) {
        console.log("WhatsApp summary failed. Sending SMS fallback...");

        try {
          await smsService.sendSMS(cleanOwnerPhone, messageText);
        } catch (smsError) {
          console.log("SMS summary also failed:", smsError.message);
        }
      }

      break;
  }
};
