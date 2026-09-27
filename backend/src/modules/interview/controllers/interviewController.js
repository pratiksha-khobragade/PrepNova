const Interview = require("../models/Interview");

const {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
} = require("../services/interviewAIService");

const extractResumeText = require("../../resumeAnalyzer/utils/extractResumeText");

// ======================================================
// CREATE INTERVIEW
// ======================================================

const createInterview = async (req, res) => {
  try {
    const {
      role,
      experience,
      mode,
      resumeText = "",
    } = req.body;

    if (!role || !experience || !mode) {
      return res.status(400).json({
        success: false,
        message:
          "Role, experience and interview mode are required.",
      });
    }

    if (!["Technical", "HR"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message:
          "Interview mode must be Technical or HR.",
      });
    }

    const interview = new Interview({
      userId: req.user._id,
      role: role.trim(),
      experience: experience.trim(),
      mode,
      resumeText,
      totalQuestions: 5,
      currentQuestionIndex: 0,
      status: "in-progress",
    });

    // Generate first question.
    const questionData =
      await generateInterviewQuestion({
        role,
        experience,
        mode,
        resumeText,
        previousQuestions: [],
        previousAnswer: "",
        previousFeedback: "",
        questionNumber: 1,
      });

    const firstQuestion = {
      question:
        questionData?.question ||
        "Tell me about yourself.",

      difficulty:
        questionData?.difficulty || "easy",

      timeLimit:
        Number(questionData?.timeLimit) || 90,
    };

    interview.questions.push(firstQuestion);

    await interview.save();

    // Grab the saved sub-document so we have its real _id.
    const savedFirstQuestion =
      interview.questions[0];

    return res.status(201).json({
      success: true,
      message: "Interview created successfully.",

      interview: {
        id: interview._id,

        role: interview.role,

        experience:
          interview.experience,

        mode: interview.mode,

        totalQuestions:
          interview.totalQuestions,

        currentQuestionIndex:
          interview.currentQuestionIndex,

        // Build the question object ourselves so
        // questionNumber is always present.
        question: {
          id: savedFirstQuestion._id,

          questionNumber:
            interview.currentQuestionIndex + 1,

          question:
            savedFirstQuestion.question,

          difficulty:
            savedFirstQuestion.difficulty,

          timeLimit:
            savedFirstQuestion.timeLimit,

          answer:
            savedFirstQuestion.answer,
        },

        status:
          interview.status,
      },
    });
  } catch (error) {
    console.error(
      "Create Interview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create interview.",
      error: error.message,
    });
  }
};

// ======================================================
// ANALYZE INTERVIEW RESUME
// ======================================================

const analyzeInterviewResume = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Resume file is required.",
      });
    }

    // Multer provides the uploaded file path
    // and original filename separately.
    //
    // extractResumeText expects:
    // extractResumeText(filePath, originalName)
    //
    // So we pass the correct two values here.
    const resumeText =
      await extractResumeText(
        req.file.path,
        req.file.originalname
      );

    return res.status(200).json({
      success: true,
      resumeText,
    });
  } catch (error) {
    console.error(
      "Interview Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to analyze resume.",
    });
  }
};

// ======================================================
// GET CURRENT QUESTION
// ======================================================

const getCurrentQuestion = async (
  req,
  res
) => {
  try {
    const { interviewId } =
      req.params;

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    // If already completed, return report state
    // instead of throwing "no longer active".
    if (
      interview.status ===
      "completed"
    ) {
      return res.status(200).json({
        success: true,

        interviewCompleted: true,

        interview: {
          id: interview._id,

          role: interview.role,

          experience:
            interview.experience,

          mode: interview.mode,

          totalQuestions:
            interview.totalQuestions,

          currentQuestionIndex:
            interview.currentQuestionIndex,

          status:
            interview.status,
        },
      });
    }

    if (
      interview.status !==
      "in-progress"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This interview is no longer active.",
      });
    }

    const currentQuestion =
      interview.questions[
        interview.currentQuestionIndex
      ];

    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Current question not found.",
      });
    }

    return res.status(200).json({
      success: true,

      interview: {
        id: interview._id,

        role: interview.role,

        experience:
          interview.experience,

        mode: interview.mode,

        totalQuestions:
          interview.totalQuestions,

        currentQuestionIndex:
          interview.currentQuestionIndex,

        question: {
          id:
            currentQuestion._id,

          // 1-indexed question number.
          questionNumber:
            interview.currentQuestionIndex + 1,

          question:
            currentQuestion.question,

          difficulty:
            currentQuestion.difficulty,

          timeLimit:
            currentQuestion.timeLimit,

          answer:
            currentQuestion.answer,

          score:
            currentQuestion.score,

          feedback:
            currentQuestion.feedback,
        },

        status:
          interview.status,
      },
    });
  } catch (error) {
    console.error(
      "Get Current Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load current question.",
      error: error.message,
    });
  }
};

// ======================================================
// SUBMIT ANSWER
// ======================================================

const submitInterviewAnswer = async (
  req,
  res
) => {
  try {
    const {
      interviewId,
      answer = "",
      timeTaken = 0,
    } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message:
          "Interview ID is required.",
      });
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    // ----------------------------------------------
    // If interview already completed
    // ----------------------------------------------

    if (
      interview.status ===
      "completed"
    ) {
      return res.status(200).json({
        success: true,

        interviewCompleted: true,

        message:
          "Interview has already been completed.",
      });
    }

    if (
      interview.status !==
      "in-progress"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This interview is no longer active.",
      });
    }

    const currentQuestion =
      interview.questions[
        interview.currentQuestionIndex
      ];

    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Current question not found.",
      });
    }

    // ----------------------------------------------
    // Prevent duplicate submission
    // ----------------------------------------------

    if (
      currentQuestion.answeredAt
    ) {
      return res.status(200).json({
        success: true,

        message:
          "This question has already been evaluated.",

        evaluation: {
          score:
            currentQuestion.score,

          confidence:
            currentQuestion.confidence,

          communication:
            currentQuestion.communication,

          correctness:
            currentQuestion.correctness,

          feedback:
            currentQuestion.feedback,
        },
      });
    }

    // ----------------------------------------------
    // Evaluate answer
    // ----------------------------------------------

    const evaluation =
      await evaluateInterviewAnswer({
        role:
          interview.role,

        experience:
          interview.experience,

        mode:
          interview.mode,

        question:
          currentQuestion.question,

        answer:
          answer.trim(),

        resumeText:
          interview.resumeText,
      });

    currentQuestion.answer =
      answer.trim();

    currentQuestion.feedback =
      evaluation?.feedback || "";

    currentQuestion.score =
      Number(
        evaluation?.score
      ) || 0;

    currentQuestion.confidence =
      Number(
        evaluation?.confidence
      ) || 0;

    currentQuestion.communication =
      Number(
        evaluation?.communication
      ) || 0;

    currentQuestion.correctness =
      Number(
        evaluation?.correctness
      ) || 0;

    currentQuestion.answeredAt =
      new Date();

    await interview.save();

    return res.status(200).json({
      success: true,

      message:
        "Answer evaluated successfully.",

      evaluation: {
        score:
          currentQuestion.score,

        confidence:
          currentQuestion.confidence,

        communication:
          currentQuestion.communication,

        correctness:
          currentQuestion.correctness,

        feedback:
          currentQuestion.feedback,
      },

      timeTaken,
    });
  } catch (error) {
    console.error(
      "Submit Interview Answer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to evaluate interview answer.",
      error: error.message,
    });
  }
};

// ======================================================
// GENERATE NEXT QUESTION
// ======================================================

const generateNextQuestion = async (
  req,
  res
) => {
  try {
    const { interviewId } =
      req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message:
          "Interview ID is required.",
      });
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    // ----------------------------------------------
    // Already completed
    // ----------------------------------------------

    if (
      interview.status ===
      "completed"
    ) {
      return res.status(200).json({
        success: true,

        interviewCompleted: true,

        message:
          "Interview has already been completed.",

        report:
          buildInterviewReport(
            interview
          ),
      });
    }

    if (
      interview.status !==
      "in-progress"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This interview is no longer active.",
      });
    }

    const currentQuestion =
      interview.questions[
        interview.currentQuestionIndex
      ];

    if (!currentQuestion) {
      return res.status(404).json({
        success: false,
        message:
          "Current question not found.",
      });
    }

    // The current question must be answered
    // before generating another one.
    if (
      !currentQuestion.answeredAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please submit the current answer first.",
      });
    }

    const nextIndex =
      interview.currentQuestionIndex +
      1;

    // ----------------------------------------------
    // ALL QUESTIONS COMPLETED
    // ----------------------------------------------

    if (
      nextIndex >=
      interview.totalQuestions
    ) {
      interview.status =
        "completed";

      interview.completedAt =
        new Date();

      calculateInterviewScores(
        interview
      );

      await interview.save();

      return res.status(200).json({
        success: true,

        interviewCompleted: true,

        message:
          "All interview questions have been completed.",

        report:
          buildInterviewReport(
            interview
          ),
      });
    }

    // ----------------------------------------------
    // Generate next adaptive question
    // ----------------------------------------------

    const previousQuestions =
      interview.questions.map(
        (item) =>
          item.question
      );

    const previousAnswers =
      interview.questions
        .filter(
          (item) =>
            item.answer
        )
        .map(
          (item) =>
            item.answer
        );

    const previousFeedback =
      interview.questions
        .filter(
          (item) =>
            item.feedback
        )
        .map(
          (item) =>
            item.feedback
        );

    const questionData =
      await generateInterviewQuestion({
        role:
          interview.role,

        experience:
          interview.experience,

        mode:
          interview.mode,

        resumeText:
          interview.resumeText,

        previousQuestions,

        previousAnswer:
          previousAnswers[
            previousAnswers.length - 1
          ] || "",

        previousFeedback:
          previousFeedback[
            previousFeedback.length - 1
          ] || "",

        questionNumber:
          nextIndex + 1,
      });

    const nextQuestion = {
      question:
        questionData?.question ||
        "Tell me about a recent project you worked on.",

      difficulty:
        questionData?.difficulty ||
        "medium",

      timeLimit:
        Number(
          questionData?.timeLimit
        ) || 90,
    };

    interview.questions.push(
      nextQuestion
    );

    interview.currentQuestionIndex =
      nextIndex;

    await interview.save();

    const savedQuestion =
      interview.questions[
        interview.currentQuestionIndex
      ];

    return res.status(200).json({
      success: true,

      interviewCompleted: false,

      interview: {
        id:
          interview._id,

        currentQuestionIndex:
          interview.currentQuestionIndex,

        totalQuestions:
          interview.totalQuestions,

        status:
          interview.status,
      },

      question: {
        id:
          savedQuestion._id,

        // 1-indexed question number.
        questionNumber:
          nextIndex + 1,

        question:
          savedQuestion.question,

        difficulty:
          savedQuestion.difficulty,

        timeLimit:
          savedQuestion.timeLimit,

        answer:
          savedQuestion.answer,
      },
    });
  } catch (error) {
    console.error(
      "Generate Next Question Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate next interview question.",
      error: error.message,
    });
  }
};

// ======================================================
// FINISH INTERVIEW
// ======================================================

const finishInterview = async (
  req,
  res
) => {
  try {
    const { interviewId } =
      req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message:
          "Interview ID is required.",
      });
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    // ----------------------------------------------
    // Finish should be idempotent.
    // ----------------------------------------------

    if (
      interview.status ===
      "completed"
    ) {
      return res.status(200).json({
        success: true,

        message:
          "Interview already completed.",

        report:
          buildInterviewReport(
            interview
          ),
      });
    }

    // ----------------------------------------------
    // Calculate scores
    // ----------------------------------------------

    calculateInterviewScores(
      interview
    );

    interview.status =
      "completed";

    interview.completedAt =
      new Date();

    await interview.save();

    return res.status(200).json({
      success: true,

      message:
        "Interview completed successfully.",

      report:
        buildInterviewReport(
          interview
        ),
    });
  } catch (error) {
    console.error(
      "Finish Interview Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to finish the interview.",
      error: error.message,
    });
  }
};

// ======================================================
// GET INTERVIEW REPORT
// ======================================================

const getInterviewReport = async (
  req,
  res
) => {
  try {
    const { interviewId } =
      req.params;

    const interview =
      await Interview.findOne({
        _id: interviewId,
        userId: req.user._id,
      });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    return res.status(200).json({
      success: true,

      report:
        buildInterviewReport(
          interview
        ),
    });
  } catch (error) {
    console.error(
      "Get Interview Report Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load interview report.",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY INTERVIEW HISTORY
// ======================================================

const getMyInterviews = async (
  req,
  res
) => {
  try {
    const interviews =
      await Interview.find({
        userId: req.user._id,
      })
        .sort({
          createdAt: -1,
        })
        .select(
          "-resumeText -questions.answer"
        );

    return res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.error(
      "Get Interview History Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load interview history.",
      error: error.message,
    });
  }
};

// ======================================================
// CALCULATE INTERVIEW SCORES
// ======================================================

const calculateInterviewScores = (
  interview
) => {
  const answeredQuestions =
    interview.questions.filter(
      (question) =>
        question.answeredAt
    );

  if (
    answeredQuestions.length === 0
  ) {
    interview.finalScore = 0;

    interview.confidenceScore = 0;

    interview.communicationScore = 0;

    interview.correctnessScore = 0;

    return;
  }

  const totalScore =
    answeredQuestions.reduce(
      (sum, question) =>
        sum +
        (question.score || 0),
      0
    );

  const totalConfidence =
    answeredQuestions.reduce(
      (sum, question) =>
        sum +
        (question.confidence || 0),
      0
    );

  const totalCommunication =
    answeredQuestions.reduce(
      (sum, question) =>
        sum +
        (question.communication || 0),
      0
    );

  const totalCorrectness =
    answeredQuestions.reduce(
      (sum, question) =>
        sum +
        (question.correctness || 0),
      0
    );

  const count =
    answeredQuestions.length;

  interview.finalScore =
    Number(
      (
        totalScore / count
      ).toFixed(1)
    );

  interview.confidenceScore =
    Number(
      (
        totalConfidence / count
      ).toFixed(1)
    );

  interview.communicationScore =
    Number(
      (
        totalCommunication / count
      ).toFixed(1)
    );

  interview.correctnessScore =
    Number(
      (
        totalCorrectness / count
      ).toFixed(1)
    );
};

// ======================================================
// BUILD REPORT
// ======================================================

const buildInterviewReport = (
  interview
) => {
  return {
    interviewId:
      interview._id,

    role:
      interview.role,

    experience:
      interview.experience,

    mode:
      interview.mode,

    totalQuestions:
      interview.totalQuestions,

    answeredQuestions:
      interview.questions.filter(
        (question) =>
          question.answeredAt
      ).length,

    finalScore:
      interview.finalScore,

    confidenceScore:
      interview.confidenceScore,

    communicationScore:
      interview.communicationScore,

    correctnessScore:
      interview.correctnessScore,

    questions:
      interview.questions,

    status:
      interview.status,

    startedAt:
      interview.startedAt,

    completedAt:
      interview.completedAt,
  };
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createInterview,
  analyzeInterviewResume,
  getCurrentQuestion,
  submitInterviewAnswer,
  generateNextQuestion,
  finishInterview,
  getInterviewReport,
  getMyInterviews,
};