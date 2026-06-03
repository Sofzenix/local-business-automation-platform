import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import MessageTemplate from "../models/MessageTemplate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const templates = [

/* MEDICAL STORE */

{
 templateId: "MEDICAL_LOW_STOCK",
 businessType: "medical",
 eventType: "LOW_STOCK",
 message: `
⚠ Low Stock Alert

Item: 
{{items}}

Please restock soon.
`,
 variables: ["items"],
 channel: "whatsapp"
},

{
 templateId: "MEDICAL_EXPIRY_ALERT",
 businessType: "medical",
 eventType: "EXPIRY_ALERT",
 message: `
⚠ Medicine Expiry Alert

Medicine: 
{{items}}

Please check your inventory.
`,
 variables: ["items"],
 channel: "whatsapp"
},

{
 templateId: "MEDICAL_DAILY_SUMMARY",
 businessType: "medical",
 eventType: "DAILY_SUMMARY",
 message: `
📊 Daily Sales Summary

Total Sales: ₹{{totalSales}}
Orders Today: {{ordersCount}}

Have a great day!
`,
 variables: ["totalSales","ordersCount"],
 channel: "whatsapp"
},

/*HOTEL / TIFFIN */

{
 templateId: "HOTEL_ORDER_CONFIRMATION_CUSTOMER",
 businessType: "tiffin",
 eventType: "ORDER_CONFIRMATION_CUSTOMER",
 message: `
✅ Order Confirmed

Hello {{customerName}}

Your order from {{shopName}} has been received.

Items: {{items}}
Total: ₹{{amount}}

Thank you!
`,
 variables: ["customerName","shopName","items","amount"],
 channel: "whatsapp"
},

{
 templateId: "HOTEL_NEW_ORDER_OWNER",
 businessType: "tiffin",
 eventType: "NEW_ORDER_OWNER",
 message: `
🛎 New Order Received

Customer: {{customerName}}

Items:
{{items}}

Total: ₹{{amount}}
`,
 variables: ["customerName","items","amount"],
 channel: "whatsapp"
},

{
 templateId: "HOTEL_DAILY_SUMMARY",
 businessType: "hotel",
 eventType: "DAILY_SUMMARY",
 message: `
📊 Daily Order Summary

Total Orders: {{ordersCount}}
Total Sales: ₹{{totalSales}}

Items Sold:
 {{itemsSummary}}
`,
 variables: ["ordersCount","totalSales","itemsSummary"],
 channel: "whatsapp"
},

{
 templateId: "HOTEL_WELCOME_MESSAGE",
 businessType: "tiffin",
 eventType: "WELCOME_MESSAGE",
 message: `
Welcome to our food ordering service! 🍽️

Today's Menu:
{{menu}}

Example order:
2 idli
1 dosa
`,
 variables: ["menu"],
 channel: "whatsapp"
},
{
 templateId: "TIFFIN_ORDER_CORRECTION",
 businessType: "tiffin",
 eventType: "order_correction",
 message: `
Sorry, I couldn't detect an order.

🍽️ Today's Menu:
{{menu}}

Example order:
2 idli
1 dosa
`,
 variables: ["menu"],
 channel: "whatsapp"
},

/* KIRANA STORE */

{
 templateId: "KIRANA_LOW_STOCK",
 businessType: "kirana",
 eventType: "LOW_STOCK",
 message: `
⚠ Low Stock Alert

Product: {{itemName}}
Remaining: {{stockQty}}

Please refill your stock.
`,
 variables: ["itemName","stockQty"],
 channel: "whatsapp"
},

{
 templateId: "KIRANA_ORDER_CONFIRMATION",
 businessType: "kirana",
 eventType: "ORDER_CONFIRMATION_CUSTOMER",
 message: `
✅ Order Confirmed

Hello {{customerName}}

Your order from {{shopName}} has been received.

Items: {{items}}
Total: ₹{{amount}}
`,
 variables: ["customerName","shopName","items","amount"],
 channel: "whatsapp"
},

{
 templateId: "KIRANA_DAILY_SUMMARY",
 businessType: "kirana",
 eventType: "DAILY_SUMMARY",
 message: `
📊 Daily Sales Summary

Total Orders: {{ordersCount}}
Total Sales: ₹{{totalSales}}
`,
 variables: ["ordersCount","totalSales"],
 channel: "whatsapp"
},

/* PLATFORM */

{
 templateId: "SUBSCRIPTION_REMINDER",
 businessType: "all",
 eventType: "SUBSCRIPTION_REMINDER",
 message: `
⚠ Subscription Reminder

Your subscription will expire in {{daysLeft}} days.

Please renew to continue using the platform.
`,
 variables: ["daysLeft"],
 channel: "whatsapp"
},

{
 templateId: "TRIAL_STARTED",
 businessType: "all",
 eventType: "TRIAL_STARTED",
 message: `
🎉 Welcome to Sofzenix Business Platform

Your free trial has started.

Trial Ends: {{trialEndDate}}

Enjoy the service!
`,
 variables: ["trialEndDate"],
 channel: "whatsapp"
}

];

const seedTemplates = async () => {

 try {

  await connectDB();

  await MessageTemplate.deleteMany();

  await MessageTemplate.insertMany(templates);

  console.log("Message Templates Seeded Successfully");

  process.exit();

 } catch (error) {

  console.error(error);
  process.exit(1);

 }

};

seedTemplates();