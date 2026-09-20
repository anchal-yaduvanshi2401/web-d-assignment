const User = require('../models/User');
const Drive = require('../models/Drive');
const Application = require('../models/Application');

/**
 * Auto-seeds basic demonstration data if database is empty.
 * This guarantees an instant out-of-the-box working demo when starting
 * the server, even if the user or examiner forgets to run `npm run seed`.
 */
async function autoSeed() {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      // Database already has an admin initialized
      return;
    }

    console.log('[AutoSeed] Initializing default demonstration data...');

    // 1. Create Placement Admin
    const admin = new User({
      name: 'Prof. Sharma (Placement Officer)',
      email: 'admin@placement.edu',
      password: 'AdminPassword123',
      role: 'admin',
    });
    await admin.save();

    // 2. Create Sample Students
    const student1 = new User({
      name: 'Rahul Verma',
      email: 'rahul.verma@college.edu',
      password: 'Password123',
      role: 'student',
      rollNumber: 'CS2026001',
      branch: 'CSE',
      cgpa: 8.8,
      skills: ['Node.js', 'Express', 'React', 'MongoDB', 'Data Structures', 'C++'],
      resumeLink: 'https://example.com/resumes/rahul_verma.pdf',
      phone: '+91 9876543210',
      graduationYear: 2026,
    });
    await student1.save();

    const student2 = new User({
      name: 'Priya Nair',
      email: 'priya.nair@college.edu',
      password: 'Password123',
      role: 'student',
      rollNumber: 'EC2026045',
      branch: 'ECE',
      cgpa: 7.4,
      skills: ['Embedded Systems', 'IoT', 'Python', 'MATLAB'],
      resumeLink: 'https://example.com/resumes/priya_nair.pdf',
      phone: '+91 9811223344',
      graduationYear: 2026,
    });
    await student2.save();

    const student3 = new User({
      name: 'Amit Patel',
      email: 'amit.patel@college.edu',
      password: 'Password123',
      role: 'student',
      rollNumber: 'IT2026089',
      branch: 'IT',
      cgpa: 6.8,
      skills: ['Java', 'Spring Boot', 'SQL', 'Git'],
      resumeLink: 'https://example.com/resumes/amit_patel.pdf',
      phone: '+91 9898989898',
      graduationYear: 2026,
    });
    await student3.save();

    // 3. Create Sample Placement & Internship Drives
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const driveDate = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000);

    const drives = await Drive.insertMany([
      {
        companyName: 'Google',
        roleTitle: 'Software Engineer (Early Career)',
        jobType: 'Full-time Placement',
        description: 'Join Google Engineering to build distributed, scalable web services and cloud systems used by billions worldwide.',
        packageOrStipend: '24 LPA (Base + Bonus + Equity)',
        minCGPA: 8.0,
        eligibleBranches: ['CSE', 'IT'],
        location: 'Bengaluru / Hyderabad',
        deadline: nextMonth,
        driveDate: driveDate,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Microsoft',
        roleTitle: 'Cloud Solutions Engineering Intern',
        jobType: 'Internship',
        description: '6-month summer internship with Azure Core Engineering team working on cloud automation and microservices.',
        packageOrStipend: '₹75,000 / month',
        minCGPA: 7.5,
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        location: 'Hyderabad / Hybrid',
        deadline: inTwoWeeks,
        driveDate: driveDate,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Tata Consultancy Services (TCS)',
        roleTitle: 'Assistant System Engineer (Digital)',
        jobType: 'Full-time Placement',
        description: 'Campus hiring drive for digital transformation roles across enterprise software, automation, and cloud platforms.',
        packageOrStipend: '7.5 LPA - 9.0 LPA',
        minCGPA: 6.0,
        eligibleBranches: ['All'],
        location: 'Pan-India',
        deadline: nextMonth,
        driveDate: driveDate,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Cisco Systems',
        roleTitle: 'Network Automation Specialist',
        jobType: 'Full-time Placement',
        description: 'Develop next-generation network automation frameworks, routing security modules, and IoT communication protocols.',
        packageOrStipend: '16.5 LPA',
        minCGPA: 7.0,
        eligibleBranches: ['CSE', 'ECE', 'EE'],
        location: 'Bengaluru',
        deadline: inTwoWeeks,
        driveDate: driveDate,
        status: 'Open',
        createdBy: admin._id,
      },
    ]);

    // 4. Create Sample Applications with varied statuses
    await Application.insertMany([
      {
        student: student1._id,
        drive: drives[0]._id, // Google
        status: 'Shortlisted',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        adminNotes: 'Cleared Online Assessment. Round 1 Technical Interview scheduled for Friday.',
        updatedBy: admin._id,
      },
      {
        student: student1._id,
        drive: drives[1]._id, // Microsoft
        status: 'Interviewed',
        appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        adminNotes: 'Completed interview round 1 with positive evaluation. Final discussion pending.',
        updatedBy: admin._id,
      },
      {
        student: student2._id,
        drive: drives[3]._id, // Cisco
        status: 'Applied',
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        adminNotes: 'Profile verified. Under review by technical screening team.',
        updatedBy: admin._id,
      },
      {
        student: student3._id,
        drive: drives[2]._id, // TCS
        status: 'Selected',
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        adminNotes: 'Congratulations! Official Offer Letter issued for Digital profile.',
        updatedBy: admin._id,
      },
    ]);

    console.log('[AutoSeed] ✅ Demo data successfully populated!');
    console.log('[AutoSeed] 🔑 Admin Login: admin@placement.edu / AdminPassword123');
    console.log('[AutoSeed] 🔑 Student Login: rahul.verma@college.edu / Password123');
  } catch (error) {
    console.error('[AutoSeed Error] Failed to initialize default data:', error.message);
  }
}

module.exports = autoSeed;
