const Template = require("../models/MessageTemplate");
const Notification = require("../models/Notification");
const MessageLog = require("../models/MessageLog");
const whatsappService = require("./whatsappService");
const { parseTemplate } = require("../utils/templateParser");
const { retrySend } = require("../utils/retryHandler");

exports.sendNotification = async (eventType, data) => {
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
    const response = await whatsappService.sendMessage(data.phone, message);

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
};
