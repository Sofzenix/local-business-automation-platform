const mongoose = require("mongoose");

const MessageLogSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      default: "incoming",
    },

    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },

    providerResponse: {
      type: String,
    },

    status: {
      type: String,
      enum: ["received", "sent", "delivered", "failed"],
      default: "received",
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt automatically
  },
);

module.exports = mongoose.model("MessageLog", MessageLogSchema);
