const express = require('express');
const Company = require('../models/Company');
const User = require('../models/User');
const { protect, allowRoles } = require('../middleware/auth');
const { getRecommendations } = require('../utils/recommend');

const router = express.Router();

// Get all open verified companies
router.get('/', protect, async (req, res) => {
  try {
    const companies = await Company.find({ isOpen: true, isVerified: true }).populate(
      'postedBy',
      'name email'
    );

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recommended companies for student
router.get('/recommended', protect, allowRoles('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const companies = await Company.find({ isOpen: true, isVerified: true });

    const recommendations = getRecommendations(student, companies);

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create company (placement cell only)
router.post('/', protect, allowRoles('placement_cell'), async (req, res) => {
  try {
    const {
      name,
      type,
      roleName,
      description,
      stipend,
      minCgpa,
      requiredSkills,
      eligibleBranches,
      placementPotential,
      lastDateToApply,
    } = req.body;

    const company = await Company.create({
      name,
      type,
      roleName,
      description,
      stipend,
      minCgpa,
      requiredSkills,
      eligibleBranches,
      placementPotential,
      lastDateToApply,
      postedBy: req.user.id,
      isVerified: true,
    });

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get placement stats (placement cell only)
router.get('/stats', protect, allowRoles('placement_cell'), async (req, res) => {
  try {
    const User = require('../models/User');
    const Application = require('../models/Application');

    const totalStudents = await User.countDocuments({ role: 'student' });

    const placedStudents = await Application.distinct('studentId', { status: 'offer' });
    const placedCount = placedStudents.length;
    const unplacedCount = totalStudents - placedCount;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        placedCount,
        unplacedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
