// =====================================================
// PrepNova - Settings Service
// =====================================================

const bcrypt = require("bcryptjs");

const User = require("../../auth/userModel");


// =====================================================
// Get User Profile
// =====================================================

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "-password"
  );

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};


// =====================================================
// Update Profile Information
// =====================================================

const updateProfile = async (
  userId,
  {
    firstName,
    lastName,
    email,
  }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Update first name
  if (firstName !== undefined) {
    const trimmedFirstName =
      firstName.trim();

    if (!trimmedFirstName) {
      throw new Error(
        "First name cannot be empty."
      );
    }

    user.firstName = trimmedFirstName;
  }

  // Update last name
  if (lastName !== undefined) {
    const trimmedLastName =
      lastName.trim();

    if (!trimmedLastName) {
      throw new Error(
        "Last name cannot be empty."
      );
    }

    user.lastName = trimmedLastName;
  }

  // Update email
  if (email !== undefined) {
    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error(
        "Email cannot be empty."
      );
    }

    // Check whether another account
    // already uses this email
    const existingUser =
      await User.findOne({
        email: normalizedEmail,
        _id: { $ne: userId },
      });

    if (existingUser) {
      throw new Error(
        "An account with this email already exists."
      );
    }

    user.email = normalizedEmail;
  }

  await user.save();

  return await User.findById(userId).select(
    "-password"
  );
};


// =====================================================
// Select Built-in Avatar
// =====================================================

const updateAvatar = async (
  userId,
  avatarName
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!avatarName) {
    throw new Error(
      "Avatar is required."
    );
  }

  const allowedAvatars = [
    "boy-1",
    "boy-2",
    "boy-3",
    "boy-4",
    "boy-5",
    "girl-1",
    "girl-2",
    "girl-3",
    "girl-4",
    "girl-5",
  ];

  if (!allowedAvatars.includes(avatarName)) {
    throw new Error(
      "Invalid avatar selected."
    );
  }

  user.selectedAvatar = avatarName;

  user.profileImageType = "avatar";

  // Remove custom image when
  // selecting a built-in avatar
  user.profileImage = null;

  await user.save();

  return await User.findById(userId).select(
    "-password"
  );
};


// =====================================================
// Upload Custom Profile Image
// =====================================================

const updateProfileImage = async (
  userId,
  imagePath
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!imagePath) {
    throw new Error(
      "Profile image is required."
    );
  }

  user.profileImage = imagePath;

  user.profileImageType = "custom";

  // Remove selected avatar when
  // uploading a custom image
  user.selectedAvatar = null;

  await user.save();

  return await User.findById(userId).select(
    "-password"
  );
};


// =====================================================
// Remove Profile Image
// =====================================================

const removeProfileImage = async (
  userId
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.profileImage = null;
  user.selectedAvatar = null;
  user.profileImageType = null;

  await user.save();

  return await User.findById(userId).select(
    "-password"
  );
};


// =====================================================
// Change Password
// =====================================================

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!currentPassword || !newPassword) {
    throw new Error(
      "Current password and new password are required."
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "New password must be at least 6 characters long."
    );
  }

  // Check current password
  const isPasswordCorrect =
    await bcrypt.compare(
      currentPassword,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new Error(
      "Current password is incorrect."
    );
  }

  // Prevent using the same password
  const isSamePassword =
    await bcrypt.compare(
      newPassword,
      user.password
    );

  if (isSamePassword) {
    throw new Error(
      "New password must be different from your current password."
    );
  }

  // Hash new password
  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      12
    );

  user.password = hashedPassword;

  await user.save();
};


// =====================================================
// Delete Account
// =====================================================

const deleteAccount = async (
  userId,
  password
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!password) {
    throw new Error(
      "Password is required to delete your account."
    );
  }

  // Verify password before deletion
  const isPasswordCorrect =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordCorrect) {
    throw new Error(
      "Incorrect password."
    );
  }

  await User.findByIdAndDelete(userId);
};


// =====================================================
// Export
// =====================================================

module.exports = {
  getUserProfile,
  updateProfile,
  updateAvatar,
  updateProfileImage,
  removeProfileImage,
  changePassword,
  deleteAccount,
};