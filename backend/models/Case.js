const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'SAR Generated', 'Closed'],
    default: 'Open'
  },
  entitiesInvolved: [{
    name: String,
    role: String,
    accountNumber: String
  }],
  transactions: [{
    date: { type: Date },
    amount: { type: Number },
    transactionType: { type: String },
    description: { type: String }
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
