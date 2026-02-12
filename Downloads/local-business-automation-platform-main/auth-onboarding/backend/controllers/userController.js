// controllers/userController.js
const User = require("../models/User");

exports.updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;

    if (!["te", "en"].includes(language)) {
      return res.status(400).json({ message: "Invalid language" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { language },
      { new: true }
    );

    res.json({ message: "Language updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating language", error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-__v");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};
