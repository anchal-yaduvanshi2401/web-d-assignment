require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const connectDB = require('./src/config/db');
const flashMiddleware = require('./src/middleware/flash');

// Import Route Handlers
const indexRoutes = require('./src/routes/indexRoutes');
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_system';

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method Override for PUT / DELETE from HTML forms
app.use(methodOverride('_method'));

// Session Configuration with MongoStore fallback
let sessionStore;
try {
  sessionStore = MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
  });
} catch (e) {
  console.warn('⚠️ MongoStore init deferred; using default MemoryStore.');
}

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'campus_placement_default_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
    },
  })
);

// Flash Messages & Template Locals Middleware
app.use(flashMiddleware);

// Mount Application Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

// 404 Not Found Page Handler
app.use((req, res) => {
  res.status(404).render('404', {
    pageTitle: '404 - Page Not Found',
  });
});

// 500 Internal Server Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).render('500', {
    pageTitle: '500 - Server Error',
    error: process.env.NODE_ENV === 'development' ? err : null,
  });
});

// Start Server if executed directly: `node app.js`
if (require.main === module) {
  connectDB()
    .catch((err) => {
      console.warn('⚠️ Warning: Continuing without immediate DB connection. Requests requiring DB will wait or fail.');
    })
    .finally(() => {
      app.listen(PORT, () => {
        console.log(`=======================================================`);
        console.log(`🎓 Campus Placement & Internship System is running!`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`👤 Admin Credentials: admin@placement.edu / AdminPassword123`);
        console.log(`=======================================================`);
      });
    });
}

module.exports = app;
