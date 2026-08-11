const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({
  key: String,
  name: String,
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  reason: String,
  scoreContribution: Number
}, { _id: false });

const scanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['EMAIL', 'URL', 'INVOICE', 'PAYMENT', 'QR']
  },
  target: {
    type: String,
    required: true
  },
  extractedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  indicators: [indicatorSchema],
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['SAFE', 'MEDIUM', 'HIGH']
  },
  explanation: {
    type: String,
    default: ''
  },
  recommendation: {
    type: String,
    default: ''
  },
  disclaimer: {
    type: String,
    default: 'AI-powered prototype analysis. Does not perform real bank transaction verification or official GST database lookups.'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scan', scanSchema);
