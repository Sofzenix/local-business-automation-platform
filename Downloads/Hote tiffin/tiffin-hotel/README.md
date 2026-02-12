Module Name: tiffin-hotel
👤 Owner

Name: Shreya Gagare

# Module Purpose

The Tiffin-Hotel Module is designed to help small tiffin centers and hotels manage their daily menu, handle customer orders efficiently, and automate routine tasks like menu reset and daily order summary.

This module solves common local business problems such as:

Manual menu management

Difficulty tracking daily orders

Lack of automation in order confirmation

No structured daily sales summary

It provides a backend system that manages menu items, customer orders, and daily automation using Node.js and MongoDB.

# Project structure
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


# Features
1) Daily Menu Management

Add new menu items

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

🔧 Tech Stack

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

# Workflow / Logic
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

# Integration Points
Modules That Interact With This Module:

Authentication Module (Admin access)

Dashboard Module (Sales overview)

Reporting Module (Revenue & analytics)

APIs or Data Shared:

Menu collection used by Order module

Orders collection shared with Reporting module

Admin routes protected by authentication middleware

 How to Run This Module in VS Code
1) Prerequisites

VS Code Installed

Node.js (v18 or above recommended)

MongoDB (Local or MongoDB Atlas)

Git Installed

2) Installation Steps
git clone <repository-url>
cd local-business-automation-platform
npm install

3) Configure Environment Variables

Create a .env file in root directory:

PORT=5000
MONGO_URI=your_mongodb_connection_string

4) Start the Server
npm start

OR

node server.js

Server will run on:

http://localhost:4000
