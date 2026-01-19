const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const medicalRoutes = require("./routes/medicalRoutes");
require("./cron/expiryCron");
require("./cron/dailySalesCron");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/medical", medicalRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Medical Store Server Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
