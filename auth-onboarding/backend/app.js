const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/business", require("./routes/businessRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

module.exports = app;
