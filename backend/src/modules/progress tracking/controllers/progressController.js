// =====================================================
// PrepNova - Progress Tracking - Controller
// =====================================================

const ProgressProfile = require("../models/ProgressProfile");

const { fetchGithubStats } = require("../services/githubService");
const { fetchLeetcodeStats } = require("../services/leetcodeService");
const { fetchCodeforcesStats } = require("../services/codeforcesService");
const { fetchCodechefStats } = require("../services/codechefService");

// Map platform name -> the function that fetches its stats.
// This lets connect/refresh share one code path instead of
// writing an if/else chain for every platform.
const platformFetchers = {
  github: fetchGithubStats,
  leetcode: fetchLeetcodeStats,
  codeforces: fetchCodeforcesStats,
  codechef: fetchCodechefStats,
};

// Helper: get the logged-in user's progress document,
// creating an empty one the first time they visit the page.
const getOrCreateProfile = async (userId) => {
  let profile = await ProgressProfile.findOne({ user: userId });

  if (!profile) {
    profile = await ProgressProfile.create({ user: userId });
  }

  return profile;
};

// =====================================================
// GET /api/progress
// Returns the logged-in user's saved profile + stats
// =====================================================
const getProgress = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get Progress Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load progress data.",
    });
  }
};

// =====================================================
// POST /api/progress/connect
// Body: { platform, username }
// Saves a username for a platform and fetches its stats
// =====================================================
const connectPlatform = async (req, res) => {
  try {
    const { platform, username } = req.body;

    if (!platform || !username) {
      return res.status(400).json({
        success: false,
        message: "Platform and username are required.",
      });
    }

    const fetchStats = platformFetchers[platform];

    if (!fetchStats) {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    // fetch fresh stats BEFORE saving, so a wrong username
    // never gets written to the database
    const stats = await fetchStats(username.trim());

    const profile = await getOrCreateProfile(req.user._id);

    profile[platform] = {
      username: username.trim(),
      stats,
      lastSynced: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile[platform],
    });
  } catch (error) {
    console.error("Connect Platform Error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to connect profile.",
    });
  }
};

// =====================================================
// PUT /api/progress/refresh/:platform
// Re-fetches stats for an already-connected platform
// =====================================================
const refreshPlatform = async (req, res) => {
  try {
    const { platform } = req.params;
    const fetchStats = platformFetchers[platform];

    if (!fetchStats) {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    const profile = await getOrCreateProfile(req.user._id);
    const existing = profile[platform];

    if (!existing || !existing.username) {
      return res.status(400).json({
        success: false,
        message: "No username connected for this platform yet.",
      });
    }

    const stats = await fetchStats(existing.username);

    profile[platform].stats = stats;
    profile[platform].lastSynced = new Date();

    await profile.save();

    res.status(200).json({
      success: true,
      data: profile[platform],
    });
  } catch (error) {
    console.error("Refresh Platform Error:", error.message);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to refresh stats.",
    });
  }
};

// =====================================================
// DELETE /api/progress/:platform
// Removes a platform's saved username + stats
// =====================================================
const disconnectPlatform = async (req, res) => {
  try {
    const { platform } = req.params;

    if (!platformFetchers[platform]) {
      return res.status(400).json({
        success: false,
        message: "Unsupported platform.",
      });
    }

    const profile = await getOrCreateProfile(req.user._id);

    profile[platform] = {
      username: null,
      stats: null,
      lastSynced: null,
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile disconnected.",
    });
  } catch (error) {
    console.error("Disconnect Platform Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to disconnect profile.",
    });
  }
};

module.exports = {
  getProgress,
  connectPlatform,
  refreshPlatform,
  disconnectPlatform,
};
