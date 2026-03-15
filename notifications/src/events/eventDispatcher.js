const medical = require("../business/medicalNotifications");
const tiffin = require("../business/tiffinNotifications");

exports.dispatch = async (event, data) => {

  try {

    let handler;

    switch (data.businessType) {

      case "medical":
        handler = medical;
        break;

      case "tiffin":
        handler = tiffin;
        break;

      default:
        console.log(`No handler found for business type: ${data.businessType}`);
        return;

    }

    if (!handler || typeof handler.handle !== "function") {
      console.log(`Handler not implemented for ${data.businessType}`);
      return;
    }

    console.log(`Dispatching event "${event}" for business type "${data.businessType}"`);

    return await handler.handle(event, data);

  } catch (error) {

    console.error(`Event dispatch failed for ${data.businessType}`, error.message);

  }

};