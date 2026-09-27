// =====================================================
// PrepNova - DSA Authentication Middleware
// =====================================================

const {
  verifyToken,
} = require("../../auth/authMiddleware");

// Reuse the existing PrepNova authentication system.

module.exports = {
  verifyToken,
};