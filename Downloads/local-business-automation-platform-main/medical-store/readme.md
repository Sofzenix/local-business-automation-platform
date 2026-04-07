# 🏥 Medical Store Automation Module

This module is part of the **Local Business Automation Platform**.
It manages **medicine inventory, sales tracking, expiry alerts, and low stock notifications**, along with WhatsApp alerts using Twilio.

---

## 🚀 Features

* ➕ Add medicines to inventory
* 📦 Track stock levels
* 💸 Record sales (auto stock deduction)
* ⚠️ Low stock alerts (real-time)
* ⏰ Expiry alerts (7 / 15 / 30 days before expiry)
* 📲 WhatsApp notifications (Twilio)
* 🔄 Automated cron jobs

---

## 🧠 Assumptions

* `req.user` is set by the Auth module (used for `businessId`)
* Each medicine is unique per business
* Inventory is linked with ProductMenu
* WhatsApp number is verified in Twilio sandbox

---

## 🔗 Dependencies

* **Auth module** → provides `req.user.businessId`
* **Notification module** → consumes events (LOW_STOCK_ALERT, EXPIRY_ALERT)
* **MongoDB** → database
* **Twilio** → WhatsApp messaging
* **node-cron** → scheduling

---

## 📦 API Endpoints

### ➕ Add Medicine

POST /api/medical/add-medicine

Request Body:
{
"businessId": "string",
"itemName": "Crocin",
"price": 50,
"expiryDate": "2026-05-01",
"stockQty": 100,
"minThreshold": 20
}

---

### 💸 Record Sale

POST /api/medical/sale

Request Body:
{
"itemId": "string",
"quantity": 5
}

---

### 📋 Get Inventory

GET /api/medical/inventory

---

## 📊 Response Format (Standardized)

### ✅ Success

{
"success": true,
"message": "string",
"data": {}
}

### ❌ Failure

{
"success": false,
"code": "ERROR_CODE",
"message": "string"
}

---

## ⚡ Events (Integration Ready)

This module emits:

* LOW_STOCK_ALERT
* EXPIRY_ALERT

Currently implemented as:

console.log("EVENT: LOW_STOCK_ALERT", data)

Future integration:

dispatcher.dispatch(event, data)

---

## ⏰ Cron Jobs

### Expiry Alert Cron

* Runs periodically (testing: every 10 seconds)
* Triggers alerts for:

  * 30 days before expiry
  * 15 days before expiry
  * 7 days before expiry

---

## 📲 WhatsApp Integration

Uses **Twilio WhatsApp Sandbox**

### Required `.env` variables:

MONGO_URI=your_mongodb_uri
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_WHATSAPP_TO=whatsapp:+91XXXXXXXXXX

---

## 🛠️ Setup Instructions

1. Install dependencies
   npm install

2. Create `.env` file and add credentials

3. Start server
   node server.js

---

## 🧪 Testing Flow

1. Add a medicine
2. View inventory
3. Record a sale
4. Observe:

   * Stock deduction
   * Low stock alert
   * WhatsApp notification
5. Wait for cron:

   * Expiry alerts triggered

---

## 🔮 Future Improvements

* Integrate dispatcher-based event system
* Central notification system integration
* Dashboard analytics
* Role-based authentication

---

## 👩‍💻 Author

**Sarayu Mallepaga**
Medical Module Developer
