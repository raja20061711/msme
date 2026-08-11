const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  scanId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  riskLevel: {
    type: String,
    enum: ['SAFE', 'MEDIUM', 'HIGH'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);
