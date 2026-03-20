const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${req.user._id}-${unique}${path.extname(file.originalname)}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'));
  }
});

// GET /api/students/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('mentorId', 'name email');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/students/me
router.put('/me', auth, async (req, res) => {
  try {
    const allowed = ['name', 'branch', 'cgpa', 'skills', 'rollNumber', 'mentorId'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students/upload-resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const resumeUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { resumeUrl });
    res.json({ resumeUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students — placement_cell / recruiter / mentor
router.get('/', auth, authorize('placement_cell', 'recruiter', 'mentor'), async (req, res) => {
  try {
    const { branch, minCgpa, skills, page = 1, limit = 20 } = req.query;
    const filter = { role: 'student' };
    if (branch) filter.branch = branch;
    if (minCgpa) filter.cgpa = { $gte: parseFloat(minCgpa) };
    if (skills) {
      const skillArr = skills.split(',').map(s => s.trim());
      filter.skills = { $all: skillArr };
    }

    const students = await User.find(filter)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('mentorId', 'name email');

    const total = await User.countDocuments(filter);
    res.json({ students, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/mentored — mentor sees their students
router.get('/mentored', auth, authorize('mentor'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student', mentorId: req.user._id }).select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
