const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { ensureAuth, ensureStudent } = require('../middleware/auth');

// Protect all student routes
router.use(ensureAuth, ensureStudent);

// Student Dashboard
router.get('/dashboard', studentController.getDashboard);

// Student Profile
router.get('/profile', studentController.getProfile);
router.post('/profile', studentController.updateProfile);

// Placement / Internship Drives
router.get('/drives', studentController.getDrives);
router.get('/drives/:id', studentController.getDriveDetail);
router.post('/drives/:id/apply', studentController.applyDrive);

// Student Applications Tracking
router.get('/applications', studentController.getApplications);

module.exports = router;
