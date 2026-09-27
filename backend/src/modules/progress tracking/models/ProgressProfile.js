// =====================================================
// PrepNova - Progress Tracking - Profile Model
// =====================================================

const mongoose = require("mongoose");

// Small reusable sub-schema. Every platform (github/leetcode/
// codeforces/codechef) stores the same 3 things - a username,
// the last stats we fetched, and when we fetched them.
// "stats" is Mixed because each platform returns a different
// shape of data (see the services folder for what each one returns).
const platformSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: null,
      trim: true,
    },

    stats: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    lastSynced: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false, // this is just a nested object, it doesn't need its own id
  }
);

// One ProgressProfile document per user, holding all 4 platforms.
const progressProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    github: {
      type: platformSchema,
      default: () => ({}),
    },

    leetcode: {
      type: platformSchema,
      default: () => ({}),
    },

    codeforces: {
      type: platformSchema,
      default: () => ({}),
    },

    codechef: {
      type: platformSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProgressProfile", progressProfileSchema);
