const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },

  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 60 }, // in minutes
  mode: { type: String, enum: ['online', 'offline', 'phone'], default: 'online' },
  location: { type: String },
  meetingLink: { type: String },

  round: { type: Number, default: 1 },
  type: { type: String, enum: ['technical', 'hr', 'group_discussion', 'aptitude'], default: 'technical' },

  outcome: {
    type: String,
    enum: ['pending', 'cleared', 'rejected', 'no_show'],
    default: 'pending'
  },
  feedback: { type: String },

  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
