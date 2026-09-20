/**
 * Authentication and Role-Based Access Control (RBAC) Middlewares.
 */

// Ensure user is authenticated
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/auth/login');
}

// Ensure user is an Admin
function ensureAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Access denied. Administrator privileges required.');
  res.redirect(req.session && req.session.user ? '/student/dashboard' : '/auth/login');
}

// Ensure user is a Student
function ensureStudent(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'student') {
    return next();
  }
  req.flash('error', 'Access denied. Student account required.');
  res.redirect(req.session && req.session.user ? '/admin/dashboard' : '/auth/login');
}

// Ensure user is a Guest (not logged in yet)
function ensureGuest(req, res, next) {
  if (req.session && req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/student/dashboard');
  }
  next();
}

module.exports = {
  ensureAuth,
  ensureAdmin,
  ensureStudent,
  ensureGuest,
};
