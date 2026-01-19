// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import express from "express";
// const app = express();
// import tiffinHotelroutes from "./routes/tiffinHotelroutes.js";
// import orderroutes from "./routes/orderroutes.js";


// dotenv.config();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Connect DB
// connectDB();

// // Load cron jobs
// // import "./cron/menuReset.cron";
// // import "./cron/dailyOrderSummary.cron";

// app.get("/test", (req, res) => {
//   res.send("Server is working");
// });

// //Routes
// app.use("/tiffin-hotel",tiffinHotelroutes);
// app.use("/order-routes",orderroutes);


// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";

import tiffinHotelroutes from "./routes/tiffinHotelroutes.js";
import orderroutes from "./routes/orderroutes.js";

// Cron jobs (MUST be loaded)
import "./cron/menuResetcron.js";
import "./cron/dailyOrderSummarycron.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("🚀 Tiffin Hotel API running");
});

app.get("/test", (req, res) => {
  res.send("Server is working");
});

// Routes
app.use("/api/menu", tiffinHotelroutes);
app.use("/api/orders", orderroutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
