// controllers/businessController.js
const Business = require("../models/Business");
const { v4: uuidv4 } = require("uuid");

exports.createBusiness = async (req, res) => {
  const { businessName, businessType, location, whatsappNumber } = req.body;

  const business = await Business.create({
    businessId: "BIZ-" + uuidv4().slice(0, 6).toUpperCase(),
    userId: req.user.userId,
    businessName,
    businessType,
    location,
    whatsappNumber,
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.json(business);
};
