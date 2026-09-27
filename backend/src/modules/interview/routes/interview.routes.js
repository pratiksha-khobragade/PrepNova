const express = require("express");

const {
  createInterview,
  analyzeInterviewResume,
  getCurrentQuestion,
  submitInterviewAnswer,
  generateNextQuestion,
  finishInterview,
  getInterviewReport,
  getMyInterviews,
} = require("../controllers/interviewController");

const { verifyToken } = require("../../auth/authMiddleware");

const uploadInterviewResume = require("../utils/interviewUpload");

const router = express.Router();

// Upload resume
router.post(
  "/resume",
  verifyToken,
  uploadInterviewResume.single("resume"),
  analyzeInterviewResume
);

// Create interview + generate first question
router.post(
  "/",
  verifyToken,
  createInterview
);

// Get current question
router.get(
  "/:interviewId/question",
  verifyToken,
  getCurrentQuestion
);

// Submit answer + AI evaluation
router.post(
  "/answer",
  verifyToken,
  submitInterviewAnswer
);

// Generate adaptive next question
router.post(
  "/next-question",
  verifyToken,
  generateNextQuestion
);

// Finish interview + generate analytics
router.post(
  "/finish",
  verifyToken,
  finishInterview
);

// Get interview report
router.get(
  "/report/:interviewId",
  verifyToken,
  getInterviewReport
);

// Interview history
router.get(
  "/history",
  verifyToken,
  getMyInterviews
);

module.exports = router;