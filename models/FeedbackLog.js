const mongoose = require('mongoose');

const feedbackLogSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },

  ratings: {
    technical: { type: Number, min: 1, max: 10, required: true },
    communication: { type: Number, min: 1, max: 10, required: true },
    teamwork: { type: Number, min: 1, max: 10, required: true },
    problemSolving: { type: Number, min: 1, max: 10, required: true }
  },

  remarks: { type: String },
  isComplete: { type: Boolean, default: false },

  period: {
    from: { type: Date },
    to: { type: Date }
  }
}, { timestamps: true });

module.exports = mongoose.model('FeedbackLog', feedbackLogSchema);
