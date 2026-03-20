const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'mentor', 'placement_cell', 'recruiter'],
      default: 'student',
    },
    studentId: String,
    branch: String,
    semester: Number,
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    skills: [String],
    resumeUrl: String,
    coverLetter: String,
    profileUpdatedAt: Date,
    profileSemester: Number,
    employabilityScore: {
      technical: {
        type: Number,
        default: 0,
      },
      communication: {
        type: Number,
        default: 0,
      },
      teamwork: {
        type: Number,
        default: 0,
      },
      domain: {
        type: Number,
        default: 0,
      },
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
