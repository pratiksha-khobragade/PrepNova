// =====================================================
// PrepNova - User Model
// =====================================================

const mongoose = require("mongoose");

// Define how a user will be stored in MongoDB
const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC USER INFORMATION
    // =====================================================

    // User's first name
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    // User's last name
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Will be used for Google authentication
    googleId: {
      type: String,
      default: null,
    },

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    /*
      profileImageType tells us what the user selected:

      "custom" -> User uploaded their own image
      "avatar" -> User selected one of our avatars
      null     -> No profile image selected yet
    */
    profileImageType: {
      type: String,
      enum: ["custom", "avatar", null],
      default: null,
    },

    /*
      Stores the path/URL of a custom uploaded image.

      Example:
      /uploads/profile-images/user-image.jpg
    */
    profileImage: {
      type: String,
      default: null,
    },

    /*
      Stores the identifier of the selected built-in avatar.

      Example:
      "boy-1"
      "boy-2"
      "girl-1"
      "girl-2"

      The actual avatar images will be handled separately.
    */
    selectedAvatar: {
      type: String,
      default: null,
    },
  },
  {
    // Automatically creates createdAt and updatedAt
    timestamps: true,
  }
);

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;