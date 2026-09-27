// =====================================================
// PrepNova - Authentication Routes
// =====================================================

const express = require("express");

const {
  signup,
  login,
  googleLogin,
  getCurrentUser,
} = require("./authController");

const {
  verifyToken,
} = require("./authMiddleware");

const router = express.Router();

// =====================================================
// Public Routes
// =====================================================

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/google
router.post("/google", googleLogin);

// =====================================================
// Protected Routes
// =====================================================

// GET /api/auth/me
// Requires a valid JWT token
router.get(
  "/me",
  verifyToken,
  getCurrentUser
);

module.exports = router;