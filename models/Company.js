const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  industry: { type: String },
  website: { type: String },
  logoUrl: { type: String },

  // Job details
  role: { type: String, required: true },
  stipend: { type: Number },
  duration: { type: String },
  location: { type: String },
  mode: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'onsite' },

  // Eligibility
  requiredSkills: [{ type: String }],
  minCgpa: { type: Number, default: 0 },
  eligibleBranches: [{ type: String }],

  // Meta
  openings: { type: Number, default: 1 },
  applicationDeadline: { type: Date },
  isOpen: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  placementType: { type: String, enum: ['internship', 'fulltime', 'both'], default: 'internship' }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
