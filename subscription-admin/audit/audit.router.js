import {Router} from 'express'
import { isAdmin } from '../middlewares/isAdmin.middleware.js';
import { listAuditLogs } from './audit.controller.js';

const auditRouter = Router();

/**
 * GET /api/admin/audit
 *
 * Description:
 * Retrieves audit log entries with optional filtering.
 * Used by platform admins to review subscription and billing activity.
 *
 * Access:
 * - Admin only
 *
 * Query Parameters (optional):
 * - entityType {string}     Filter by entity type (e.g., SUBSCRIPTION, BILLING)
 * - entityId {string}       Filter by specific entity ObjectId
 * - from {string}           Start date (ISO format)
 * - to {string}             End date (ISO format)
 * - limit {number}          Number of records to return (default: 50)
 *
 * Sorting:
 * - Results are sorted by createdAt (descending)
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   data: AuditLog[]
 * }
 *
 * Notes:
 * - Maximum recommended limit should be enforced to prevent heavy queries.
 * - Dates must be valid ISO strings.
 */

auditRouter.get("/" , listAuditLogs);

export default auditRouter;