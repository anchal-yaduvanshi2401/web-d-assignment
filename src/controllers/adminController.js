const User = require('../models/User');
const Drive = require('../models/Drive');
const Application = require('../models/Application');

// GET /admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalDrives = await Drive.countDocuments();
    const openDrives = await Drive.countDocuments({ status: 'Open' });
    const closedDrives = await Drive.countDocuments({ status: 'Closed' });

    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalApplications = await Application.countDocuments();

    // Status breakdown
    const statusCounts = {
      Applied: await Application.countDocuments({ status: 'Applied' }),
      Shortlisted: await Application.countDocuments({ status: 'Shortlisted' }),
      Interviewed: await Application.countDocuments({ status: 'Interviewed' }),
      Selected: await Application.countDocuments({ status: 'Selected' }),
      Rejected: await Application.countDocuments({ status: 'Rejected' }),
    };

    // Recent drives with applicant count
    const drives = await Drive.find().sort({ createdAt: -1 }).limit(5);
    const drivesWithStats = await Promise.all(
      drives.map(async (drive) => {
        const applicantCount = await Application.countDocuments({ drive: drive._id });
        const selectedCount = await Application.countDocuments({
          drive: drive._id,
          status: 'Selected',
        });
        return {
          ...drive.toObject(),
          applicantCount,
          selectedCount,
        };
      })
    );

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('student', 'name email rollNumber branch cgpa')
      .populate('drive', 'companyName roleTitle jobType')
      .sort({ appliedAt: -1 })
      .limit(5);

    res.render('admin/dashboard', {
      pageTitle: 'Admin Dashboard - Placement Cell',
      stats: {
        totalDrives,
        openDrives,
        closedDrives,
        totalStudents,
        totalApplications,
        statusCounts,
      },
      recentDrives: drivesWithStats,
      recentApplications,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    req.flash('error', 'Unable to load admin dashboard.');
    res.redirect('/');
  }
};

// GET /admin/drives
exports.getDrives = async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });

    const drivesWithCount = await Promise.all(
      drives.map(async (drive) => {
        const applicantCount = await Application.countDocuments({ drive: drive._id });
        const selectedCount = await Application.countDocuments({
          drive: drive._id,
          status: 'Selected',
        });
        return {
          ...drive.toObject(),
          applicantCount,
          selectedCount,
        };
      })
    );

    res.render('admin/drives', {
      pageTitle: 'Manage Placement Drives',
      drives: drivesWithCount,
    });
  } catch (error) {
    console.error('Get drives error:', error);
    req.flash('error', 'Failed to retrieve drives.');
    res.redirect('/admin/dashboard');
  }
};

// GET /admin/drives/new
exports.getCreateDrive = (req, res) => {
  res.render('admin/drive-form', {
    pageTitle: 'Create New Placement Drive',
    drive: {},
    isEdit: false,
    branches: ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Other'],
  });
};

// POST /admin/drives/new
exports.postCreateDrive = async (req, res) => {
  try {
    const {
      companyName,
      roleTitle,
      jobType,
      description,
      packageOrStipend,
      minCGPA,
      eligibleBranches,
      location,
      deadline,
      driveDate,
      status,
    } = req.body;

    // Ensure eligibleBranches is an array
    let branches = [];
    if (Array.isArray(eligibleBranches)) {
      branches = eligibleBranches;
    } else if (eligibleBranches) {
      branches = [eligibleBranches];
    } else {
      branches = ['All'];
    }

    const drive = new Drive({
      companyName: companyName.trim(),
      roleTitle: roleTitle.trim(),
      jobType: jobType || 'Full-time Placement',
      description: description.trim(),
      packageOrStipend: packageOrStipend.trim(),
      minCGPA: parseFloat(minCGPA) || 6.0,
      eligibleBranches: branches,
      location: location ? location.trim() : 'On-Campus',
      deadline: new Date(deadline),
      driveDate: driveDate ? new Date(driveDate) : null,
      status: status || 'Open',
      createdBy: req.session.user.id,
    });

    await drive.save();

    req.flash('success', `Drive for ${drive.companyName} created successfully!`);
    res.redirect('/admin/drives');
  } catch (error) {
    console.error('Create drive error:', error);
    req.flash('error', 'Failed to create drive: ' + error.message);
    res.redirect('/admin/drives/new');
  }
};

// GET /admin/drives/:id/edit
exports.getEditDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      req.flash('error', 'Drive not found.');
      return res.redirect('/admin/drives');
    }

    res.render('admin/drive-form', {
      pageTitle: `Edit Drive - ${drive.companyName}`,
      drive,
      isEdit: true,
      branches: ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Other'],
    });
  } catch (error) {
    console.error('Edit drive fetch error:', error);
    req.flash('error', 'Unable to retrieve drive details.');
    res.redirect('/admin/drives');
  }
};

// POST /admin/drives/:id/edit
exports.postEditDrive = async (req, res) => {
  try {
    const {
      companyName,
      roleTitle,
      jobType,
      description,
      packageOrStipend,
      minCGPA,
      eligibleBranches,
      location,
      deadline,
      driveDate,
      status,
    } = req.body;

    let branches = [];
    if (Array.isArray(eligibleBranches)) {
      branches = eligibleBranches;
    } else if (eligibleBranches) {
      branches = [eligibleBranches];
    } else {
      branches = ['All'];
    }

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      req.flash('error', 'Drive not found.');
      return res.redirect('/admin/drives');
    }

    drive.companyName = companyName.trim();
    drive.roleTitle = roleTitle.trim();
    drive.jobType = jobType || drive.jobType;
    drive.description = description.trim();
    drive.packageOrStipend = packageOrStipend.trim();
    drive.minCGPA = parseFloat(minCGPA) || drive.minCGPA;
    drive.eligibleBranches = branches;
    drive.location = location ? location.trim() : drive.location;
    drive.deadline = new Date(deadline);
    drive.driveDate = driveDate ? new Date(driveDate) : null;
    drive.status = status || drive.status;

    await drive.save();

    req.flash('success', `Drive for ${drive.companyName} updated successfully.`);
    res.redirect('/admin/drives');
  } catch (error) {
    console.error('Update drive error:', error);
    req.flash('error', 'Failed to update drive: ' + error.message);
    res.redirect(`/admin/drives/${req.params.id}/edit`);
  }
};

// POST /admin/drives/:id/delete
exports.deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      req.flash('error', 'Drive not found.');
      return res.redirect('/admin/drives');
    }

    // Delete associated applications
    await Application.deleteMany({ drive: drive._id });
    await Drive.findByIdAndDelete(drive._id);

    req.flash('success', `Drive for ${drive.companyName} and all associated applications deleted.`);
    res.redirect('/admin/drives');
  } catch (error) {
    console.error('Delete drive error:', error);
    req.flash('error', 'Failed to delete drive.');
    res.redirect('/admin/drives');
  }
};

// GET /admin/applications
exports.getApplications = async (req, res) => {
  try {
    const { driveId, status, branch } = req.query;

    const query = {};
    if (driveId) {
      query.drive = driveId;
    }
    if (status && ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'].includes(status)) {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('student')
      .populate('drive')
      .sort({ appliedAt: -1 });

    // Filter by branch if requested
    if (branch && branch !== 'All') {
      applications = applications.filter(
        (app) => app.student && app.student.branch === branch
      );
    }

    const drives = await Drive.find().sort({ companyName: 1 });

    res.render('admin/applications', {
      pageTitle: 'Applicant Management - Placement Cell',
      applications,
      drives,
      selectedDriveId: driveId || '',
      selectedStatus: status || '',
      selectedBranch: branch || '',
      statuses: ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'],
    });
  } catch (error) {
    console.error('Get applications error:', error);
    req.flash('error', 'Failed to retrieve applications.');
    res.redirect('/admin/dashboard');
  }
};

// POST /admin/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const validStatuses = ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'];
    if (!validStatuses.includes(status)) {
      req.flash('error', 'Invalid status provided.');
      return res.redirect(req.get('Referrer') || '/admin/applications');
    }

    const application = await Application.findById(req.params.id)
      .populate('student', 'name')
      .populate('drive', 'companyName');

    if (!application) {
      req.flash('error', 'Application not found.');
      return res.redirect('/admin/applications');
    }

    application.status = status;
    if (adminNotes !== undefined) {
      application.adminNotes = adminNotes.trim();
    }
    application.updatedBy = req.session.user.id;

    await application.save();

    req.flash(
      'success',
      `Updated status for ${application.student ? application.student.name : 'Student'} (${application.drive ? application.drive.companyName : 'Drive'}) to ${status}.`
    );
    res.redirect(req.get('Referrer') || '/admin/applications');
  } catch (error) {
    console.error('Status update error:', error);
    req.flash('error', 'Failed to update application status.');
    res.redirect(req.get('Referrer') || '/admin/applications');
  }
};

// GET /admin/students
exports.getStudents = async (req, res) => {
  try {
    const { branch, minCGPA } = req.query;

    const query = { role: 'student' };
    if (branch && branch !== 'All') {
      query.branch = branch;
    }
    if (minCGPA) {
      query.cgpa = { $gte: parseFloat(minCGPA) || 0 };
    }

    const students = await User.find(query).sort({ cgpa: -1, name: 1 });

    // Fetch total applications & selections per student
    const studentStats = await Promise.all(
      students.map(async (student) => {
        const appliedCount = await Application.countDocuments({ student: student._id });
        const selectedCount = await Application.countDocuments({
          student: student._id,
          status: 'Selected',
        });
        return {
          ...student.toObject(),
          appliedCount,
          selectedCount,
        };
      })
    );

    res.render('admin/students', {
      pageTitle: 'Registered Students Directory',
      students: studentStats,
      selectedBranch: branch || '',
      selectedMinCGPA: minCGPA || '',
      branches: ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Other'],
    });
  } catch (error) {
    console.error('Get students error:', error);
    req.flash('error', 'Failed to retrieve student directory.');
    res.redirect('/admin/dashboard');
  }
};
