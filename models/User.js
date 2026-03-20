const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: {
    type: String,
    enum: ['student', 'mentor', 'placement_cell', 'recruiter'],
    required: true
  },

  // Student-specific fields
  rollNumber: { type: String },
  branch: { type: String },
  cgpa: { type: Number, min: 0, max: 10 },
  skills: [{ type: String }],
  resumeUrl: { type: String },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employabilityScore: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    teamwork: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 }
  },

  // Recruiter-specific fields
  company: { type: String },
  designation: { type: String },

  // Placement cell specific
  department: { type: String },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
