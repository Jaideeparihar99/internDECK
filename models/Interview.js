const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    scheduledAt: Date,
    mode: {
      type: String,
      enum: ['virtual', 'on_campus', 'at_company'],
    },
    location: String,
    duration: Number,
    outcome: {
      type: String,
      enum: ['pending', 'selected', 'rejected', 'waitlisted'],
      default: 'pending',
    },
    interviewerNotes: String,
    hasConflict: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
