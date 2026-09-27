// =====================================================
// PrepNova - DSA Controller
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
// Get All Problems
// =====================================================

const getProblems = async (req, res) => {
  try {
    const {
      difficulty,
      topic,
      search,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (topic) {
      filter.topics = topic;
    }

    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    const problems =
      await DSAProblem.find(filter)
        .sort({ problemId: 1 })
        .select("-testCases.isHidden");

    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error(
      "Get DSA Problems Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch DSA problems.",
    });
  }
};

// =====================================================
// Get Single Problem
// =====================================================

const getProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const problem =
      await DSAProblem.findOne({
        problemId: Number(id),
        isActive: true,
      });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found.",
      });
    }

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error(
      "Get DSA Problem Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch problem.",
    });
  }
};

// =====================================================
// Prepare Test Cases
// =====================================================

const prepareTestCases = ({
  problem,
  includeHidden = false,
}) => {
  const testCases =
    problem.testCases || [];

  return testCases.filter(
    (testCase) =>
      includeHidden || !testCase.isHidden
  );
};

// =====================================================
// Build Executable Test Cases
// =====================================================

const buildExecutableTestCases = ({
  problem,
  language,
  code,
  includeHidden,
}) => {
  const testCases =
    prepareTestCases({
      problem,
      includeHidden,
    });

  return testCases.map(
    (testCase) => ({
      ...testCase.toObject?.() || testCase,

      executableCode:
        buildExecutableCode({
          language,
          userCode: code,
          testCase,
          runner:
            problem.runner,
          functionName:
            problem.functionName,
        }),
    })
  );
};

// =====================================================
// Run Code
// Public Test Cases Only
// =====================================================

const runCode = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      language,
      code,
    } = req.body;

    // ===============================================
    // Validate Request
    // ===============================================

    if (!language) {
      return res.status(400).json({
        success: false,
        message:
          "Programming language is required.",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Code cannot be empty.",
      });
    }

    // ===============================================
    // Find Problem
    // ===============================================

    const problem =
      await DSAProblem.findOne({
        problemId: Number(id),
        isActive: true,
      });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message:
          "DSA problem not found.",
      });
    }

    // ===============================================
    // Public Test Cases
    // ===============================================

    const testCases =
      buildExecutableTestCases({
        problem,
        language,
        code,
        includeHidden: false,
      });

    if (testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No public test cases available.",
      });
    }

    // ===============================================
    // Execute
    // ===============================================

    const result =
      await executeCode({
        language,
        code,
        testCases,
      });

    // ===============================================
    // Response
    // ===============================================

    return res.status(200).json({
      success: true,

      mode: "run",

      problemId:
        problem.problemId,

      status:
        result.status,

      passedTestCases:
        result.passedTestCases,

      totalTestCases:
        result.totalTestCases,

      runtime:
        result.runtime,

      memory:
        result.memory,

      output:
        result.output,

      expected:
        result.expected,

      errorMessage:
        result.errorMessage,

      results:
        result.results || [],
    });
  } catch (error) {
    console.error(
      "Run DSA Code Error:",
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
// Public + Hidden Test Cases
// =====================================================

const submitCode = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      language,
      code,
    } = req.body;

    // ===============================================
    // Validate Request
    // ===============================================

    if (!language) {
      return res.status(400).json({
        success: false,
        message:
          "Programming language is required.",
      });
    }

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Code cannot be empty.",
      });
    }

    // ===============================================
    // Find Problem
    // ===============================================

    const problem =
      await DSAProblem.findOne({
        problemId: Number(id),
        isActive: true,
      });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message:
          "DSA problem not found.",
      });
    }

    // ===============================================
    // Public + Hidden Test Cases
    // ===============================================

    const testCases =
      buildExecutableTestCases({
        problem,
        language,
        code,
        includeHidden: true,
      });

    if (testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No test cases available.",
      });
    }

    // ===============================================
    // Execute
    // ===============================================

    const result =
      await executeCode({
        language,
        code,
        testCases,
      });

    // ===============================================
    // Save Submission
    // ===============================================

    const submission =
      await Submission.create({
        user: req.user._id,

        problem: problem._id,

        problemId:
          problem.problemId,

        language,

        code,

        status:
          result.status,

        runtime:
          result.runtime,

        memory:
          result.memory,

        output:
          result.output,

        expected:
          result.expected,

        errorMessage:
          result.errorMessage,

        passedTestCases:
          result.passedTestCases,

        totalTestCases:
          result.totalTestCases,
      });

    // ===============================================
    // Response
    // ===============================================

    return res.status(200).json({
      success: true,

      mode: "submit",

      submissionId:
        submission._id,

      problemId:
        problem.problemId,

      status:
        result.status,

      passedTestCases:
        result.passedTestCases,

      totalTestCases:
        result.totalTestCases,

      runtime:
        result.runtime,

      memory:
        result.memory,

      output:
        result.output,

      expected:
        result.expected,

      errorMessage:
        result.errorMessage,

      results:
        result.results || [],
    });
  } catch (error) {
    console.error(
      "Submit DSA Code Error:",
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
// Exports
// =====================================================

module.exports = {
  getProblems,
  getProblem,
  runCode,
  submitCode,
};