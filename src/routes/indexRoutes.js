const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const User = require('../models/User');
const Application = require('../models/Application');

// GET / - Public landing page
router.get('/', async (req, res) => {
  try {
    const totalDrives = await Drive.countDocuments({ status: 'Open' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSelected = await Application.countDocuments({ status: 'Selected' });

    const featuredDrives = await Drive.find({ status: 'Open' })
      .sort({ createdAt: -1 })
      .limit(3);

    res.render('home', {
      pageTitle: 'Home - Campus Placement & Internship System',
      stats: {
        totalDrives,
        totalStudents,
        totalSelected,
      },
      featuredDrives,
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('home', {
      pageTitle: 'Home - Campus Placement & Internship System',
      stats: { totalDrives: 0, totalStudents: 0, totalSelected: 0 },
      featuredDrives: [],
    });
  }
});

module.exports = router;
