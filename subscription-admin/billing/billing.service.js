import Billing from "./billing.model.js";
import { isValidObjectId } from "../subscription/subscription.utils.js";
import { logAudit } from "../audit/audit.service.js";
import { activateSubscription } from "../admin/admin.service.js";

export async function generateInvoice({
  businessId,
  subscriptionId,
  planType,
  amount,
  dueDate,
  paymentMode
}) {
  const existingPendingInvoice =
    await Billing.findOne({
      businessId,
      status: "PENDING"
    });
    if(existingPendingInvoice){
  existingPendingInvoice.status = "CANCELLED";
  await existingPendingInvoice.save();
    }

  const invoiceNumber = `INV-${Date.now()}`;

  return Billing.create({
    businessId,
    subscriptionId,
    invoiceNumber,
    amount,
    dueDate,
    status: "PENDING",
    paymentMode,
    planType
  });
}

export async function markInvoiceAsPaid(invoiceId, adminId) {

  if (!isValidObjectId(invoiceId)) {
    return { success: false, message: "Invalid invoiceId" };
  }

  const invoice = await Billing.findById(invoiceId);

  if (!invoice) {
    return { success: false, message: "Invoice not found" };
  }

  if (invoice.status !== "PENDING") {
    return {
      success: false,
      message: "Invoice cannot be marked as paid."
    }
  }



  const activationResult = await activateSubscription({
    businessId: invoice.businessId,
    planType: invoice.planType,
    paymentMode: invoice.paymentMode,
    adminId
  });

  if (!activationResult.success) {
    return {
      success: false,
      message: activationResult.message
    };
  }

  invoice.status = "PAID";
  invoice.paidAt = new Date();
  await invoice.save();

  // audit
  await logAudit({
    entityType: "BILLING",
    entityId: invoice._id,
    action: "INVOICE_PAID",
    performedBy: adminId
  });



  return { success: true, message: "Invoice successfully marked as paid." };
}