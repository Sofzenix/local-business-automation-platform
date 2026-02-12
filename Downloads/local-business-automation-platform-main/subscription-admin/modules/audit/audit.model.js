import mongoose from "mongoose";
import { AUDIT_ENTITY } from "./audit.constants.js";

const auditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: Object.values(AUDIT_ENTITY),
      required: true
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    action: {
      type: String,
      required: true
    },

    metadata: {
      type: Object,
      default: {}
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);