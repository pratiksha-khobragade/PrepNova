// =====================================================
// PrepNova - Submission Routes
// =====================================================

const express = require("express");

const {
  runCode,
  submitCode,
  getSubmissions,
  getProblemSubmissions,
} = require("../controllers/submissionController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

// =====================================================
// POST /api/dsa/submissions/run
// =====================================================

router.post(
  "/run",
  verifyToken,
  runCode
);

// =====================================================
// POST /api/dsa/submissions/submit
// =====================================================

router.post(
  "/submit",
  verifyToken,
  submitCode
);

// =====================================================
// GET /api/dsa/submissions
// =====================================================

router.get(
  "/",
  verifyToken,
  getSubmissions
);

// =====================================================
// GET /api/dsa/submissions/:problemId
// =====================================================

router.get(
  "/:problemId",
  verifyToken,
  getProblemSubmissions
);

module.exports = router;