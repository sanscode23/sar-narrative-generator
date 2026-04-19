const mongoose = require('mongoose');

const sarSchema = mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  narrative: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Final'],
    default: 'Draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SAR', sarSchema);
