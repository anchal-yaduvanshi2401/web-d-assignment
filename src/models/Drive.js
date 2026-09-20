const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    roleTitle: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time Placement', 'Internship'],
      default: 'Full-time Placement',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    packageOrStipend: {
      type: String,
      required: [true, 'Package or Stipend details are required'],
      trim: true,
      example: '12 LPA or ₹40,000/month',
    },
    minCGPA: {
      type: Number,
      required: [true, 'Minimum CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: 6.0,
    },
    eligibleBranches: {
      type: [String],
      enum: ['All', 'CSE', 'IT', 'ECE', 'EE', 'ME', 'Civil', 'Other'],
      default: ['All'],
    },
    location: {
      type: String,
      trim: true,
      default: 'On-Campus / Hybrid',
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    driveDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if deadline has passed
driveSchema.virtual('isDeadlinePassed').get(function () {
  return this.deadline && new Date() > this.deadline;
});

module.exports = mongoose.model('Drive', driveSchema);
