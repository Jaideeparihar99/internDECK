const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
    },
    type: {
      type: String,
      enum: ['IT', 'Core', 'Government', 'Startup', 'PSU'],
      required: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    description: String,
    stipend: Number,
    minCgpa: {
      type: Number,
      default: 0,
    },
    requiredSkills: [String],
    eligibleBranches: [String],
    placementPotential: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    lastDateToApply: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
