require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const connectDB = require("./config/db");

const webhookRoutes = require("./routes/webhookRoutes");



require("./cron/expiryAlertCron");
require("./cron/lowStockCron");
require("./cron/dailySummaryCron");

const app = express();

connectDB();

app.use(bodyParser.json());

app.use("/webhook", webhookRoutes);

app.get("/", (req,res)=>{
  res.send("Messaging Service Running");
});

app.listen(process.env.PORT,()=>{
  console.log(`Server running on port ${process.env.PORT}`);
});