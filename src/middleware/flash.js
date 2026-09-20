/**
 * Lightweight session-based flash messaging middleware.
 * Stores flash alerts in req.session.flashMessages and exposes them
 * to templates via res.locals.messages.
 */
function flashMiddleware(req, res, next) {
  // Initialize storage in session if needed
  if (!req.session.flashMessages) {
    req.session.flashMessages = {
      success: [],
      error: [],
      warning: [],
      info: [],
    };
  }

  // Method to push a message: req.flash('success', 'Message')
  req.flash = function (type, msg) {
    if (!req.session.flashMessages[type]) {
      req.session.flashMessages[type] = [];
    }
    req.session.flashMessages[type].push(msg);
  };

  // Provide messages to views
  res.locals.messages = {
    success: [...(req.session.flashMessages.success || [])],
    error: [...(req.session.flashMessages.error || [])],
    warning: [...(req.session.flashMessages.warning || [])],
    info: [...(req.session.flashMessages.info || [])],
  };

  // Clear messages from session after pulling
  req.session.flashMessages = {
    success: [],
    error: [],
    warning: [],
    info: [],
  };

  // Expose currentUser and current path to all views
  res.locals.currentUser = req.session.user || null;
  res.locals.currentPath = req.path;

  next();
}

module.exports = flashMiddleware;
