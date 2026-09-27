const {
  getQuestions,
  getQuestionById,
  createAttempt,
  getAttemptById,
  getAttemptResult,
  getMCQHistory,
  submitAttempt,
} = require("../services/mcqService");

// ============================================================
// GET MCQ QUESTIONS
// ============================================================

const getMcqQuestions = async (req, res) => {
  try {
    const {
      subject = "All",
      difficulty = "All",
      limit = 20,
    } = req.query;

    const questions = await getQuestions({
      subject,
      difficulty,
      limit,
    });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error(
      "Get MCQ Questions Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch MCQ questions.",
    });
  }
};

// ============================================================
// GET SINGLE MCQ QUESTION
// ============================================================

const getMcqQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question =
      await getQuestionById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "MCQ question not found.",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error(
      "Get MCQ Question Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch MCQ question.",
    });
  }
};

// ============================================================
// START MCQ TEST
// ============================================================

const startMcqTest = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required.",
      });
    }

    const {
      difficulty = "All",
      questionCount = 20,
      durationMinutes = 20,
    } = req.body;

    const result = await createAttempt({
      userId,
      difficulty,
      questionCount,
      durationMinutes,
    });

    res.status(201).json({
      success: true,
      message: "MCQ test started successfully.",
      attempt: result.attempt,
      questions: result.questions,
    });
  } catch (error) {
    console.error(
      "Start MCQ Test Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to start MCQ test.",
    });
  }
};

// ============================================================
// GET MCQ ATTEMPT
// ============================================================

const getMcqAttempt = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required.",
      });
    }

    const { id } = req.params;

    const attempt =
      await getAttemptById({
        attemptId: id,
        userId,
      });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "MCQ attempt not found.",
      });
    }

    res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error(
      "Get MCQ Attempt Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch MCQ attempt.",
    });
  }
};

// ============================================================
// GET COMPLETE MCQ RESULT
// ============================================================

const getMcqResult = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required.",
      });
    }

    const { id } = req.params;

    const result =
      await getAttemptResult({
        attemptId: id,
        userId,
      });

    if (!result?.attempt) {
      return res.status(404).json({
        success: false,
        message: "MCQ result not found.",
      });
    }

    res.status(200).json({
      success: true,
      attempt: result.attempt,
      questions: result.questions || [],
    });
  } catch (error) {
    console.error(
      "Get MCQ Result Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch MCQ result.",
    });
  }
};

// ============================================================
// GET MCQ HISTORY
// ============================================================

const getMcqHistory = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required.",
      });
    }

    const {
      limit = 50,
    } = req.query;

    const attempts =
      await getMCQHistory({
        userId,
        limit,
      });

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts,
    });
  } catch (error) {
    console.error(
      "Get MCQ History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch MCQ history.",
    });
  }
};

// ============================================================
// SUBMIT MCQ TEST
// ============================================================

const submitMcqTest = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication is required.",
      });
    }

    const { id } = req.params;

    const {
      answers = [],
      timeTakenSeconds = 0,
      autoSubmitted = false,
    } = req.body;

    const attempt =
      await submitAttempt({
        attemptId: id,
        userId,
        answers,
        timeTakenSeconds,
        autoSubmitted,
      });

    res.status(200).json({
      success: true,
      message:
        autoSubmitted
          ? "MCQ test auto-submitted successfully."
          : "MCQ test submitted successfully.",
      attempt,
    });
  } catch (error) {
    console.error(
      "Submit MCQ Test Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to submit MCQ test.",
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getMcqQuestions,
  getMcqQuestion,
  startMcqTest,
  getMcqAttempt,
  getMcqResult,
  getMcqHistory,
  submitMcqTest,
};