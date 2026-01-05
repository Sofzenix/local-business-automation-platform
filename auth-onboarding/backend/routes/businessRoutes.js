const express = require("express");
const router = express.Router();
const { createBusiness } = require("../controllers/businessController");
const { authGuard } = require("../middleware/auth");

router.post("/create", authGuard, createBusiness);

module.exports = router;
