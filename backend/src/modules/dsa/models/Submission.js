// =====================================================
// PrepNova - DSA Submission Model
// =====================================================

const mongoose = require("mongoose");

// =====================================================
// Submission Schema
// =====================================================

const submissionSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DSAProblem",
        required: true,
        index: true,
      },

      problemId: {
        type: Number,
        required: true,
        index: true,
      },

      language: {
        type: String,
        required: true,
        enum: [
          "JavaScript",
          "Python",
          "Java",
          "C++",
        ],
      },

      code: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        required: true,
        enum: [
          "accepted",
          "wrong_answer",
          "compilation_error",
          "runtime_error",
          "time_limit",
          "error",
        ],
      },

      runtime: {
        type: String,
        default: null,
      },

      memory: {
        type: String,
        default: null,
      },

      output: {
        type: String,
        default: "",
      },

      expected: {
        type: String,
        default: "",
      },

      errorMessage: {
        type: String,
        default: "",
      },

      passedTestCases: {
        type: Number,
        default: 0,
      },

      totalTestCases: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

// =====================================================
// Export
// =====================================================

const Submission =
  mongoose.model(
    "Submission",
    submissionSchema
  );

module.exports = Submission;