// =====================================================
// PrepNova - Progress Tracking - Routes
// =====================================================

const express = require("express");
const router = express.Router();

// re-using the exact same auth middleware as the rest of the app
const { verifyToken } = require("../../auth/authMiddleware");

const {
  getProgress,
  connectPlatform,
  refreshPlatform,
  disconnectPlatform,
} = require("../controllers/progressController");

// every route below requires the user to be logged in
router.use(verifyToken);

// GET /api/progress -> get saved profile + stats for all 4 platforms
router.get("/", getProgress);

// POST /api/progress/connect -> save + fetch stats for one platform
router.post("/connect", connectPlatform);

// PUT /api/progress/refresh/:platform -> re-fetch stats for one platform
router.put("/refresh/:platform", refreshPlatform);

// DELETE /api/progress/:platform -> disconnect one platform
router.delete("/:platform", disconnectPlatform);

module.exports = router;
