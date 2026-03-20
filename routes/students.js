const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `resume_${req.user.id}_${Date.now()}.pdf`);
  },
});

const upload = multer({ storage });

// Get student profile
router.get('/me', protect, allowRoles('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).populate('mentorId', 'name email');

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update student profile
router.put('/me', protect, allowRoles('student'), async (req, res) => {
  try {
    const { branch, semester, cgpa, skills, coverLetter, profileUpdatedAt, profileSemester } =
      req.body;

    const updateData = {};

    if (branch) updateData.branch = branch;
    if (semester) updateData.semester = semester;
    if (cgpa) updateData.cgpa = cgpa;
    if (skills) updateData.skills = skills;
    if (coverLetter) updateData.coverLetter = coverLetter;
    if (profileUpdatedAt) updateData.profileUpdatedAt = profileUpdatedAt;
    if (profileSemester) updateData.profileSemester = profileSemester;

    const student = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload resume
router.post('/upload-resume', protect, allowRoles('student'), upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    const student = await User.findByIdAndUpdate(
      req.user.id,
      { resumeUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: student,
      resumeUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
