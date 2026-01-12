const express = require("express");
const router = express.Router();
const { createBusiness, getBusinessByUser } = require("../controllers/businessController");
const { authGuard } = require("../middleware/auth");

router.post("/create", authGuard, createBusiness);
router.get("/my-business", authGuard, getBusinessByUser);

module.exports = router;
