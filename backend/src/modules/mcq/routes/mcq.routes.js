const express = require("express");

const {
  getMcqQuestions,
  getMcqQuestion,
  startMcqTest,
  getMcqAttempt,
  getMcqResult,
  getMcqHistory,
  submitMcqTest,
} = require("../controllers/mcqController");

const {
  verifyToken,
} = require("../../auth/authMiddleware");

const router = express.Router();

// ============================================================
// GET MCQ QUESTIONS
// ============================================================

router.get(
  "/questions",
  verifyToken,
  getMcqQuestions
);

// ============================================================
// GET SINGLE MCQ QUESTION
// ============================================================

router.get(
  "/questions/:id",
  verifyToken,
  getMcqQuestion
);

// ============================================================
// START MCQ TEST
// ============================================================

router.post(
  "/tests/start",
  verifyToken,
  startMcqTest
);

// ============================================================
// MCQ HISTORY
//
// IMPORTANT:
// This must come before /tests/:id
// ============================================================

router.get(
  "/tests/history",
  verifyToken,
  getMcqHistory
);

// ============================================================
// COMPLETE MCQ RESULT
//
// Returns:
// - Attempt statistics
// - Questions
// - Selected answers
// - Correct answers
// - Explanations
// ============================================================

router.get(
  "/tests/:id/result",
  verifyToken,
  getMcqResult
);

// ============================================================
// GET MCQ ATTEMPT
// ============================================================

router.get(
  "/tests/:id",
  verifyToken,
  getMcqAttempt
);

// ============================================================
// SUBMIT MCQ TEST
// ============================================================

router.post(
  "/tests/:id/submit",
  verifyToken,
  submitMcqTest
);

module.exports = router;