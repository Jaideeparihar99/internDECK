const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  feedbackId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeedbackLog', required: true },

  verificationCode: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(8).toString('hex').toUpperCase()
  },

  pdfUrl: { type: String },
  issuedAt: { type: Date, default: Date.now },

  internshipPeriod: {
    from: { type: Date },
    to: { type: Date }
  },

  role: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
