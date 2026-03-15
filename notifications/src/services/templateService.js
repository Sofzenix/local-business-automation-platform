const MessageTemplate = require("../models/MessageTemplate");

async function getTemplate(eventType, businessType = "all", channel = "whatsapp") {

  let template = await MessageTemplate.findOne({
    eventType,
    businessType,
    channel
  });

  if (!template) {
    template = await MessageTemplate.findOne({
      eventType,
      businessType: "all",
      channel
    });
  }

  return template;
}

function fillTemplate(message, data) {

  let finalMessage = message;

  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, "g");
    finalMessage = finalMessage.replace(regex, data[key]);
  });

  return finalMessage;
}

module.exports = {
  getTemplate,
  fillTemplate
};