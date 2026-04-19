const AuditLog = require('../models/AuditLog');

const logAudit = async (action, entityType, entityId, performedBy, details = {}) => {
  try {
    await AuditLog.create({
      action,
      entityType,
      entityId,
      performedBy,
      details
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

module.exports = { logAudit };
