const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'mentor_pending', 'mentor_approved', 'shortlisted', 'interview', 'offer', 'rejected'],
      default: 'applied',
    },
    mentorApproved: {
      type: Boolean,
      default: false,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mentorNote: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index to prevent duplicate applications
applicationSchema.index({ studentId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
