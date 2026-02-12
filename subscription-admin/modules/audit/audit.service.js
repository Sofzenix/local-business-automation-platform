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
    console.log("Audit log created .. ")
  } catch (error) {
    // Intentionally non-blocking
    console.error("Audit log failed:", error.message);
  }
}


export async function getAuditLogs({
  entityType,
  entityId,
  from ,
  to,
  limit
}){
  
  const query = {}
  if(entityType) query.entityType = entityType;
  if (entityId && mongoose.Types.ObjectId.isValid(entityId)) {
  query.entityId = entityId;
}

  if(from || to ){
    query.createdAt = {}
    if(from && !isNaN(Date.parse(from))) query.createdAt.$gte = new Date(from);
    if(to && !isNaN(Date.parse(to))) query.createdAt.$lte = new Date(to); 
  }

  const safeLimit = Math.min(Number(limit) ||  50 , 100);
  return await AuditLog.find(query)
  .sort(({createdAt:-1}))
  .limit(Number(safeLimit));
  // .populate("performedBy" , "name email");
}