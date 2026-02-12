import AuditLog from "./audit.model.js";

/**
 * Records an audit event.
 * This function must NEVER throw or block main flow.
 */
export async function logAudit({
  entityType,
  entityId,
  action,
  metadata = {},
  performedBy = null
}) {
  try {
    await AuditLog.create({
      entityType,
      entityId,
      action,
      metadata,
      performedBy
    });
  } catch (error) {
    // Intentionally non-blocking
    console.error("Audit log failed:", error.message);
  }
}