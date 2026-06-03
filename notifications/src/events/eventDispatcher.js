import * as medical from "../business/medicalNotifications.js";
import * as tiffin from "../business/tiffinNotifications.js";

async function dispatch(event, data) {

  try {
    console.log("Dispatch payload:", {
      event,
      businessType: data?.businessType,
      businessId: data?.businessId,
      phone: data?.phone,
    });

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

    const result = await handler.handle(event, data);
    console.log(`Event "${event}" handled successfully for "${data.businessType}"`);
    return result;

  } catch (error) {

    console.error(`Event dispatch failed for ${data.businessType}`, error.message);

  }

}

export default { dispatch };