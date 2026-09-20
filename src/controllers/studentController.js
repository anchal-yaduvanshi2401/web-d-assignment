const User = require('../models/User');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const { checkEligibility } = require('../utils/eligibility');

// GET /student/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    if (!student) {
      req.flash('error', 'Student profile not found.');
      return res.redirect('/auth/login');
    }

    // Fetch all open drives
    const openDrives = await Drive.find({ status: 'Open' }).sort({ createdAt: -1 });

    // Calculate eligible drives
    const eligibleDrivesCount = openDrives.filter(
      (drive) => checkEligibility(student, drive).canApply
    ).length;

    // Fetch student's applications
    const applications = await Application.find({ student: student._id })
      .populate('drive')
      .sort({ appliedAt: -1 });

    const totalApplied = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
    const selectedCount = applications.filter((a) => a.status === 'Selected').length;

    // Recent 5 drives
    const recentDrives = openDrives.slice(0, 5).map((drive) => {
      const eligibility = checkEligibility(student, drive);
      const hasApplied = applications.some(
        (app) => app.drive && app.drive._id.toString() === drive._id.toString()
      );
      return {
        ...drive.toObject(),
        eligibility,
        hasApplied,
      };
    });

    res.render('student/dashboard', {
      pageTitle: 'Student Dashboard - Placement System',
      student,
      stats: {
        totalOpenDrives: openDrives.length,
        eligibleDrivesCount,
        totalApplied,
        shortlistedCount,
        selectedCount,
      },
      recentDrives,
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    req.flash('error', 'Unable to load dashboard.');
    res.redirect('/');
  }
};

// GET /student/profile
exports.getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    res.render('student/profile', {
      pageTitle: 'My Profile - Placement System',
      student,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    req.flash('error', 'Unable to load profile.');
    res.redirect('/student/dashboard');
  }
};

// POST /student/profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      branch,
      cgpa,
      skills,
      resumeLink,
      phone,
      graduationYear,
    } = req.body;

    const parsedCGPA = parseFloat(cgpa);
    if (isNaN(parsedCGPA) || parsedCGPA < 0 || parsedCGPA > 10) {
      req.flash('error', 'CGPA must be a valid number between 0.0 and 10.0');
      return res.redirect('/student/profile');
    }

    const skillsArray = skills
      ? skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const student = await User.findById(req.session.user.id);
    if (!student) {
      req.flash('error', 'Student not found.');
      return res.redirect('/auth/login');
    }

    student.name = name ? name.trim() : student.name;
    student.rollNumber = rollNumber ? rollNumber.trim().toUpperCase() : student.rollNumber;
    student.branch = branch || student.branch;
    student.cgpa = parsedCGPA;
    student.skills = skillsArray;
    student.resumeLink = resumeLink ? resumeLink.trim() : '';
    student.phone = phone ? phone.trim() : '';
    student.graduationYear = parseInt(graduationYear, 10) || student.graduationYear;

    await student.save();

    // Update session name if changed
    req.session.user.name = student.name;

    req.flash('success', 'Profile updated successfully.');
    res.redirect('/student/profile');
  } catch (error) {
    console.error('Profile update error:', error);
    req.flash('error', 'Failed to update profile: ' + error.message);
    res.redirect('/student/profile');
  }
};

// GET /student/drives
exports.getDrives = async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    const { type, search, eligibilityFilter } = req.query;

    const query = { status: 'Open' };
    if (type && ['Full-time Placement', 'Internship'].includes(type)) {
      query.jobType = type;
    }
    if (search) {
      query.$or = [
        { companyName: { $regex: search.trim(), $options: 'i' } },
        { roleTitle: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const drives = await Drive.find(query).sort({ deadline: 1 });

    // Fetch student's existing applications
    const studentApps = await Application.find({ student: student._id });
    const appliedMap = new Map();
    studentApps.forEach((app) => {
      appliedMap.set(app.drive.toString(), app.status);
    });

    let decoratedDrives = drives.map((drive) => {
      const eligibility = checkEligibility(student, drive);
      const hasApplied = appliedMap.has(drive._id.toString());
      const applicationStatus = appliedMap.get(drive._id.toString()) || null;
      return {
        ...drive.toObject(),
        eligibility,
        hasApplied,
        applicationStatus,
      };
    });

    // Optional filter for eligible only
    if (eligibilityFilter === 'eligible') {
      decoratedDrives = decoratedDrives.filter((d) => d.eligibility.canApply);
    } else if (eligibilityFilter === 'ineligible') {
      decoratedDrives = decoratedDrives.filter((d) => !d.eligibility.canApply);
    }

    res.render('student/drives', {
      pageTitle: 'Placement & Internship Drives',
      student,
      drives: decoratedDrives,
      currentFilter: {
        type: type || '',
        search: search || '',
        eligibilityFilter: eligibilityFilter || '',
      },
    });
  } catch (error) {
    console.error('Get drives error:', error);
    req.flash('error', 'Unable to fetch drives.');
    res.redirect('/student/dashboard');
  }
};

// GET /student/drives/:id
exports.getDriveDetail = async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      req.flash('error', 'Drive not found or has been removed.');
      return res.redirect('/student/drives');
    }

    const eligibility = checkEligibility(student, drive);
    const application = await Application.findOne({
      student: student._id,
      drive: drive._id,
    });

    res.render('student/drive-detail', {
      pageTitle: `${drive.companyName} - ${drive.roleTitle}`,
      student,
      drive,
      eligibility,
      application,
    });
  } catch (error) {
    console.error('Drive detail error:', error);
    req.flash('error', 'Drive not found.');
    res.redirect('/student/drives');
  }
};

// POST /student/drives/:id/apply
exports.applyDrive = async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      req.flash('error', 'Drive does not exist.');
      return res.redirect('/student/drives');
    }

    // 1. Check duplicate application
    const existingApp = await Application.findOne({
      student: student._id,
      drive: drive._id,
    });
    if (existingApp) {
      req.flash('warning', 'You have already submitted an application for this drive.');
      return res.redirect('/student/applications');
    }

    // 2. Enforce Eligibility rules
    const eligibility = checkEligibility(student, drive);
    if (!eligibility.canApply) {
      const reason = eligibility.reasons.join(' ') || 'You do not meet the criteria for this drive.';
      req.flash('error', `Cannot apply: ${reason}`);
      return res.redirect(`/student/drives/${drive._id}`);
    }

    // 3. Create application
    const newApplication = new Application({
      student: student._id,
      drive: drive._id,
      status: 'Applied',
      appliedAt: new Date(),
    });

    await newApplication.save();

    req.flash(
      'success',
      `Application successfully submitted for ${drive.companyName} (${drive.roleTitle})!`
    );
    res.redirect('/student/applications');
  } catch (error) {
    console.error('Apply drive error:', error);
    if (error.code === 11000) {
      req.flash('warning', 'You have already applied to this drive.');
      return res.redirect('/student/applications');
    }
    req.flash('error', 'Failed to submit application: ' + error.message);
    res.redirect(`/student/drives/${req.params.id}`);
  }
};

// GET /student/applications
exports.getApplications = async (req, res) => {
  try {
    const student = await User.findById(req.session.user.id);
    const applications = await Application.find({ student: student._id })
      .populate('drive')
      .sort({ appliedAt: -1 });

    res.render('student/applications', {
      pageTitle: 'My Applications - Placement System',
      student,
      applications,
    });
  } catch (error) {
    console.error('Get applications error:', error);
    req.flash('error', 'Unable to retrieve your applications.');
    res.redirect('/student/dashboard');
  }
};
