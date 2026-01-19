import Billing from "./billing.model.js";
import { markInvoiceAsPaid } from "./billing.service.js";

export async function listInvoices(req, res) {
  try {
    const invoices = await Billing.find()
      .populate("businessId", "name")
      .populate("subscriptionId", "planType status");

    return res.status(200).json({
      success: true,
      data: invoices
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list invoices"
    });
  }
}

export async function markInvoicePaid(req, res) {
  try {
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        code: "INVALID_INPUT",
        message: "invoiceId is required"
      });
    }

    const result = await markInvoiceAsPaid(
      invoiceId,
      req.user?.id
    );

    return res
      .status(result.success ? 200 : 400)
      .json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Error occurred while marking invoice paid"
    });
  }
}