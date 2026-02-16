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

# Module Name:notifications

## 👤 Owner
Name:Lakshit

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
