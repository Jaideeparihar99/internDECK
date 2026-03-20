const express = require('express');
const Application = require('../models/Application');
const Company = require('../models/Company');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/applications/:companyId — student applies
router.post('/:companyId', auth, authorize('student'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company || !company.isOpen) {
      return res.status(400).json({ message: 'Company not found or not accepting applications' });
    }

    const existing = await Application.findOne({
      studentId: req.user._id,
      companyId: req.params.companyId
    });
    if (existing) return res.status(400).json({ message: 'Already applied to this company' });

    const application = await Application.create({
      studentId: req.user._id,
      companyId: req.params.companyId,
      coverLetter: req.body.coverLetter,
      resumeUrl: req.user.resumeUrl
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/mine — student
router.get('/mine', auth, authorize('student'), async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate('companyId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/pending-mentor — mentor sees pending approvals
router.get('/pending-mentor', auth, authorize('mentor'), async (req, res) => {
  try {
    const User = require('../models/User');
    const myStudents = await User.find({ mentorId: req.user._id, role: 'student' }).select('_id');
    const ids = myStudents.map(s => s._id);

    const applications = await Application.find({
      studentId: { $in: ids },
      'mentorApproval.status': 'pending'
    })
      .populate('studentId', 'name email branch cgpa')
      .populate('companyId', 'name role stipend');

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/applications/:id/mentor — mentor approves/rejects
router.patch('/:id/mentor', auth, authorize('mentor'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        'mentorApproval.status': status,
        'mentorApproval.approvedBy': req.user._id,
        'mentorApproval.approvedAt': new Date(),
        'mentorApproval.remarks': remarks,
        status: status === 'approved' ? 'approved' : 'rejected'
      },
      { new: true }
    ).populate('studentId', 'name email').populate('companyId', 'name role');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/all — placement_cell
router.get('/all', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate('studentId', 'name email branch')
      .populate('companyId', 'name role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);
    res.json({ applications, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/applications/:id/status — placement_cell updates status
router.patch('/:id/status', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
