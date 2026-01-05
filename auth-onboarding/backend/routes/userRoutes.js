const express = require("express");
const router = express.Router();
const { updateLanguage } = require("../controllers/userController");
const { authGuard } = require("../middleware/auth");

router.put("/language", authGuard, updateLanguage);

module.exports = router;
