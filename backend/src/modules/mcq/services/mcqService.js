const MCQQuestion = require("../models/MCQQuestion");
const MCQAttempt = require("../models/MCQAttempt");

// ============================================================
// GET MCQ QUESTIONS
// ============================================================

const getQuestions = async ({
  subject,
  difficulty,
  limit = 20,
} = {}) => {
  const query = {
    isActive: true,
  };

  if (subject && subject !== "All") {
    query.subject = subject;
  }

  if (difficulty && difficulty !== "All") {
    query.difficulty = difficulty;
  }

  const safeLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const questions = await MCQQuestion.find(query)
    .select("-correctAnswer -explanation")
    .sort({ createdAt: 1 })
    .limit(safeLimit)
    .lean();

  return questions;
};

// ============================================================
// GET SINGLE MCQ QUESTION
// ============================================================

const getQuestionById = async (questionId) => {
  return MCQQuestion.findOne({
    _id: questionId,
    isActive: true,
  }).lean();
};

// ============================================================
// CREATE MCQ ATTEMPT
// ============================================================

const createAttempt = async ({
  userId,
  difficulty = "All",
  questionCount = 20,
  durationMinutes = 20,
}) => {
  const query = {
    isActive: true,
  };

  if (difficulty && difficulty !== "All") {
    query.difficulty = difficulty;
  }

  const safeQuestionCount = Math.min(
    Math.max(Number(questionCount) || 20, 1),
    100
  );

  const questions = await MCQQuestion.find(query)
    .select("_id")
    .lean();

  if (questions.length === 0) {
    throw new Error(
      "No MCQ questions are available for the selected difficulty."
    );
  }

  const shuffledQuestions = [...questions].sort(
    () => Math.random() - 0.5
  );

  const selectedQuestions = shuffledQuestions.slice(
    0,
    Math.min(
      safeQuestionCount,
      shuffledQuestions.length
    )
  );

  const questionIds = selectedQuestions.map(
    (question) => question._id
  );

  const selectedQuestionDetails =
    await MCQQuestion.find({
      _id: {
        $in: questionIds,
      },
      isActive: true,
    })
      .select(
        "_id question options subject topic difficulty marks"
      )
      .lean();

  const orderedQuestions = questionIds
    .map((id) =>
      selectedQuestionDetails.find(
        (question) =>
          String(question._id) === String(id)
      )
    )
    .filter(Boolean);

  const totalMarks = orderedQuestions.reduce(
    (total, question) =>
      total + (question.marks || 1),
    0
  );

  const safeDuration = Math.min(
    Math.max(Number(durationMinutes) || 20, 1),
    180
  );

  const attempt = await MCQAttempt.create({
    user: userId,
    questions: orderedQuestions.map(
      (question) => question._id
    ),
    answers: [],
    totalQuestions: orderedQuestions.length,
    totalMarks,
    obtainedMarks: 0,
    percentage: 0,
    difficulty: difficulty || "All",
    durationMinutes: safeDuration,
    timeTakenSeconds: 0,
    status: "in-progress",
    startedAt: new Date(),
  });

  return {
    attempt,
    questions: orderedQuestions,
  };
};

// ============================================================
// GET MCQ ATTEMPT
// ============================================================

const getAttemptById = async ({
  attemptId,
  userId,
}) => {
  return MCQAttempt.findOne({
    _id: attemptId,
    user: userId,
  }).lean();
};

// ============================================================
// GET COMPLETE MCQ RESULT
//
// This endpoint is specifically for the result page.
//
// It returns:
// - Attempt statistics
// - User answers
// - Question text
// - Options
// - Subject
// - Topic
// - Difficulty
// - Explanation
//
// Correct answers are NOT taken from the question response.
// They come from the saved attempt.answers.
// ============================================================

const getAttemptResult = async ({
  attemptId,
  userId,
}) => {
  const attempt = await MCQAttempt.findOne({
    _id: attemptId,
    user: userId,
  }).lean();

  if (!attempt) {
    throw new Error("MCQ attempt not found.");
  }

  const questionIds = attempt.questions || [];

  if (questionIds.length === 0) {
    return {
      attempt,
      questions: [],
    };
  }

  const questionDocuments =
    await MCQQuestion.find({
      _id: {
        $in: questionIds,
      },
      isActive: true,
    })
      .select(
        "_id question options subject topic difficulty marks explanation"
      )
      .lean();

  // Preserve the exact order in which
  // questions appeared in the test.
  const orderedQuestions = questionIds
    .map((questionId) =>
      questionDocuments.find(
        (question) =>
          String(question._id) ===
          String(questionId)
      )
    )
    .filter(Boolean);

  return {
    attempt,
    questions: orderedQuestions,
  };
};

// ============================================================
// GET MCQ HISTORY
// ============================================================

const getMCQHistory = async ({
  userId,
  limit = 50,
} = {}) => {
  const safeLimit = Math.min(
    Math.max(Number(limit) || 50, 1),
    100
  );

  const attempts = await MCQAttempt.find({
    user: userId,
  })
    .select(
      [
        "_id",
        "totalQuestions",
        "attemptedQuestions",
        "correctAnswers",
        "wrongAnswers",
        "skippedQuestions",
        "totalMarks",
        "obtainedMarks",
        "percentage",
        "difficulty",
        "durationMinutes",
        "timeTakenSeconds",
        "status",
        "startedAt",
        "submittedAt",
        "createdAt",
      ].join(" ")
    )
    .sort({
      createdAt: -1,
    })
    .limit(safeLimit)
    .lean();

  return attempts;
};

// ============================================================
// SUBMIT MCQ TEST
// ============================================================

const submitAttempt = async ({
  attemptId,
  userId,
  answers = [],
  timeTakenSeconds = 0,
  autoSubmitted = false,
}) => {
  const attempt = await MCQAttempt.findOne({
    _id: attemptId,
    user: userId,
  });

  if (!attempt) {
    throw new Error("MCQ attempt not found.");
  }

  if (attempt.status !== "in-progress") {
    throw new Error(
      "This MCQ attempt has already been submitted."
    );
  }

  const questionIds = attempt.questions;

  const questions = await MCQQuestion.find({
    _id: {
      $in: questionIds,
    },
    isActive: true,
  }).lean();

  const submittedAnswers = Array.isArray(answers)
    ? answers
    : [];

  const answerMap = new Map();

  submittedAnswers.forEach((answer) => {
    if (answer && answer.questionId) {
      answerMap.set(
        String(answer.questionId),
        answer.selectedAnswer ?? null
      );
    }
  });

  const evaluatedAnswers = [];

  let attemptedQuestions = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  let skippedQuestions = 0;
  let obtainedMarks = 0;

  for (const question of questions) {
    const questionId = String(question._id);

    const selectedAnswer = answerMap.has(questionId)
      ? answerMap.get(questionId)
      : null;

    const hasAnswer =
      selectedAnswer !== null &&
      selectedAnswer !== undefined &&
      String(selectedAnswer).trim() !== "";

    const isCorrect =
      hasAnswer &&
      String(selectedAnswer).trim() ===
        String(question.correctAnswer).trim();

    let marksObtained = 0;

    if (!hasAnswer) {
      skippedQuestions++;
    } else {
      attemptedQuestions++;

      if (isCorrect) {
        correctAnswers++;

        marksObtained =
          question.marks || 1;

        obtainedMarks += marksObtained;
      } else {
        wrongAnswers++;
      }
    }

    evaluatedAnswers.push({
      question: question._id,
      selectedAnswer: hasAnswer
        ? String(selectedAnswer)
        : null,
      correctAnswer: question.correctAnswer,
      isCorrect,
      marksObtained,
    });
  }

  const percentage =
    attempt.totalMarks > 0
      ? Math.round(
          (obtainedMarks /
            attempt.totalMarks) *
            100
        )
      : 0;

  const safeTimeTaken = Math.max(
    Number(timeTakenSeconds) || 0,
    0
  );

  attempt.answers = evaluatedAnswers;

  attempt.attemptedQuestions =
    attemptedQuestions;

  attempt.correctAnswers =
    correctAnswers;

  attempt.wrongAnswers =
    wrongAnswers;

  attempt.skippedQuestions =
    skippedQuestions;

  attempt.obtainedMarks =
    obtainedMarks;

  attempt.percentage =
    percentage;

  attempt.timeTakenSeconds =
    safeTimeTaken;

  attempt.status = autoSubmitted
    ? "auto-submitted"
    : "completed";

  attempt.submittedAt =
    new Date();

  await attempt.save();

  return attempt;
};

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getQuestions,
  getQuestionById,
  createAttempt,
  getAttemptById,
  getAttemptResult,
  getMCQHistory,
  submitAttempt,
};