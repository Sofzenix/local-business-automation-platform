import Billing from "./billing.model.js";
import { isValidObjectId } from "../subscription/subscription.utils.js";
import { activateOrExtendSubscription } from "../subscription/subscription.service.js";
import { logAudit } from "../audit/audit.service.js";

export async function generateInvoice({
  businessId,
  subscriptionId,
  planType,
  amount,
  dueDate,
  paymentMode
}) {
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

  if (invoice.status === "PAID") {
    return { success: false, message: "Invoice already paid" };
  }

  invoice.status = "PAID";
  invoice.paidAt = new Date();
  await invoice.save();

  // activate / extend subscription
  await activateOrExtendSubscription(invoice.subscriptionId);

  // audit
  await logAudit({
    entityType: "BILLING",
    entityId: invoice._id,
    action: "INVOICE_PAID",
    performedBy: adminId
  });

  return { success: true };
}