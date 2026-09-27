const express = require("express");

const {
  analyzeResume,
} = require("../controllers/resumeAnalyzerController");

const uploadResume = require("../utils/resumeUpload");

const {
  verifyToken,
} = require("../../auth/authMiddleware");

const router = express.Router();

router.post(
  "/analyze",
  verifyToken,
  uploadResume.single("resume"),
  analyzeResume
);

module.exports = router;