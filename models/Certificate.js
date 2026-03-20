const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedbackLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeedbackLog',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    certificateUrl: String,
    verificationCode: {
      type: String,
      default: () => Math.random().toString(36).substr(2, 8).toUpperCase(),
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Certificate', certificateSchema);
