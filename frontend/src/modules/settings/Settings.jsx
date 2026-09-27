import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getProfile,
  updateProfile,
  selectAvatar,
  uploadProfileImage,
  removeProfileImage,
  changePassword,
  deleteAccount,
} from "../../api/settingsApi";

import "./Settings.css";

// Local avatar images
import boy1 from "../../../images/boy1.png";
import boy2 from "../../../images/boy2.png";
import boy3 from "../../../images/boy3.png";
import boy4 from "../../../images/boy4.png";
import boy5 from "../../../images/boy5.png";

import girl1 from "../../../images/girl1.png";
import girl2 from "../../../images/girl2.png";
import girl3 from "../../../images/girl3.png";
import girl4 from "../../../images/girl4.png";
import girl5 from "../../../images/girl5.png";

const API_BASE_URL = "";

// =====================================================
// Avatar Configuration
// =====================================================

const BOY_AVATARS = [
  {
    id: "boy-1",
    image: boy1,
  },
  {
    id: "boy-2",
    image: boy2,
  },
  {
    id: "boy-3",
    image: boy3,
  },
  {
    id: "boy-4",
    image: boy4,
  },
  {
    id: "boy-5",
    image: boy5,
  },
];

const GIRL_AVATARS = [
  {
    id: "girl-1",
    image: girl1,
  },
  {
    id: "girl-2",
    image: girl2,
  },
  {
    id: "girl-3",
    image: girl3,
  },
  {
    id: "girl-4",
    image: girl4,
  },
  {
    id: "girl-5",
    image: girl5,
  },
];

const ALL_AVATARS = [
  ...BOY_AVATARS,
  ...GIRL_AVATARS,
];

const Settings = () => {
  const fileInputRef = useRef(null);

  // =====================================================
  // Profile
  // =====================================================

  const [profile, setProfile] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // =====================================================
  // Profile Image
  // =====================================================

  const [profileImagePreview, setProfileImagePreview] =
    useState(null);

  // =====================================================
  // Avatar
  // =====================================================

  const [selectedAvatar, setSelectedAvatar] =
    useState(null);

  // =====================================================
  // Loading States
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [selectingAvatar, setSelectingAvatar] =
    useState(false);

  // =====================================================
  // Password
  // =====================================================

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  // =====================================================
  // Delete Account
  // =====================================================

  const [deletePassword, setDeletePassword] =
    useState("");

  const [showDeletePassword, setShowDeletePassword] =
    useState(false);

  const [deletingAccount, setDeletingAccount] =
    useState(false);

  // =====================================================
  // Messages
  // =====================================================

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // Load Profile
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await getProfile();

      /*
       * Backend returns:
       *
       * {
       *   success: true,
       *   data: user
       * }
       */

      const user =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        response;

      if (!user) {
        throw new Error(
          "Unable to load profile."
        );
      }

      setProfile(user);

      setFirstName(
        user.firstName || ""
      );

      setLastName(
        user.lastName || ""
      );

      setEmail(
        user.email || ""
      );

      setSelectedAvatar(
        user.selectedAvatar || null
      );

      // Show custom uploaded image
      if (
        user.profileImageType === "custom" &&
        user.profileImage
      ) {
        const imageUrl =
          user.profileImage.startsWith("http")
            ? user.profileImage
            : `${API_BASE_URL}${user.profileImage}`;

        setProfileImagePreview(imageUrl);
      } else {
        setProfileImagePreview(null);
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Clear Messages
  // =====================================================

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // =====================================================
  // Save Profile
  // =====================================================

  const handleSaveProfile = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    try {
      setSavingProfile(true);

      const response =
        await updateProfile({
          firstName,
          lastName,
          email,
        });

      const updatedUser =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        response;

      setProfile((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setSuccessMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // =====================================================
  // Select Avatar
  // =====================================================

  const handleSelectAvatar = async (
    avatarId
  ) => {
    clearMessages();

    try {
      setSelectingAvatar(true);

      const response =
        await selectAvatar(avatarId);

      const updatedUser =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        response;

      setSelectedAvatar(avatarId);

      // Avatar becomes active instead of custom image
      setProfileImagePreview(null);

      setProfile((previous) => ({
        ...previous,
        ...updatedUser,
        profileImageType: "avatar",
        profileImage: null,
        selectedAvatar: avatarId,
      }));

      setSuccessMessage(
        "Avatar selected successfully."
      );
    } catch (error) {
      console.error(
        "Avatar selection error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to select avatar."
      );
    } finally {
      setSelectingAvatar(false);
    }
  };

  // =====================================================
  // Upload Custom Profile Image
  // =====================================================

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    clearMessages();

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    // Maximum 5 MB
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setErrorMessage(
        "Image size must be less than 5 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      // Show image immediately
      const localPreview =
        URL.createObjectURL(file);

      setProfileImagePreview(
        localPreview
      );

      const response =
        await uploadProfileImage(file);

      const updatedUser =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        response;

      let imageUrl =
        updatedUser?.profileImage ||
        response?.profileImage ||
        response?.data?.profileImage;

      if (
        imageUrl &&
        !imageUrl.startsWith("http")
      ) {
        imageUrl =
          `${API_BASE_URL}${imageUrl}`;
      }

      if (imageUrl) {
        setProfileImagePreview(
          imageUrl
        );
      }

      // Custom image becomes active
      setSelectedAvatar(null);

      setProfile((previous) => ({
        ...previous,
        ...updatedUser,
        profileImageType: "custom",
        profileImage:
          updatedUser?.profileImage ||
          response?.profileImage ||
          null,
        selectedAvatar: null,
      }));

      setSuccessMessage(
        "Profile image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      setProfileImagePreview(null);

      setErrorMessage(
        error.message ||
          "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);

      // Allow same file to be selected again
      event.target.value = "";
    }
  };

  // =====================================================
  // Remove Custom Image
  // =====================================================

  const handleRemoveImage = async () => {
    clearMessages();

    try {
      setUploadingImage(true);

      await removeProfileImage();

      setProfileImagePreview(null);

      setProfile((previous) => ({
        ...previous,
        profileImageType: null,
        profileImage: null,
      }));

      setSuccessMessage(
        "Profile image removed successfully."
      );
    } catch (error) {
      console.error(
        "Remove profile image error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to remove profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================================
  // Change Password
  // =====================================================

  const handleChangePassword = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    if (
      !currentPassword ||
      !newPassword
    ) {
      setErrorMessage(
        "Please enter your current and new password."
      );

      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage(
        "New password must contain at least 6 characters."
      );

      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      setSuccessMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "prepnova_token"
    );

    window.location.href = "/login";
  };

  // =====================================================
  // Delete Account
  // =====================================================

  const handleDeleteAccount = async (
    event
  ) => {
    event.preventDefault();

    clearMessages();

    // Password required
    if (!deletePassword.trim()) {
      setErrorMessage(
        "Please enter your password to delete your account."
      );

      return;
    }

    // First confirmation
    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete your account? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAccount(true);

      /*
       * Send password to backend.
       *
       * Backend verifies the password before
       * deleting the account.
       */
      await deleteAccount(
        deletePassword
      );

      // Clear authentication token
      localStorage.removeItem(
        "prepnova_token"
      );

      // Clear delete password from state
      setDeletePassword("");

      /*
       * Account was successfully deleted.
       * Send the user to login.
       */
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Failed to delete account."
      );

      setDeletingAccount(false);
    }
  };

  // =====================================================
  // Get Selected Avatar Image
  // =====================================================

  const getSelectedAvatarImage =
    () => {
      if (!selectedAvatar) {
        return null;
      }

      const avatar =
        ALL_AVATARS.find(
          (item) =>
            item.id ===
            selectedAvatar
        );

      return (
        avatar?.image || null
      );
    };

  // =====================================================
  // Profile Preview
  // =====================================================

  const selectedAvatarImage =
    getSelectedAvatarImage();

  const activeProfileImage =
    profileImagePreview ||
    selectedAvatarImage;

  const initials =
    `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`
      .toUpperCase() || "P";

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <main className="settings-page">
        <div className="settings-loading">
          Loading settings...
        </div>
      </main>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="settings-page">
      <div className="settings-container">

        {/* Header */}
        <div className="settings-header">
          <div>
            <h1>Settings</h1>

            <p>
              Manage your profile and
              account settings.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="settings-success">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="settings-error">
            {errorMessage}
          </div>
        )}

        {/* =================================================
            PROFILE
        ================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>Profile</h2>

              <p>
                Update your personal
                information and profile
                picture.
              </p>
            </div>
          </div>

          <div className="settings-profile-layout">

            {/* Profile Preview */}
            <div className="settings-profile-preview">

              <div className="settings-profile-avatar">
                {activeProfileImage ? (
                  <img
                    src={
                      activeProfileImage
                    }
                    alt="Profile"
                  />
                ) : (
                  <span>
                    {initials}
                  </span>
                )}
              </div>

              <h3>
                {firstName ||
                lastName
                  ? `${firstName} ${lastName}`.trim()
                  : "Your Name"}
              </h3>

              <p>
                {email ||
                  "your@email.com"}
              </p>

              <div className="settings-profile-image-actions">

                <button
                  type="button"
                  className="settings-secondary-btn"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploadingImage
                  }
                >
                  {uploadingImage
                    ? "Uploading..."
                    : "Upload Image"}
                </button>

                {profileImagePreview && (
                  <button
                    type="button"
                    className="settings-remove-image-btn"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      uploadingImage
                    }
                  >
                    Remove
                  </button>
                )}

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                style={{
                  display: "none",
                }}
              />

              <small>
                JPG, PNG or WEBP.
                Maximum 5 MB.
              </small>

            </div>

            {/* Profile Form */}
            <form
              className="settings-form"
              onSubmit={
                handleSaveProfile
              }
            >

              <div className="settings-form-row">

                <div className="settings-form-group">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={
                      firstName
                    }
                    onChange={(
                      event
                    ) =>
                      setFirstName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter first name"
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={
                      lastName
                    }
                    onChange={(
                      event
                    ) =>
                      setLastName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Enter last name"
                  />
                </div>

              </div>

              <div className="settings-form-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="Enter email"
                />
              </div>

              <button
                type="submit"
                className="settings-primary-btn"
                disabled={
                  savingProfile
                }
              >
                {savingProfile
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </form>

          </div>
        </section>

        {/* =================================================
            AVATARS
        ================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>
                Choose an Avatar
              </h2>

              <p>
                Select an avatar for
                your PrepNova profile.
              </p>
            </div>
          </div>

          {/* Boys */}
          <div className="settings-avatar-section">

            <h3>Boys</h3>

            <div className="settings-avatar-grid">

              {BOY_AVATARS.map(
                (avatar) => (
                  <button
                    key={
                      avatar.id
                    }
                    type="button"
                    className={`settings-avatar-option ${
                      selectedAvatar ===
                      avatar.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectAvatar(
                        avatar.id
                      )
                    }
                    disabled={
                      selectingAvatar
                    }
                    title="Select avatar"
                  >
                    <img
                      src={
                        avatar.image
                      }
                      alt={`Boy avatar ${avatar.id}`}
                      className="settings-avatar-image"
                    />

                    {selectedAvatar ===
                      avatar.id && (
                      <span className="settings-avatar-check">
                        ✓
                      </span>
                    )}
                  </button>
                )
              )}

            </div>
          </div>

          {/* Girls */}
          <div className="settings-avatar-section">

            <h3>Girls</h3>

            <div className="settings-avatar-grid">

              {GIRL_AVATARS.map(
                (avatar) => (
                  <button
                    key={
                      avatar.id
                    }
                    type="button"
                    className={`settings-avatar-option ${
                      selectedAvatar ===
                      avatar.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectAvatar(
                        avatar.id
                      )
                    }
                    disabled={
                      selectingAvatar
                    }
                    title="Select avatar"
                  >
                    <img
                      src={
                        avatar.image
                      }
                      alt={`Girl avatar ${avatar.id}`}
                      className="settings-avatar-image"
                    />

                    {selectedAvatar ===
                      avatar.id && (
                      <span className="settings-avatar-check">
                        ✓
                      </span>
                    )}
                  </button>
                )
              )}

            </div>
          </div>

        </section>

        {/* =================================================
            ACCOUNT & SECURITY
        ================================================== */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div>
              <h2>
                Account &amp; Security
              </h2>

              <p>
                Manage your password
                and account access.
              </p>
            </div>
          </div>

          {/* Change Password */}
          <form
            className="settings-security-form"
            onSubmit={
              handleChangePassword
            }
          >

            <h3>
              Change Password
            </h3>

            <div className="settings-form-group">

              <label htmlFor="currentPassword">
                Current Password
              </label>

              <div className="settings-password-wrapper">

                <input
                  id="currentPassword"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    currentPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setCurrentPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="settings-password-toggle"
                  onClick={() =>
                    setShowCurrentPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showCurrentPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <div className="settings-form-group">

              <label htmlFor="newPassword">
                New Password
              </label>

              <div className="settings-password-wrapper">

                <input
                  id="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    newPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setNewPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="settings-password-toggle"
                  onClick={() =>
                    setShowNewPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showNewPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <small>
                Password must contain
                at least 6 characters.
              </small>

            </div>

            <button
              type="submit"
              className="settings-primary-btn"
              disabled={
                changingPassword
              }
            >
              {changingPassword
                ? "Changing..."
                : "Change Password"}
            </button>

          </form>

          {/* Logout */}
          <div className="settings-logout-section">

            <div>
              <h3>Logout</h3>

              <p>
                Sign out of your
                PrepNova account on
                this device.
              </p>
            </div>

            <button
              type="button"
              className="settings-logout-btn"
              onClick={
                handleLogout
              }
            >
              Logout
            </button>

          </div>

        </section>

        {/* =================================================
            DANGER ZONE
        ================================================== */}

        <section className="settings-card settings-danger-card">

          <div className="settings-card-header">
            <div>
              <h2>
                Danger Zone
              </h2>

              <p>
                Permanently delete your
                PrepNova account and
                associated data.
              </p>
            </div>
          </div>

          <form
            className="settings-danger-form"
            onSubmit={
              handleDeleteAccount
            }
          >

            <div className="settings-form-group">

              <label htmlFor="deletePassword">
                Enter Password
              </label>

              <div className="settings-password-wrapper">

                <input
                  id="deletePassword"
                  type={
                    showDeletePassword
                      ? "text"
                      : "password"
                  }
                  value={
                    deletePassword
                  }
                  onChange={(
                    event
                  ) =>
                    setDeletePassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="settings-password-toggle"
                  onClick={() =>
                    setShowDeletePassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showDeletePassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="settings-delete-btn"
              disabled={
                deletingAccount ||
                !deletePassword.trim()
              }
            >
              {deletingAccount
                ? "Deleting..."
                : "Delete Account"}
            </button>

          </form>

        </section>

      </div>
    </main>
  );
};

export default Settings;