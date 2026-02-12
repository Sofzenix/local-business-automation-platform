const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

module.exports = app;
