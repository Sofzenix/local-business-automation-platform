const express = require("express");
const router = express.Router();

const { addMedicine,addSale,getInventory } = require("../controllers/medicalController");

router.post("/add-medicine", addMedicine);
router.post("/sale",addSale);
router.get("/inventory", getInventory);
module.exports = router;
