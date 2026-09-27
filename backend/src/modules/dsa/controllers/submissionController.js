// =====================================================
// PrepNova - DSA Submission Controller
// =====================================================

const DSAProblem = require("../models/DSAProblem");
const Submission = require("../models/Submission");

const {
  executeCode,
} = require("../services/codeExecutionService");

const {
  buildExecutableCode,
} = require("../services/codeRunner");

// =====================================================
// Helper: Execute Problem
// =====================================================

const executeProblem = async ({
  problem,
  language,
  code,
  testCases,
}) => {
  const executionTestCases = testCases.map(
    (testCase) => ({
      ...testCase.toObject?.() || testCase,

      input: testCase.input || "",
      output: testCase.output || "",

      executableCode: buildExecutableCode({
        language,
        userCode: code,
        testCase,
        runner: problem.runner,
        functionName:
          problem.functionName || "solution",
      }),
    })
  );

  return executeCode({
    language,
    code,
    testCases: executionTestCases,
    problem,
  });
};

// =====================================================
// Run Code
// =====================================================

const runCode = async (req, res) => {
  try {
    const {
      problemId,
      language,
      code,
    } = req.body;

    // Validate request
    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message:
          "problemId, language and code are required.",
      });
    }

    // Find problem
    const problem = await DSAProblem.findOne({
      problemId: Number(problemId),
      isActive: true,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "DSA problem not found.",
      });
    }

    // Only visible test cases for Run Code
    const visibleTestCases =
      problem.testCases.filter(
        (testCase) => !testCase.isHidden
      );

    if (visibleTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No visible test cases are available.",
      });
    }

    const result = await executeProblem({
      problem,
      language,
      code,
      testCases: visibleTestCases,
    });

    return res.status(200).json({
      success: true,
      message: "Code executed successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Run Code Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to execute code.",
    });
  }
};

// =====================================================
// Submit Code
// =====================================================

const submitCode = async (req, res) => {
  try {
    const {
      problemId,
      language,
      code,
    } = req.body;

    // Validate request
    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message:
          "problemId, language and code are required.",
      });
    }

    // Find problem
    const problem = await DSAProblem.findOne({
      problemId: Number(problemId),
      isActive: true,
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "DSA problem not found.",
      });
    }

    // Submit against ALL test cases
    const allTestCases = problem.testCases;

    if (allTestCases.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No test cases are available.",
      });
    }

    const result = await executeProblem({
      problem,
      language,
      code,
      testCases: allTestCases,
    });

    // Save submission
    const submission =
      await Submission.create({
        user: req.user._id,

        problem: problem._id,

        problemId: problem.problemId,

        language,

        code,

        status: result.status,

        runtime:
          result.runtime || null,

        memory:
          result.memory || null,

        output:
          result.output || "",

        expected:
          result.expected || "",

        errorMessage:
          result.errorMessage || "",

        passedTestCases:
          result.passedTestCases || 0,

        totalTestCases:
          result.totalTestCases ||
          allTestCases.length,
      });

    return res.status(200).json({
      success: true,
      message:
        result.status === "accepted"
          ? "Solution accepted!"
          : "Submission evaluated.",

      data: {
        result,

        submission: {
          id: submission._id,
          problemId:
            submission.problemId,
          language:
            submission.language,
          status:
            submission.status,
          passedTestCases:
            submission.passedTestCases,
          totalTestCases:
            submission.totalTestCases,
          runtime:
            submission.runtime,
          memory:
            submission.memory,
          createdAt:
            submission.createdAt,
        },
      },
    });
  } catch (error) {
    console.error(
      "Submit Code Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to submit code.",
    });
  }
};

// =====================================================
// Get User Submission History
// =====================================================

const getSubmissions = async (
  req,
  res
) => {
  try {
    const submissions =
      await Submission.find({
        user: req.user._id,
      })
        .populate(
          "problem",
          "problemId title difficulty"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error(
      "Get Submissions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch submissions.",
    });
  }
};

// =====================================================
// Get User Submissions For One Problem
// =====================================================

const getProblemSubmissions = async (
  req,
  res
) => {
  try {
    const problemId = Number(
      req.params.problemId
    );

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message:
          "Valid problem ID is required.",
      });
    }

    const submissions =
      await Submission.find({
        user: req.user._id,
        problemId,
      })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error(
      "Get Problem Submissions Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch problem submissions.",
    });
  }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  runCode,
  submitCode,
  getSubmissions,
  getProblemSubmissions,
};