const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: ['Case', 'SAR', 'User'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: {
    type: Object // can store diffs or additional context
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
