# Module Name:auth-onboarding

## 👤 Owner
Name:Vipul Kumar

## 🎯 Module Purpose
Briefly explain what this module does and which local business problem it solves.

## 🧩 Features
- Feature 1
- Feature 2
- Feature 3

## 🔧 Tech Stack
- Frontend:
- Backend:
- Database:
- APIs / Libraries:

## 🔄 Workflow / Logic
Step-by-step explanation of how your module works.

## 🔗 Integration Points
- Which modules interact with this one?
- APIs or data shared

## ▶️ How to Run This Module in VS Code

### 1️⃣ Prerequisites
- VS Code installed  
- Node.js / Python (mention required version)
- Git installed
_______________________________________________________________________________________________________________________________________________________________________________________________________________________
# Module Name:medical-store
## 👤 Owner
Name:M Sarayu

## 🎯 Module Purpose
Briefly explain what this module does and which local business problem it solves.

## 🧩 Features
- Feature 1
- Feature 2
- Feature 3

## 🔧 Tech Stack
- Frontend:
- Backend:
- Database:
- APIs / Libraries:

## 🔄 Workflow / Logic
Step-by-step explanation of how your module works.

## 🔗 Integration Points
- Which modules interact with this one?
- APIs or data shared

## ▶️ How to Run This Module in VS Code

### 1️⃣ Prerequisites
- VS Code installed  
- Node.js / Python (mention required version)
- Git installed
_______________________________________________________________________________________________________________________________________________________________________________________________________________________

# Module Name:tiffin-hotel

## 👤 Owner
Name:Shreya

## 🎯 Module Purpose
The Tiffin-Hotel Module is designed to help small tiffin centers and hotels manage their daily menu, handle customer orders efficiently, and automate routine tasks like menu reset and daily order summary.

This module solves common local business problems such as:

Manual menu management

Difficulty tracking daily orders

Lack of automation in order confirmation

No structured daily sales summary

It provides a backend system that manages menu items, customer orders, and daily automation using Node.js and MongoDB.

## Project structure
TIFFIN-HOTEL/
│
├── .vscode/                 # VS Code configuration files
│
├── config/                  # Configuration files (DB connection, etc.)
│
├── controllers/             # Business logic layer
│   ├── orderController.js
│   └── tiffinHotelController.js
│
├── cron/                    # Scheduled automation jobs
│   ├── dailyOrderSummarycron.js
│   └── menuResetcron.js
│
├── models/                  # MongoDB schemas (Mongoose models)
│   ├── Menumodel.js
│   ├── OrderItemmodel.js
│   └── Ordermodel.js
│
├── routes/                  # API route definitions
│
├── node_modules/            # Installed npm packages
│
├── .env                     # Environment variables
│
├── package.json             # Project dependencies & scripts
├── package-lock.json        # Dependency lock file
│
├── README.md                # Project documentation
│
└── server.js                # Main entry point of application

## 🧩 Features
1) Daily Menu Management

Add new menu
 items

Update price with one-click API

Toggle availability (Available / Not Available)

2) WhatsApp Order Integration

Customers can place orders via WhatsApp link

Order details are stored in MongoDB

Automatic confirmation message logic supported

3) Daily Order Tracking & Summary

View today’s orders only

Automatically reset menu availability at 5:00 AM

Generate daily order summary (Total Orders & Revenue)


## 🔧 Tech Stack
Frontend:

Not applicable (Backend module only)

APIs can be consumed by any frontend or tested via Postman

Backend:

Node.js

Express.js

Database:

MongoDB

Mongoose

APIs / Libraries:

Express.js (Routing & Server)

Mongoose (MongoDB ORM)

node-cron (Automation scheduling)

dotenv (Environment configuration)



## 🔄 Workflow / Logic
Step-by-Step Module Flow:

1) Server Initialization

Express server starts

MongoDB connection is established

2) Daily Auto Reset (5:00 AM)

node-cron runs scheduled job

All menu items are set to "Not Available"

3) Owner Updates Today’s Menu

Admin uses API to:

Add items

Update price

Toggle availability

4) Customer Orders via WhatsApp

Customer clicks WhatsApp order link

Order is saved in MongoDB database

5) Order Confirmation

Confirmation message is generated automatically

6) End of Day Summary

System calculates:

Total Orders

Total Revenue

Summary can be logged or displayed in dashboard

## 🔗 Integration Points
Modules That Interact With This Module:

Authentication Module (Admin access)

Dashboard Module (Sales overview)

Reporting Module (Revenue & analytics)

APIs or Data Shared:

Menu collection used by Order module

Orders collection shared with Reporting module

Admin routes protected by authentication middleware


## ▶️ How to Run This Module in VS Code

### 1️⃣ Prerequisites

VS Code Installed

Node.js (v18 or above recommended)

MongoDB (Local or MongoDB Atlas)

Git Installed

### 2️⃣ Installation Steps
git clone <repository-url>
cd local-business-automation-platform
npm install

### 3️⃣ Configure Environment Variables

Create a .env file in root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string

### 4️⃣ Start the Server

node server.js

Server will run on:

http://localhost:5000
_______________________________________________________________________________________________________________________________________________________________________________________________________________________

# Module Name:notifications

## 👤 Owner
Name:Lakshit

## 🎯 Module Purpose
**WhatsApp & SMS notification service** for businesses (Medical, Tiffin) to send real-time alerts, order confirmations, stock alerts, and daily summaries. Receives incoming WhatsApp messages via webhook with automatic SMS fallback.

## 🧩 Features

- **Webhook Integration**: Receive & verify WhatsApp messages from Meta Cloud API
- **Multi-Channel**: WhatsApp (primary) + SMS via Twilio (fallback)
- **Business Handlers**: Medical (stock alerts, expiry alerts, summaries), Tiffin (stock alerts, menu, orders, summaries)
- **Scheduled Tasks**: Daily summary (23:30), low stock alerts (10:00 AM), expiry alerts(09:00 AM) (configurable)
- **Message Templates**: Stored in DB with Dynamic template variables ({{ordersCount}}, {{totalSales}}, etc.)
- **Retry Logic**: Auto-retry WhatsApp → SMS fallback on failure

## 🔧 Tech Stack
- **Backend**: Node.js + Express.js (v5.2.1) + node-cron (v4.2.1)
- **Database**: MongoDB (Mongoose v9.2.4)
- **APIs**: Meta Graph API v18.0 (WhatsApp), Twilio SDK (SMS)
- **Libraries**: Axios, Winston (logging), dotenv, body-parser
- **Models**: Business, User, Order, OrderItem, ProductMenu, MessageTemplate, MessageLog, Notification, Subscription, Inventory

## 🔄 Workflow / Logic
**1. Webhook Verification**: `GET /webhook/whatsapp` → Verify token → HTTP 200 + challenge or HTTP 403

**2. Incoming Message**: `POST /webhook/whatsapp` → Extract from `entry[0].changes[0].value.messages[0]` → Find Business by `metadata.display_phone_number` → Save MessageLog → Dispatch to business handler → HTTP 200

**3. Outgoing Notification**: Event triggered → Fetch MessageTemplate → Fill variables → Send WhatsApp → On failure: retry then SMS fallback → Save status to DB

**4. Scheduled Tasks**:

- **23:30 Daily**: All active businesses → Daily summary
- **10:00 AM Daily**: Medical businesses → Low stock alert
- **09:00 AM Daily**: Medical businesses → Expiry alerts

**5. Template Rendering**: `{{ordersCount}}`, `{{totalSales}}`, `{{itemsSummary}}` replaced with actual values via regex

## 🔗 Integration Points

**Modules That Interact With Notification Module**

**User Onboarding & Authentication Module**
Provides essential business details such as `businessId`, `businessType`, and `whatsappNumber`, which are used for accurate message routing and identification.

**Subscription & Billing Module**
Triggers important notifications including subscription reminders, expiry alerts, and account status updates to ensure uninterrupted service.

**External APIs**:

- `POST https://graph.facebook.com/v18.0/{PHONE_ID}/messages` → Send WhatsApp
- `POST https://api.twilio.com/.../Messages.json` → Send SMS
- `POST /webhook/whatsapp` → Receive incoming messages from Meta

**Database Relations**: User (1:many) Business (1:many) Order, ProductMenu, Inventory, Notification, MessageLog | MessageTemplate (1:many) Notification | Order (1:many) OrderItem

## ▶️ How to Run

### Prerequisites

- Node.js v16+ | MongoDB | Git | VS Code

### Quick Setup

```bash
cd notificaitons
cp .env.example .env          # Edit with WhatsApp & Twilio tokens
npm install
mongod                        # Start MongoDB (or use Atlas)
npm run seed:templates        # Optional: populate templates
npm run dev                   # Start server 
```

### Environment Variables (.env)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/your_db

WHATSAPP_TOKEN=your_token 
WHATSAPP_PHONE_ID=your_id 
VERIFY_TOKEN=your_token

TWILIO_ACCOUNT_SID=xxx 
TWILIO_AUTH_TOKEN=xxx 
TWILIO_PHONE_NUMBER=+1234567890
```
_______________________________________________________________________________________________________________________________________________________________________________________________________________________

# Module Name:subscription-admin

## 👤 Owner
Name:Harshit

## 🎯 Module Purpose
## 🎯 Module Purpose

The subscription-admin module manages the complete subscription lifecycle
for businesses onboarded on the platform.

It is responsible for:

- Free trial initialization
- Paid plan upgrades (invoice generation)
- Payment confirmation handling
- Automatic subscription activation
- Automated expiry and grace-period suspension
- Admin-level subscription control (activate, extend, suspend, reactivate)
- Audit logging of critical subscription and billing events
- Exposing access-control middleware for feature enforcement

### Business Problem Solved

This module ensures that only businesses with valid subscriptions
can access paid platform features.

It prevents:
- Unauthorized feature usage
- Access beyond subscription validity
- Manual subscription mismanagement
- Untracked billing operations



## 🧩 Features
- Free trial activation
- Paid plan upgrade (invoice generation)
- Automatic subscription activation on payment
- Access control middleware (read / write restrictions)
- Admin subscription controls (Activate, Extend, Suspend, Reactivate)
- Automated expiry & grace handling (cron jobs)
- Expiry reminder logs
- Audit trail logging
- Subscription & billing summary reports

## 🔧 Tech Stack
- Frontend: Not applicable
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- APIs / Libraries: node-cron, dotenv

## 🔄 Workflow / Logic

### 1️⃣ Trial Flow
- Business calls `POST /api/subscription/start-trial`
- Subscription document created with:
  - status = TRIAL
  - startDate
  - endDate = startDate + TRIAL_DAYS
  - graceEndsOn = endDate + GRACE_DAYS
- Business gains read/write access.

### 2️⃣ Upgrade Flow
- Business calls `POST /api/subscription/upgrade`
- Existing pending invoice checked
- New invoice generated (status: PENDING)
- Subscription NOT activated yet.

### 3️⃣ Payment Confirmation
- Admin calls `POST /api/admin/invoice/:invoiceId/pay`
- Invoice marked PAID
- Subscription activated:
  - status = ACTIVE
  - startDate updated
  - endDate recalculated
- Audit log recorded.

---

## 4️⃣ Access Control

The module exposes a reusable middleware:

checkSubscription("read" | "write")

This middleware is meant to be used by other feature modules to enforce subscription-based access.

Access behavior:

- TRIAL → Read and Write allowed  
- ACTIVE → Read and Write allowed  
- READ_ONLY → Only Read allowed (Write blocked)  
- SUSPENDED → All access blocked  

Example usage in another module:

router.post(
  "/create-order",
  checkSubscription("write"),
  createOrderController
);

Note:
The subscription-admin module does not enforce this middleware on its own routes.  
It exposes the middleware so that other modules can apply access control where needed.

---

## 6️⃣ Admin Capabilities

Admin APIs allow full control over subscription lifecycle.

Admin can:

- Activate subscription manually  
- Extend subscription duration  
- Suspend subscription  
- Reactivate subscription  
- Mark invoice as paid  
- View subscription summary  
- View billing summary  
- View audit logs  

All important admin actions are recorded in the AuditLog collection.

---

## 🔗 Integration Points

The subscription-admin module interacts with the following modules:

### 1. Auth Module

- Provides `req.user` via authentication middleware
- Required for admin route protection (`isAdmin`)
- Supplies `businessId` linked to authenticated user
- Enables role-based access control for admin endpoints

---

### 2. Feature Modules (medical-store, tiffin-hotel, etc.)

- Consume the exported middleware:
  
  checkSubscription("read" | "write")

- Depend on subscription status to allow or block:
  - Create
  - Update
  - Delete operations

- Read subscription status using:
  
  GET /api/subscription/status/:businessId

---

### 3. Billing (Internal to This Module)

- Generates invoices during upgrade:
  
  POST /api/subscription/upgrade

- Confirms payment via:

  POST /api/admin/billing/:invoiceId/pay

- Payment confirmation automatically triggers:
  - Subscription activation
  - Audit log creation

---

### 4. Audit Module

- Records critical actions such as:
  - Subscription activation
  - Suspension
  - Extension
  - Invoice payment

- Audit logs are accessible via:

  GET /api/admin/audit

- Supports filtering by:
  - entityType
  - entityId
  - date range

---

### 5. Dashboard / Reports Module

Consumes reporting APIs:

- GET /api/admin/reports/subscriptions
- GET /api/admin/reports/billing

Uses aggregated data for:
- Subscription status metrics
- Revenue tracking
- Invoice statistics

---

### 6. Notifications Module (If Enabled)

- Can consume expiry reminder events
- Can notify users about:
  - Subscription expiry
  - Grace period
  - Payment reminders

(Currently reminder logs are generated internally via cron jobs.)

## ▶️ How to Run This Module in VS Code

### 1️⃣ Prerequisites

- VS Code installed  
- Node.js v18+  
- MongoDB running locally or cloud  
- Git installed  

### 2️⃣ Install Dependencies
npm install
### 3️⃣ Configure Environment Variables

Create a .env file in project root:
PORT=3000  
MONGO_URI=mongodb://localhost:27017/local-business  
TRIAL_DAYS=7  
GRACE_DAYS=3  
MONTHLY_PERIOD=30  
YEARLY_PERIOD=365  
INVOICE_DUE_DAYS=3  

### 4️⃣ Start Server

npm run dev (development mode)
or
node server.js
_______________________________________________________________________________________________________________________________________________________________________________________________________________________

# Module Name:dashboard-reports

## 👤 Owner
Name:Dshruv

## 🎯 Module Purpose
Briefly explain what this module does and which local business problem it solves.

## 🧩 Features
- Feature 1
- Feature 2
- Feature 3

## 🔧 Tech Stack
- Frontend:
- Backend:
- Database:
- APIs / Libraries:

## 🔄 Workflow / Logic
Step-by-step explanation of how your module works.

## 🔗 Integration Points
- Which modules interact with this one?
- APIs or data shared

## ▶️ How to Run This Module in VS Code

### 1️⃣ Prerequisites
- VS Code installed  
- Node.js / Python (mention required version)
- Git installed
_______________________________________________________________________________________________________________________________________________________________________________________________________________________
﻿# Local Business Automation Platform
