import mongoose from "mongoose";

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

    providerMessageId: {
      type: String,
      index: true,
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

export default mongoose.model("MessageLog", MessageLogSchema);
