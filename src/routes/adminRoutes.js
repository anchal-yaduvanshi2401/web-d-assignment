const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(ensureAuth, ensureAdmin);

// Admin Dashboard
router.get('/dashboard', adminController.getDashboard);

// Manage Drives (CRUD)
router.get('/drives', adminController.getDrives);
router.get('/drives/new', adminController.getCreateDrive);
router.post('/drives/new', adminController.postCreateDrive);
router.get('/drives/:id/edit', adminController.getEditDrive);
router.post('/drives/:id/edit', adminController.postEditDrive);
router.post('/drives/:id/delete', adminController.deleteDrive);

// Manage Applications & Status Updates
router.get('/applications', adminController.getApplications);
router.post('/applications/:id/status', adminController.updateApplicationStatus);

// Registered Students Directory
router.get('/students', adminController.getStudents);

module.exports = router;
