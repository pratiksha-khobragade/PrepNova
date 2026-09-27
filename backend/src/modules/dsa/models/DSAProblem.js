// =====================================================
// PrepNova - DSA Problem Model
// =====================================================

const mongoose = require("mongoose");

// =====================================================
// Test Case Schema
// =====================================================

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },

    output: {
      type: String,
      required: true,
    },

    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// Starter Code Schema
// =====================================================

const starterCodeSchema = new mongoose.Schema(
  {
    JavaScript: {
      type: String,
      default: "",
    },

    Java: {
      type: String,
      default: "",
    },

    Python: {
      type: String,
      default: "",
    },

    "C++": {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// Example Schema
// =====================================================

const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    output: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

// =====================================================
// DSA Problem Schema
// =====================================================

const dsaProblemSchema = new mongoose.Schema(
  {
    // Frontend-friendly numeric problem ID
    problemId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    // Problem title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Difficulty
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // Problem description
    description: {
      type: String,
      required: true,
    },

    // Topics
    topics: {
      type: [String],
      default: [],
    },

    // Example
    example: {
      type: exampleSchema,
      default: () => ({}),
    },

    // Constraints
    constraints: {
      type: [String],
      default: [],
    },

    // Test cases
    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    // Starter code
    starterCode: {
      type: starterCodeSchema,
      default: () => ({}),
    },

    // =================================================
    // Code Runner Configuration
    // =================================================

    runner: {
      type: String,
      enum: [
        "twoSum",
        "validParentheses",
        "bestTimeToBuyAndSellStock",
        "binarySearch",
        "reverseLinkedList",
        "longestSubstring",
        "threeSum",
        "productExceptSelf",
        "numberOfIslands",
        "binaryTreeLevelOrder",
      ],
      required: true,
    },

    // Function name expected from student code
    functionName: {
      type: String,
      default: "solution",
      trim: true,
    },

    // Whether problem is visible
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// Model
// =====================================================

const DSAProblem = mongoose.model(
  "DSAProblem",
  dsaProblemSchema
);

module.exports = DSAProblem;