/**
 * Assumption:
 * auth middleware has already set:
 * req.user = { id, role }
 */
export function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      code: "ADMIN_ONLY",
      message: "Admin access required"
    });
  }

  return next();
}