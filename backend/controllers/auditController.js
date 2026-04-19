const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (req, res) => {
  const { entityId } = req.params;
  try {
    const logs = await AuditLog.find({ entityId })
      .populate('performedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};

module.exports = { getAuditLogs };
