const User = require('../models/User');

// GET /auth/login
exports.getLogin = (req, res) => {
  res.render('auth/login', {
    pageTitle: 'Login - Campus Placement System',
  });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error', 'Please provide both email and password.');
      return res.redirect('/auth/login');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Save user session
    req.session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash('success', `Welcome back, ${user.name}!`);

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } else {
      return res.redirect('/student/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/auth/login');
  }
};

// GET /auth/register
exports.getRegister = (req, res) => {
  res.render('auth/register', {
    pageTitle: 'Student Registration - Campus Placement System',
  });
};

// POST /auth/register
exports.postRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      rollNumber,
      branch,
      cgpa,
      skills,
      resumeLink,
      phone,
      graduationYear,
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      req.flash('error', 'Name, Email, and Password are required.');
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/auth/register');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters long.');
      return res.redirect('/auth/register');
    }

    const parsedCGPA = parseFloat(cgpa) || 0;
    if (parsedCGPA < 0 || parsedCGPA > 10) {
      req.flash('error', 'CGPA must be between 0.0 and 10.0.');
      return res.redirect('/auth/register');
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      req.flash('error', 'An account with this email already exists.');
      return res.redirect('/auth/register');
    }

    // Process skills into array
    const skillsArray = skills
      ? skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'student',
      rollNumber: (rollNumber || '').trim().toUpperCase(),
      branch: branch || 'CSE',
      cgpa: parsedCGPA,
      skills: skillsArray,
      resumeLink: (resumeLink || '').trim(),
      phone: (phone || '').trim(),
      graduationYear: parseInt(graduationYear, 10) || 2026,
    });

    await newUser.save();

    // Log the student in automatically
    req.session.user = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    req.flash('success', 'Registration successful! Welcome to the placement portal.');
    res.redirect('/student/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error', error.message || 'Registration failed. Please check your inputs.');
    res.redirect('/auth/register');
  }
};

// GET /auth/logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
    }
    res.redirect('/auth/login');
  });
};
