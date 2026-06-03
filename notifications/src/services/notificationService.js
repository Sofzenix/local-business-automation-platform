import Template from "../models/MessageTemplate.js";
import Notification from "../models/Notification.js";
import MessageLog from "../models/MessageLog.js";
import { sendMessage } from "./whatsappService.js";
import { parseTemplate } from "../utils/templateParser.js";
import { retrySend } from "../utils/retryHandler.js";

export async function sendNotification(eventType, data) {
  const template = await Template.findOne({
    eventType,
    businessType: data.businessType,
    channel: "whatsapp",
  });
  if (!template) return;

  const message = parseTemplate(template.message, data);

  const notification = await Notification.create({
    businessId: data.businessId,
    eventType,
    recipientPhone: data.phone,
    templateId: template.templateId,
    channel: "whatsapp",
  });

  try {
    const response = await sendMessage(data.phone, message);

    notification.status = "sent";
    await notification.save();

    await MessageLog.create({
      notificationId: notification._id,
      providerResponse: JSON.stringify(response),
      status: "sent",
    });
  } catch (err) {
    const success = await retrySend(data.phone, message);

    notification.status = success ? "sent" : "failed";
    await notification.save();
  }
}
