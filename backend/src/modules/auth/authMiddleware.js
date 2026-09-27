// =====================================================
// PrepNova - Authentication Middleware
// =====================================================

const jwt = require("jsonwebtoken");

const User = require("./userModel");

// =====================================================
// Verify JWT Token
// =====================================================

const verifyToken = async (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user from database
    const user = await User.findById(decoded.userId).select(
      "-password"
    );

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to next controller
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = {
  verifyToken,
};