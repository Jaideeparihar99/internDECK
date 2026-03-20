const express = require('express');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { auth, authorize } = require('../middleware/auth');
const { getRecommendations } = require('../utils/recommend');

const router = express.Router();

// GET /api/companies
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find({ isOpen: true, isVerified: true })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/companies/recommended
router.get('/recommended', auth, authorize('student'), async (req, res) => {
  try {
    const companies = await Company.find({ isOpen: true, isVerified: true });
    const recommendations = getRecommendations(req.user, companies);
    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/companies/stats — placement_cell
router.get('/stats', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments({ isVerified: true });
    const openCompanies = await Company.countDocuments({ isOpen: true, isVerified: true });
    const totalApplications = await Application.countDocuments();
    const offered = await Application.countDocuments({ status: 'offered' });

    // Top companies by applications
    const topCompanies = await Application.aggregate([
      { $group: { _id: '$companyId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
      { $unwind: '$company' },
      { $project: { name: '$company.name', count: 1 } }
    ]);

    res.json({ totalCompanies, openCompanies, totalApplications, offered, topCompanies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/companies — placement_cell only
router.post('/', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, postedBy: req.user._id, isVerified: true });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/companies/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('postedBy', 'name');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/companies/:id — placement_cell only
router.put('/:id', auth, authorize('placement_cell'), async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
