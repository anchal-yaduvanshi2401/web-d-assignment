# 🎓 Campus Placement & Internship Management System

A full-stack web application developed using **Node.js**, **Express.js**, **MongoDB / Mongoose**, and **EJS (Embedded JavaScript)** templating. This project streamlines college recruitment drives, automates student eligibility checks, eliminates duplicate applications, tracks selection stages, and provides administrative oversight for Placement Officers.

---

## 📋 Table of Contents

1. [Key Features](#-key-features)
2. [Tech Stack & Architecture](#-tech-stack--architecture)
3. [Folder & File Structure](#-folder--file-structure)
4. [Prerequisites & Quick Start](#-prerequisites--quick-start)
5. [Default Login Credentials](#-default-login-credentials)
6. [Business Logic & Eligibility Engine](#-business-logic--eligibility-engine)
7. [Database Schema Design](#-database-schema-design)
8. [College Viva & Presentation Guide](#-college-viva--presentation-guide)

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Registration & Authentication**: Secure sign-up with password hashing using `bcryptjs`.
- **Academic & Career Profile**: Manage roll number, engineering branch, current CGPA, graduation year, technical skills list, and cloud resume link.
- **Personalized Student Dashboard**: View live counts of active drives, eligible drives, submitted applications, and job offers.
- **Smart Drive Exploration**: Browse open recruitment & internship drives with instant visual eligibility indicators (**Eligible** / **Ineligible** with reasons).
- **One-Click Application**: Apply directly with validation against drive cutoffs and deadlines.
- **Duplicate Prevention**: System guarantees that a student cannot submit more than one application per drive.
- **Real-Time Application Status Tracker**: Monitor stages (`Applied` ➔ `Shortlisted` ➔ `Interviewed` ➔ `Selected` ➔ `Rejected`) along with Placement Officer feedback remarks.

### 👔 For Placement Officers (Admin)
- **Administrative Dashboard**: Real-time KPI counters (Total Drives, Active vs. Closed Drives, Candidate Pool Size, Offer Letters Released) and recruitment funnel breakdown.
- **Drive Lifecycle Management (CRUD)**: Create, edit, view, and delete recruitment/internship opportunities.
- **Applicant Management**: View applicants filtered by specific drive, application status, or engineering branch.
- **Status & Remarks Updater**: Advance candidates through screening, technical interviews, and final selection with custom feedback.
- **Student Directory**: Search and filter students by department and minimum CGPA threshold.

---

## 🛠 Tech Stack & Architecture

- **Backend Runtime**: [Node.js](https://nodejs.org/)
- **Server Framework**: [Express.js](https://expressjs.com/) (MVC Architecture)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Templating Engine**: [EJS](https://ejs.co/) (Modular layout with header, navbar, alerts, and footer partials)
- **Session & State Management**: `express-session` with persistent MongoDB storage (`connect-mongo`) and graceful fallback
- **Security & Password Hashing**: `bcryptjs` with salt rounds
- **Styling**: Custom modern responsive CSS with CSS variables, accessible badges, card components, and mobile responsiveness.

```
       ┌───────────────────────────────┐
       │     Client (Browser / EJS)    │
       └───────────────▲───────────────┘
                       │ HTTP / REST
       ┌───────────────▼───────────────┐
       │        Express.js App         │
       │  (Routes, Auth Middleware)    │
       └───────────────▲───────────────┘
                       │
       ┌───────────────▼───────────────┐
       │     Controllers & Engine      │
       │   (Eligibility / Business)    │
       └───────────────▲───────────────┘
                       │ Mongoose ODM
       ┌───────────────▼───────────────┐
       │         MongoDB Engine        │
       │   (Users, Drives, Apps)       │
       └───────────────────────────────┘
```

---

## 📂 Folder & File Structure

```
campus-placement-system/
├── .env                     # Environment configuration (PORT, MONGODB_URI, SESSION_SECRET)
├── .env.example             # Example environment file template
├── package.json             # Project dependencies and npm scripts
├── README.md                # Comprehensive documentation & Viva guide
├── server.js                # Express application entrypoint and middleware pipeline
├── seed.js                  # Database seeder with admin, sample students, and drives
├── public/
│   ├── css/
│   │   └── style.css        # Professional custom responsive stylesheet
│   └── js/
│       └── main.js          # Client-side JavaScript (alerts dismiss, delete confirmation)
└── src/
    ├── config/
    │   └── db.js            # MongoDB connection utility
    ├── controllers/
    │   ├── adminController.js   # Drive CRUD, applicant review, student directory
    │   ├── authController.js    # Registration, login, logout, password verification
    │   └── studentController.js # Student profile, drives browsing, apply logic
    ├── middleware/
    │   ├── auth.js          # Role-based access control (ensureAuth, ensureAdmin, ensureStudent)
    │   └── flash.js         # Lightweight session-based flash notification system
    ├── models/
    │   ├── Application.js   # Application schema with compound unique index
    │   ├── Drive.js         # Placement / Internship drive schema
    │   └── User.js          # User schema with bcrypt password hashing pre-save hook
    ├── routes/
    │   ├── adminRoutes.js   # Admin-only protected routes
    │   ├── authRoutes.js    # Public authentication routes
    │   ├── indexRoutes.js   # Public landing page
    │   └── studentRoutes.js # Student-only protected routes
    ├── utils/
    │   └── eligibility.js   # Automated eligibility verification engine
    └── views/
        ├── 404.ejs          # 404 Not Found error page
        ├── 500.ejs          # 500 Internal Server error page
        ├── home.ejs         # Public landing page with stats and highlights
        ├── admin/
        │   ├── applications.ejs # Applicant review and status changer
        │   ├── dashboard.ejs    # Admin KPI stats and recruitment funnel
        │   ├── drive-form.ejs   # Create / Edit drive form
        │   ├── drives.ejs       # Drive listing and management table
        │   └── students.ejs     # Student directory with filters
        ├── auth/
        │   ├── login.ejs        # Login page (includes quick demo credentials)
        │   └── register.ejs     # Student registration form
        ├── partials/
        │   ├── alerts.ejs       # Flash message component
        │   ├── footer.ejs       # Standard page footer
        │   ├── header.ejs       # HTML head with styles and meta tags
        │   └── navbar.ejs       # Role-aware responsive navigation bar
        └── student/
            ├── applications.ejs # Application tracking table
            ├── dashboard.ejs    # Student KPI cards and recent drives
            ├── drive-detail.ejs # Drive specifications and apply section
            ├── drives.ejs       # Searchable and filterable drives directory
            └── profile.ejs      # Academic profile editor
```

---

## ⚙️ Prerequisites & Quick Start

### 1. Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** running locally on default port `27017` or a MongoDB Atlas URI.

### 2. Installation
Install project dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Verify or edit `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/placement_system
SESSION_SECRET=campus_placement_secret_key_2026_super_secure
NODE_ENV=development
```

### 4. Seed Database with Initial Data
Populate the database with a pre-configured Placement Officer account, 4 sample engineering students, 6 recruitment/internship drives, and sample applications:
```bash
npm run seed
```

### 5. Run the Server
- **Production mode**:
  ```bash
  npm start
  ```
- **Development mode** (with nodemon):
  ```bash
  npm run dev
  ```

Open your browser and navigate to:
👉 **`http://localhost:3000`**

---

## 🔑 Default Login Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Placement Officer (Admin)** | `admin@placement.edu` | `AdminPassword123` | Full administrative control |
| **Student (CSE)** | `rahul.verma@college.edu` | `Password123` | 8.80 CGPA &bull; Full-stack developer |
| **Student (ECE)** | `priya.nair@college.edu` | `Password123` | 7.40 CGPA &bull; IoT & Embedded |
| **Student (IT)** | `amit.patel@college.edu` | `Password123` | 6.80 CGPA &bull; Java & Spring Boot |
| **Student (ME)** | `sneha.rao@college.edu` | `Password123` | 8.20 CGPA &bull; Robotics & CAD |

*Note: You can also register a brand-new student account anytime via `/auth/register`.*

---

## 🧠 Business Logic & Eligibility Engine

The eligibility verification logic is isolated in `src/utils/eligibility.js`:

```javascript
function checkEligibility(student, drive) {
  // 1. CGPA Criterion
  const isCgpaEligible = student.cgpa >= drive.minCGPA;

  // 2. Branch Criterion
  const isBranchAllowed = 
    drive.eligibleBranches.includes('All') || 
    drive.eligibleBranches.includes(student.branch);

  // 3. Status & Deadline Criterion
  const isOpen = drive.status === 'Open' && new Date(drive.deadline) >= new Date();

  return {
    isEligible: isCgpaEligible && isBranchAllowed,
    canApply: isCgpaEligible && isBranchAllowed && isOpen,
    // ... reasons array for transparency
  };
}
```

### How Duplicate Submissions are Prevented
1. **Application-Level Check**: `Application.findOne({ student: student._id, drive: drive._id })` is verified before creating an application.
2. **Database-Level Constraint**: A compound unique index on `{ student: 1, drive: 1 }` prevents duplicates even under race conditions.
3. **Graceful Handling**: Duplicate key error `11000` is caught and converted into a user-friendly alert.

---

## 🗄️ Database Schema Design

### 1. User Model (`User.js`)
- `name`, `email` (unique, lowercase), `password` (bcrypt hashed), `role` (`student` | `admin`).
- Student profile attributes: `rollNumber`, `branch` (`CSE`, `IT`, `ECE`, `EE`, `ME`, `Civil`, `Other`), `cgpa`, `skills` (Array of Strings), `resumeLink`, `phone`, `graduationYear`.

### 2. Drive Model (`Drive.js`)
- `companyName`, `roleTitle`, `jobType` (`Full-time Placement` | `Internship`), `description`, `packageOrStipend`, `minCGPA`, `eligibleBranches`, `location`, `deadline`, `driveDate`, `status` (`Open` | `Closed`), `createdBy` (Reference to User).

### 3. Application Model (`Application.js`)
- `student` (Ref: User), `drive` (Ref: Drive), `status` (`Applied`, `Shortlisted`, `Interviewed`, `Selected`, `Rejected`), `appliedAt`, `adminNotes`, `updatedBy` (Ref: User).
- **Index**: `{ student: 1, drive: 1 }` (unique).

---

## 🎓 College Viva & Presentation Guide

Common questions you may be asked during project evaluation and defense:

### Q1: What architecture does this application follow?
> **Answer**: The project follows the **MVC (Model-View-Controller)** pattern:
> - **Models (`src/models/`)**: Define the data structure, schema validation, and database hooks with Mongoose.
> - **Views (`src/views/`)**: Render dynamic HTML server-side using EJS templates.
> - **Controllers (`src/controllers/`)**: Contain the core business rules, handle HTTP requests, and coordinate between models and views.

### Q2: How does the system handle security and authentication?
> **Answer**:
> 1. Passwords are never stored in plain text. We use `bcryptjs` with auto-generated salts in a Mongoose `pre('save')` hook.
> 2. Authentication state is preserved across HTTP requests using `express-session` with `httpOnly` secure cookies.
> 3. Role-Based Access Control (RBAC) middleware (`ensureAuth`, `ensureAdmin`, `ensureStudent`) guards private routes and prevents unauthorized role escalation.

### Q3: How do you prevent a student from applying to the same company twice?
> **Answer**: We employ a **defense-in-depth** strategy:
> 1. **UI layer**: The button turns into "✓ Already Applied" if an application is already on file.
> 2. **Controller layer**: The server checks `Application.findOne({ student, drive })` before creating a document.
> 3. **Database layer**: Mongoose enforces a compound unique index on `{ student: 1, drive: 1 }`, guaranteeing data integrity even under simultaneous requests.

### Q4: How does the eligibility engine work?
> **Answer**: When a student browses or applies to a drive, the `checkEligibility(student, drive)` utility performs numeric comparison (`student.cgpa >= drive.minCGPA`) and branch membership verification (`drive.eligibleBranches.includes('All') || drive.eligibleBranches.includes(student.branch)`). If any criteria fails, descriptive feedback explains why the student cannot apply.

### Q5: Why use server-side rendering with EJS instead of a separate React frontend?
> **Answer**: EJS provides fast rendering without complex client-side build pipelines or CORS issues. It is lightweight, straightforward to explain during viva presentations, and keeps session authentication state synchronized directly on the server.
