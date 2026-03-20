const express = require('express');
const Interview = require('../models/Interview');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// POST /api/interviews — placement_cell schedules
router.post('/', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const interview = await Interview.create({ ...req.body, scheduledBy: req.user._id });
    res.status(201).json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/interviews/mine — student sees their interviews
router.get('/mine', auth, authorize('student'), async (req, res) => {
  try {
    const interviews = await Interview.find({ studentId: req.user._id })
      .populate('companyId', 'name role')
      .sort({ scheduledAt: 1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/interviews — placement_cell sees all
router.get('/', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.scheduledAt = { $gte: start, $lte: end };
    }

    const interviews = await Interview.find(filter)
      .populate('studentId', 'name email branch')
      .populate('companyId', 'name role')
      .sort({ scheduledAt: 1 });
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/interviews/:id/outcome — update result
router.patch('/:id/outcome', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const { outcome, feedback } = req.body;
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { outcome, feedback },
      { new: true }
    );
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
