const mongoose = require("mongoose");

const mcqQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return (
            Array.isArray(options) &&
            options.length === 4 &&
            options.every(
              (option) =>
                typeof option === "string" &&
                option.trim().length > 0
            )
          );
        },
        message:
          "An MCQ must contain exactly 4 non-empty options.",
      },
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

    explanation: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "OOP",
        "Data Structures",
        "Algorithms",
      ],
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    marks: {
      type: Number,
      default: 1,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Validate that correctAnswer exists inside options.
// IMPORTANT: No next() callback is used.
mcqQuestionSchema.pre("validate", function () {
  if (
    Array.isArray(this.options) &&
    this.correctAnswer &&
    !this.options.includes(this.correctAnswer)
  ) {
    throw new Error(
      "Correct answer must match one of the provided options."
    );
  }
});

mcqQuestionSchema.index({
  subject: 1,
  difficulty: 1,
});

mcqQuestionSchema.index({
  topic: 1,
});

mcqQuestionSchema.index({
  isActive: 1,
});

const MCQQuestion =
  mongoose.models.MCQQuestion ||
  mongoose.model(
    "MCQQuestion",
    mcqQuestionSchema
  );

module.exports = MCQQuestion;