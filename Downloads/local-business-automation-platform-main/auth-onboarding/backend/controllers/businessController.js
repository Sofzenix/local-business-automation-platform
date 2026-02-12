// controllers/businessController.js
const Business = require("../models/Business");
const { v4: uuidv4 } = require("uuid");

exports.createBusiness = async (req, res) => {
  try {
    const { businessName, businessType, location, whatsappNumber } = req.body;

    // Validation
    if (!businessName || !businessType || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Medical", "Hotel", "Tiffin"].includes(businessType)) {
      return res.status(400).json({ message: "Invalid business type" });
    }

    // Check if user already has a business
    const existingBusiness = await Business.findOne({ userId: req.user.userId });
    if (existingBusiness) {
      return res.status(400).json({ message: "Business already exists for this user" });
    }

    const business = await Business.create({
      businessId: "BIZ-" + uuidv4().slice(0, 6).toUpperCase(),
      userId: req.user.userId,
      businessName,
      businessType,
      location,
      whatsappNumber,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({ message: "Business created successfully", business });
  } catch (error) {
    console.error("Create Business Error:", error);
    res.status(500).json({ message: "Failed to create business", error: error.message });
  }
};

exports.getBusinessByUser = async (req, res) => {
  try {
    const business = await Business.findOne({ userId: req.user.userId });
    
    if (!business) {
      return res.status(404).json({ message: "No business found" });
    }

    res.json(business);
  } catch (error) {
    console.error("Get Business Error:", error);
    res.status(500).json({ message: "Failed to fetch business", error: error.message });
  }
};
