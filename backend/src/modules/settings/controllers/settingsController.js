// =====================================================
// PrepNova - Settings Controller
// =====================================================

const {
  getUserProfile,
  updateProfile,
  updateAvatar,
  updateProfileImage,
  removeProfileImage,
  changePassword,
  deleteAccount,
} = require("../services/settingsService");


// =====================================================
// Get Profile
// =====================================================

const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(
      req.user._id || req.user.id
    );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "Get Profile Error:",
      error.message
    );

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Update Profile
// =====================================================

const updateUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
    } = req.body;

    const user = await updateProfile(
      req.user._id || req.user.id,
      {
        firstName,
        lastName,
        email,
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      data: user,
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Select Avatar
// =====================================================

const selectAvatar = async (req, res) => {
  try {
    const { avatarName } = req.body;

    const user = await updateAvatar(
      req.user._id || req.user.id,
      avatarName
    );

    return res.status(200).json({
      success: true,
      message:
        "Avatar selected successfully.",
      data: user,
    });
  } catch (error) {
    console.error(
      "Select Avatar Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Upload Profile Image
// =====================================================

const uploadProfileImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select an image.",
      });
    }

    const user =
      await updateProfileImage(
        req.user._id || req.user.id,
        `/uploads/profile-images/${req.file.filename}`
      );

    return res.status(200).json({
      success: true,
      message:
        "Profile image uploaded successfully.",
      data: user,
    });
  } catch (error) {
    console.error(
      "Upload Profile Image Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Remove Profile Image
// =====================================================

const removeImage = async (
  req,
  res
) => {
  try {
    const user =
      await removeProfileImage(
        req.user._id || req.user.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Profile image removed successfully.",
      data: user,
    });
  } catch (error) {
    console.error(
      "Remove Profile Image Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Change Password
// =====================================================

const updatePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    await changePassword(
      req.user._id || req.user.id,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Delete Account
// =====================================================

const removeAccount = async (
  req,
  res
) => {
  try {
    const { password } = req.body;

    await deleteAccount(
      req.user._id || req.user.id,
      password
    );

    return res.status(200).json({
      success: true,
      message:
        "Account deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Account Error:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// Export
// =====================================================

module.exports = {
  getProfile,
  updateUserProfile,
  selectAvatar,
  uploadProfileImage,
  removeImage,
  updatePassword,
  removeAccount,
};