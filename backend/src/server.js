// =====================================================
// PrepNova Backend Server
// Monolithic Deployment Version
// =====================================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// =====================================================
// Routes
// =====================================================

const authRoutes = require("./modules/auth/authRoutes");

const dsaRoutes = require("./modules/dsa/routes/dsaRoutes");

const submissionRoutes = require(
  "./modules/dsa/routes/submissionRoutes"
);

const mcqRoutes = require(
  "./modules/mcq/routes/mcq.routes"
);

const resumeAnalyzerRoutes = require(
  "./modules/resumeAnalyzer/routes/resumeAnalyzer.routes"
);

const interviewRoutes = require(
  "./modules/interview/routes/interview.routes"
);

// Progress Tracking Routes
const progressRoutes = require(
  "./modules/progress tracking/routes/progressRoutes"
);

// Settings Routes
const settingsRoutes = require(
  "./modules/settings/routes/settingsRoutes"
);


// =====================================================
// Create Express Application
// =====================================================

const app = express();


// =====================================================
// Middleware
// =====================================================

// CORS
//
// In monolithic deployment, frontend and backend are served
// from the same Render URL.
//
// We still keep CORS enabled so local development continues
// to work properly.

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// =====================================================
// MongoDB
// =====================================================

connectDB();


// =====================================================
// Authentication Routes
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);


// =====================================================
// DSA Routes
// =====================================================

app.use(
  "/api/dsa",
  dsaRoutes
);

app.use(
  "/api/dsa/submissions",
  submissionRoutes
);


// =====================================================
// MCQ Routes
// =====================================================

app.use(
  "/api/mcq",
  mcqRoutes
);


// =====================================================
// AI Resume Analyzer Routes
// =====================================================

app.use(
  "/api/resume-analyzer",
  resumeAnalyzerRoutes
);


// =====================================================
// AI Interview Routes
// =====================================================

app.use(
  "/api/interview",
  interviewRoutes
);


// =====================================================
// Progress Tracking Routes
// =====================================================

app.use(
  "/api/progress",
  progressRoutes
);


// =====================================================
// Settings Routes
// =====================================================

app.use(
  "/api/settings",
  settingsRoutes
);


// =====================================================
// Uploaded Files
// =====================================================
//
// Profile images are stored inside:
//
// backend/uploads/profile-images/
//
// They are accessible through:
//
// /uploads/profile-images/<filename>
//

const uploadsPath = path.join(
  __dirname,
  "../uploads"
);

app.use(
  "/uploads",
  express.static(uploadsPath)
);


// =====================================================
// Serve React Frontend
// =====================================================
//
// Project structure:
//
// PrepNova/
// ├── backend/
// │   └── src/
// │       └── server.js
// │
// └── frontend/
//     └── dist/
//
// Since server.js is inside:
//
// backend/src/
//
// we go:
//
// ../       -> backend
// ../../    -> PrepNova
//
// and then:
//
// frontend/dist
//

const frontendPath = path.join(
  __dirname,
  "../../frontend/dist"
);


// Serve React static files
app.use(
  express.static(frontendPath)
);


// =====================================================
// API 404 Handler
// =====================================================
//
// If an unknown API endpoint is requested,
// return JSON instead of the React application.
//

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});


// =====================================================
// React Router Fallback
// =====================================================
//
// Important for routes such as:
//
// /login
// /signup
// /dashboard
// /tests
// /tests/dsa
// /resume-analyzer
// /interview
// /settings
//
// Express sends index.html and React Router handles
// the actual page.
//

app.use((req, res) => {
  res.sendFile(
    path.join(
      frontendPath,
      "index.html"
    )
  );
});


// =====================================================
// Global Error Handler
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Global Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });
  }
);


// =====================================================
// Start Server
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      "========================================"
    );

    console.log(
      "🚀 PrepNova Server Started"
    );

    console.log(
      `📡 Port: ${PORT}`
    );

    console.log(
      "🌐 Monolithic deployment mode"
    );

    console.log(
      "========================================"
    );
  }
);