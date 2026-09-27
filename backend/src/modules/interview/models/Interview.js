const mongoose = require("mongoose");

/* =========================================================
   INTERVIEW QUESTION
========================================================= */

const interviewQuestionSchema =
  new mongoose.Schema(
    {
      question: {
        type: String,
        required: true,
        trim: true,
      },

      difficulty: {
        type: String,
        enum: [
          "easy",
          "medium",
          "hard",
        ],
        default: "medium",
      },

      timeLimit: {
        type: Number,
        default: 90,
        min: 30,
      },

      answer: {
        type: String,
        default: "",
      },

      feedback: {
        type: String,
        default: "",
      },

      score: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      communication: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      correctness: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      answeredAt: {
        type: Date,
        default: null,
      },
    },
    {
      _id: true,
    }
  );

/* =========================================================
   INTERVIEW
========================================================= */

const interviewSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      role: {
        type: String,
        required: true,
        trim: true,
      },

      experience: {
        type: String,
        required: true,
        trim: true,
      },

      mode: {
        type: String,

        enum: [
          "Technical",
          "HR",
        ],

        required: true,
      },

      resumeText: {
        type: String,
        default: "",
      },

      questions: {
        type: [
          interviewQuestionSchema,
        ],

        default: [],
      },

      currentQuestionIndex: {
        type: Number,
        default: 0,
        min: 0,
      },

      totalQuestions: {
        type: Number,
        default: 5,
        min: 1,
      },

      finalScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      confidenceScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      communicationScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      correctnessScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      status: {
        type: String,

        enum: [
          "in-progress",
          "completed",
          "abandoned",
        ],

        default: "in-progress",

        index: true,
      },

      startedAt: {
        type: Date,
        default: Date.now,
      },

      completedAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Interview",
    interviewSchema
  );