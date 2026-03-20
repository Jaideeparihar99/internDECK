const express = require('express');
const FeedbackLog = require('../models/FeedbackLog');
const Certificate = require('../models/Certificate');
const { protect, allowRoles } = require('../middleware/auth');
const { generateCertificate } = require('../utils/generateCert');

const router = express.Router();

// Submit feedback
router.post('/', protect, allowRoles('mentor'), async (req, res) => {
  try {
    const {
      studentId,
      companyId,
      score,
      punctuality,
      technical,
      teamwork,
      communication,
      remarks,
      isComplete,
    } = req.body;

    const feedbackLog = await FeedbackLog.create({
      studentId,
      mentorId: req.user.id,
      companyId,
      score,
      punctuality,
      technical,
      teamwork,
      communication,
      remarks,
      isComplete,
      submittedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: feedbackLog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get feedback logs
router.get('/', protect, async (req, res) => {
  try {
    const feedbackLogs = await FeedbackLog.find()
      .populate('studentId', 'name email')
      .populate('mentorId', 'name')
      .populate('companyId', 'name');

    res.status(200).json({
      success: true,
      data: feedbackLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
