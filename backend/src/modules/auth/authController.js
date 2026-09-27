// =====================================================
// PrepNova - Authentication Controller
// =====================================================

const {
  signupUser,
  loginUser,
  googleLoginUser,
} = require("./authService");

// =====================================================
// Signup Controller
// =====================================================

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    // Check required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long.",
      });
    }

    // Create user
    const result = await signupUser({
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Signup Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Login Controller
// =====================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // Login user
    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Google Login Controller
// =====================================================

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Check Google credential
    if (!credential) {
      return res.status(400).json({
        success: false,
        message:
          "Google credential is required.",
      });
    }

    // Verify Google credential and login
    const result =
      await googleLoginUser(credential);

    return res.status(200).json({
      success: true,
      message:
        "Google login successful.",
      data: result,
    });
  } catch (error) {
    console.error(
      "Google Login Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        error.message ||
        "Google login failed.",
    });
  }
};

// =====================================================
// Get Current Logged-In User
// =====================================================

const getCurrentUser = async (
  req,
  res
) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get current user.",
    });
  }
};

// =====================================================
// Export Controllers
// =====================================================

module.exports = {
  signup,
  login,
  googleLogin,
  getCurrentUser,
};