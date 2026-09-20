require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Drive = require('./src/models/Drive');
const Application = require('./src/models/Application');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_system';

async function seedData() {
  try {
    console.log(`Connecting to database: ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully for seeding.');

    // Clear existing collections
    await User.deleteMany({});
    await Drive.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing users, drives, and applications.');

    // 1. Create Placement Admin
    const admin = new User({
      name: 'Prof. Sharma (Placement Officer)',
      email: 'admin@placement.edu',
      password: 'AdminPassword123',
      role: 'admin',
    });
    await admin.save();
    console.log('✅ Admin user created: admin@placement.edu / AdminPassword123');

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
      resumeLink: 'https://github.com/example/rahul-resume.pdf',
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
      skills: ['Embedded Systems', 'IoT', 'Python', 'MATLAB', 'Digital Electronics'],
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
      skills: ['Java', 'Spring Boot', 'SQL', 'HTML/CSS', 'Git'],
      resumeLink: 'https://example.com/resumes/amit_patel.pdf',
      phone: '+91 9898989898',
      graduationYear: 2026,
    });
    await student3.save();

    const student4 = new User({
      name: 'Sneha Rao',
      email: 'sneha.rao@college.edu',
      password: 'Password123',
      role: 'student',
      rollNumber: 'ME2026012',
      branch: 'ME',
      cgpa: 8.2,
      skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Robotics', 'Python'],
      resumeLink: 'https://example.com/resumes/sneha_rao.pdf',
      phone: '+91 9777888999',
      graduationYear: 2026,
    });
    await student4.save();

    console.log('✅ Created 4 sample students across CSE, ECE, IT, ME.');

    // 3. Create Sample Placement and Internship Drives
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const inTwoWeeks = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const driveDate1 = new Date(Date.now() + 40 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

    const drives = await Drive.insertMany([
      {
        companyName: 'Google',
        roleTitle: 'Software Engineer (Early Career)',
        jobType: 'Full-time Placement',
        description:
          'Join Google Engineering to solve complex distributed systems problems and build scalable web services used by billions worldwide.',
        packageOrStipend: '24 LPA (Base + Bonus + Equity)',
        minCGPA: 8.0,
        eligibleBranches: ['CSE', 'IT'],
        location: 'Bengaluru / Hyderabad',
        deadline: nextMonth,
        driveDate: driveDate1,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Microsoft',
        roleTitle: 'Cloud Solutions Engineering Intern',
        jobType: 'Internship',
        description:
          '6-month internship with Azure Core Engineering team working on cloud infrastructure automation, microservices, and observability tools.',
        packageOrStipend: '₹75,000 / month',
        minCGPA: 7.5,
        eligibleBranches: ['CSE', 'IT', 'ECE'],
        location: 'Hyderabad / Remote',
        deadline: inTwoWeeks,
        driveDate: driveDate1,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Tata Consultancy Services (TCS)',
        roleTitle: 'Assistant System Engineer (Digital & Prime)',
        jobType: 'Full-time Placement',
        description:
          'Mass hiring campus drive for digital transformation roles across enterprise software, automation, cloud solutions, and testing.',
        packageOrStipend: '7.5 LPA - 9.0 LPA',
        minCGPA: 6.0,
        eligibleBranches: ['All'],
        location: 'Pan-India',
        deadline: nextMonth,
        driveDate: driveDate1,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Cisco Systems',
        roleTitle: 'Network Automation & Security Specialist',
        jobType: 'Full-time Placement',
        description:
          'Design and implement secure software-defined network architectures, IoT communication frameworks, and automation scripts.',
        packageOrStipend: '16.5 LPA',
        minCGPA: 7.0,
        eligibleBranches: ['CSE', 'ECE', 'EE'],
        location: 'Bengaluru',
        deadline: inTwoWeeks,
        driveDate: driveDate1,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Tata Motors',
        roleTitle: 'EV Powertrain Design Intern',
        jobType: 'Internship',
        description:
          'Work alongside automotive engineers to simulate battery management systems, thermal modeling, and structural chassis analysis for electric vehicles.',
        packageOrStipend: '₹40,000 / month',
        minCGPA: 7.0,
        eligibleBranches: ['ME', 'EE'],
        location: 'Pune',
        deadline: nextMonth,
        driveDate: driveDate1,
        status: 'Open',
        createdBy: admin._id,
      },
      {
        companyName: 'Amazon',
        roleTitle: 'Software Development Engineer - I',
        jobType: 'Full-time Placement',
        description:
          'Completed drive for Amazon Retail & Fulfillment systems. Drive concluded last month.',
        packageOrStipend: '28 LPA',
        minCGPA: 8.5,
        eligibleBranches: ['CSE', 'IT'],
        location: 'Bengaluru',
        deadline: pastDate,
        driveDate: pastDate,
        status: 'Closed',
        createdBy: admin._id,
      },
    ]);
    console.log(`✅ Created ${drives.length} placement and internship drives.`);

    // 4. Create Sample Applications to showcase the lifecycle
    const googleDrive = drives[0];
    const msftDrive = drives[1];
    const tcsDrive = drives[2];
    const ciscoDrive = drives[3];

    await Application.insertMany([
      {
        student: student1._id,
        drive: googleDrive._id,
        status: 'Shortlisted',
        appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        adminNotes: 'Cleared Online Assessment. Technical interview scheduled for Friday.',
        updatedBy: admin._id,
      },
      {
        student: student1._id,
        drive: msftDrive._id,
        status: 'Interviewed',
        appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        adminNotes: 'Round 1 completed with positive feedback. Awaiting final round slot.',
        updatedBy: admin._id,
      },
      {
        student: student2._id,
        drive: ciscoDrive._id,
        status: 'Applied',
        appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        adminNotes: 'Application verified by placement officer.',
        updatedBy: admin._id,
      },
      {
        student: student3._id,
        drive: tcsDrive._id,
        status: 'Selected',
        appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        adminNotes: 'Congratulations! Official Offer Letter released for Digital profile.',
        updatedBy: admin._id,
      },
    ]);
    console.log('✅ Created sample applications with varied statuses.');

    console.log('\n=========================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('=========================================');
    console.log('Admin Login:');
    console.log('  Email:    admin@placement.edu');
    console.log('  Password: AdminPassword123');
    console.log('\nStudent Logins:');
    console.log('  Email:    rahul.verma@college.edu (CSE, 8.8 CGPA)');
    console.log('  Email:    priya.nair@college.edu  (ECE, 7.4 CGPA)');
    console.log('  Email:    amit.patel@college.edu  (IT, 6.8 CGPA)');
    console.log('  Email:    sneha.rao@college.edu   (ME, 8.2 CGPA)');
    console.log('  Password: Password123 (for all students)');
    console.log('=========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
}

seedData();
