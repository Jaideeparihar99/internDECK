const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },

  status: {
    type: String,
    enum: ['pending_mentor', 'approved', 'rejected', 'shortlisted', 'offered', 'withdrawn'],
    default: 'pending_mentor'
  },

  mentorApproval: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    remarks: { type: String }
  },

  coverLetter: { type: String },
  resumeUrl: { type: String },

  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
