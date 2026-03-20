const mongoose = require('mongoose');

const feedbackLogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    punctuality: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs improvement'],
    },
    technical: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs improvement'],
    },
    teamwork: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs improvement'],
    },
    communication: {
      type: String,
      enum: ['Excellent', 'Good', 'Needs improvement'],
    },
    remarks: String,
    isComplete: {
      type: Boolean,
      default: false,
    },
    submittedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Post-save middleware to auto-create Certificate when feedback is complete
feedbackLogSchema.post('save', async function (doc) {
  if (doc.isComplete) {
    const Certificate = mongoose.model('Certificate');
    const User = mongoose.model('User');
    
    // Check if certificate already exists
    const existingCert = await Certificate.findOne({ feedbackLogId: doc._id });
    if (!existingCert) {
      // Generate verification code
      const verificationCode = Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase();

      await Certificate.create({
        studentId: doc.studentId,
        feedbackLogId: doc._id,
        companyId: doc.companyId,
        verificationCode,
      });

      // Update student's employabilityScore in User model
      const scoreMappings = {
        Excellent: 90,
        Good: 70,
        'Needs improvement': 40,
      };

      const technicalScore = scoreMappings[doc.technical] || 0;
      const communicationScore = scoreMappings[doc.communication] || 0;
      const teamworkScore = scoreMappings[doc.teamwork] || 0;
      const domainScore = Math.round((technicalScore + communicationScore + teamworkScore) / 3);

      await User.findByIdAndUpdate(doc.studentId, {
        employabilityScore: {
          technical: technicalScore,
          communication: communicationScore,
          teamwork: teamworkScore,
          domain: domainScore,
        },
      });
    }
  }
});

module.exports = mongoose.model('FeedbackLog', feedbackLogSchema);
