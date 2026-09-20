/**
 * Utility function to evaluate whether a student is eligible for a placement/internship drive.
 * 
 * In a college viva, you can explain this as the business rule engine that verifies:
 * 1. Minimum CGPA criterion (student.cgpa >= drive.minCGPA)
 * 2. Academic branch criterion (drive.eligibleBranches includes 'All' OR student's specific branch)
 * 3. Drive status (Must be 'Open')
 * 4. Deadline compliance (Current time must not exceed drive.deadline)
 */
function checkEligibility(student, drive) {
  const reasons = [];
  let isEligible = true;

  // 1. CGPA Check
  const studentCGPA = Number(student.cgpa) || 0;
  const requiredCGPA = Number(drive.minCGPA) || 0;
  if (studentCGPA < requiredCGPA) {
    isEligible = false;
    reasons.push(`Minimum CGPA required is ${requiredCGPA.toFixed(2)}, but your CGPA is ${studentCGPA.toFixed(2)}.`);
  }

  // 2. Branch Check
  const studentBranch = student.branch || 'Other';
  const eligibleBranches = Array.isArray(drive.eligibleBranches) ? drive.eligibleBranches : [];
  const isBranchAllowed = eligibleBranches.includes('All') || eligibleBranches.includes(studentBranch);

  if (!isBranchAllowed) {
    isEligible = false;
    reasons.push(`Branch '${studentBranch}' is not eligible. Allowed: ${eligibleBranches.join(', ')}.`);
  }

  // 3. Drive Status & Deadline Check
  const now = new Date();
  const isExpired = drive.deadline && new Date(drive.deadline) < now;
  const isOpen = drive.status === 'Open' && !isExpired;

  const canApply = isEligible && isOpen;

  return {
    isEligible,
    canApply,
    isOpen,
    isExpired,
    reasons,
  };
}

module.exports = {
  checkEligibility,
};
