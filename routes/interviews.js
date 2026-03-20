const express = require('express');
const Interview = require('../models/Interview');
const { protect, allowRoles } = require('../middleware/auth');

const router = express.Router();

// Create/schedule interview
router.post('/', protect, allowRoles('mentor', 'placement_cell'), async (req, res) => {
  try {
    const { applicationId, scheduledAt, mode, location, duration } = req.body;

    const interview = await Interview.create({
      applicationId,
      scheduledAt,
      mode,
      location,
      duration,
    });

    await interview.populate('applicationId');

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get interviews
router.get('/', protect, async (req, res) => {
  try {
    const interviews = await Interview.find().populate('applicationId');

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
