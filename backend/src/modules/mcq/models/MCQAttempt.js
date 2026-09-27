const mongoose = require("mongoose");

const mcqAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MCQQuestion",
      required: true,
    },

    selectedAnswer: {
      type: String,
      trim: true,
      default: null,
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    marksObtained: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const mcqAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    questions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MCQQuestion",
        },
      ],
      required: true,
      validate: {
        validator: function (questions) {
          return (
            Array.isArray(questions) &&
            questions.length > 0
          );
        },
        message:
          "An attempt must contain at least one question.",
      },
    },

    answers: {
      type: [mcqAnswerSchema],
      default: [],
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },

    attemptedQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    skippedQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    obtainedMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    difficulty: {
      type: String,
      enum: ["All", "Easy", "Medium", "Hard"],
      default: "All",
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "in-progress",
        "completed",
        "auto-submitted",
      ],
      default: "in-progress",
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

mcqAttemptSchema.index({
  user: 1,
  createdAt: -1,
});

mcqAttemptSchema.index({
  user: 1,
  status: 1,
});

const MCQAttempt = mongoose.model(
  "MCQAttempt",
  mcqAttemptSchema
);

module.exports = MCQAttempt;