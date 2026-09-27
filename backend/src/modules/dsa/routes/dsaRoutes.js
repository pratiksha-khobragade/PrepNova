const express = require("express");

const {
  getProblems,
  getProblem,
  runCode,
  submitCode,
} = require("../controllers/dsaController");

const {
  getDsaProgress,
  getDsaSubmissionHistory,
  getSolvedDsaProblems,
} = require("../controllers/dsaProgressController");

const {
  verifyToken,
} = require("../../auth/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| DSA Problems
|--------------------------------------------------------------------------
*/

router.get(
  "/problems",
  verifyToken,
  getProblems
);

router.get(
  "/problems/:id",
  verifyToken,
  getProblem
);

/*
|--------------------------------------------------------------------------
| Code Execution
|--------------------------------------------------------------------------
*/

router.post(
  "/problems/:id/run",
  verifyToken,
  runCode
);

router.post(
  "/problems/:id/submit",
  verifyToken,
  submitCode
);

/*
|--------------------------------------------------------------------------
| DSA Progress
|--------------------------------------------------------------------------
*/

router.get(
  "/progress",
  verifyToken,
  getDsaProgress
);

/*
|--------------------------------------------------------------------------
| Submission History
|--------------------------------------------------------------------------
*/

router.get(
  "/submissions",
  verifyToken,
  getDsaSubmissionHistory
);

/*
|--------------------------------------------------------------------------
| Solved Problems
|--------------------------------------------------------------------------
*/

router.get(
  "/solved",
  verifyToken,
  getSolvedDsaProblems
);

module.exports = router;