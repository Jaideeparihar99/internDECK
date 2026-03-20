const express = require('express');
const Application = require('../models/Application');
const Company = require('../models/Company');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

// Apply to company
router.post('/:companyId', protect, allowRoles('student'), async (req, res) => {
  try {
    // Check for duplicate application
    const existingApplication = await Application.findOne({
      studentId: req.user.id,
      companyId: req.params.companyId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ success: false, message: 'You have already applied to this company' });
    }

    const application = await Application.create({
      studentId: req.user.id,
      companyId: req.params.companyId,
      status: 'mentor_pending',
    });

    await application.populate('companyId', 'name roleName');

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get student's applications
router.get('/mine', protect, allowRoles('student'), async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('companyId', 'name roleName stipend')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending mentor approvals
router.get('/pending-mentor', protect, allowRoles('mentor'), async (req, res) => {
  try {
    const applications = await Application.find({ status: 'mentor_pending' })
      .populate('studentId', 'name email cgpa branch')
      .populate('companyId', 'name roleName stipend')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mentor approval/rejection
router.patch('/:id/mentor', protect, allowRoles('mentor'), async (req, res) => {
  try {
    const { mentorApproved, mentorNote, status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        mentorApproved,
        mentorNote,
        mentorId: req.user.id,
        status: status || 'mentor_pending',
      },
      { new: true }
    )
      .populate('studentId', 'name email')
      .populate('companyId', 'name roleName');

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
