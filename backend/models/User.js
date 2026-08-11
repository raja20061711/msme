const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'MSME_OWNER'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
