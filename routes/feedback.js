const express = require('express');
const FeedbackLog = require('../models/FeedbackLog');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Company = require('../models/Company');
const { auth, authorize } = require('../middleware/auth');
const { generateCertificatePDF } = require('../utils/generateCert');

const router = express.Router();

// POST /api/feedback — mentor submits feedback
router.post('/', auth, authorize('mentor'), async (req, res) => {
  try {
    const { studentId, companyId, applicationId, ratings, remarks, isComplete, period } = req.body;

    const feedback = await FeedbackLog.create({
      studentId, companyId, applicationId,
      mentorId: req.user._id,
      ratings, remarks, isComplete: isComplete || false, period
    });

    // Auto-generate certificate if feedback is marked complete
    if (isComplete) {
      const student = await User.findById(studentId);
      const company = await Company.findById(companyId);

      // Update employability scores
      await User.findByIdAndUpdate(studentId, {
        'employabilityScore.technical': ratings.technical,
        'employabilityScore.communication': ratings.communication,
        'employabilityScore.teamwork': ratings.teamwork,
        'employabilityScore.problemSolving': ratings.problemSolving
      });

      // Create certificate record
      const cert = await Certificate.create({
        studentId,
        companyId,
        feedbackId: feedback._id,
        internshipPeriod: period,
        role: company?.role || 'Intern'
      });

      // Generate PDF
      const pdfPath = await generateCertificatePDF(cert, student, company);
      cert.pdfUrl = pdfPath;
      await cert.save();

      return res.status(201).json({ feedback, certificate: cert });
    }

    res.status(201).json({ feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feedback — returns feedback/certs based on role
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'student') {
      filter.studentId = req.user._id;
    } else if (req.user.role === 'mentor') {
      filter.mentorId = req.user._id;
    }

    const feedbacks = await FeedbackLog.find(filter)
      .populate('studentId', 'name email branch')
      .populate('companyId', 'name role')
      .populate('mentorId', 'name')
      .sort({ createdAt: -1 });

    // Attach certificates if student
    if (req.user.role === 'student') {
      const certificates = await Certificate.find({ studentId: req.user._id })
        .populate('companyId', 'name role');
      return res.json({ feedbacks, certificates });
    }

    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feedback/verify/:code — public cert verification
router.get('/verify/:code', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ verificationCode: req.params.code })
      .populate('studentId', 'name branch')
      .populate('companyId', 'name role');

    if (!cert) return res.status(404).json({ message: 'Certificate not found or invalid code' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
