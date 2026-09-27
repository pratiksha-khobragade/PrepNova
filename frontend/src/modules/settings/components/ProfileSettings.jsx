// =====================================================
// PrepNova - Profile Settings
// =====================================================

import React, { useRef, useState } from "react";

import {
  faCamera,
  faImage,
  faUpload,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarSelector from "./AvatarSelector";

import "./ProfileSettings.css";


// =====================================================
// Profile Settings Component
// =====================================================

const ProfileSettings = ({
  profile,
  formData,
  setFormData,

  onSaveProfile,

  onSelectAvatar,
  onUploadImage,
  onRemoveImage,

  saving = false,
  uploading = false,
}) => {
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] =
    useState(null);


  // ===================================================
  // Handle Input Change
  // ===================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // ===================================================
  // Handle Custom Image Selection
  // ===================================================

  const handleImageChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    // Only allow image files
    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }


    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Profile image must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }


    // Create local preview
    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);


    try {
      await onUploadImage(file);
    } catch (error) {
      setImagePreview(null);
    }


    // Allow selecting the same file again
    event.target.value = "";
  };


  // ===================================================
  // Get Current Profile Image
  // ===================================================

  const getCurrentImage = () => {
    if (imagePreview) {
      return imagePreview;
    }


    if (
      profile?.profileImageType ===
        "custom" &&
      profile?.profileImage
    ) {
      if (
        profile.profileImage.startsWith(
          "http"
        )
      ) {
        return profile.profileImage;
      }

      return profile.profileImage;
    }


    return null;
  };


  const currentImage =
    getCurrentImage();


  // ===================================================
  // Remove Custom Image
  // ===================================================

  const handleRemoveImage = async () => {
    try {
      await onRemoveImage();

      setImagePreview(null);
    } catch (error) {
      console.error(
        "Remove image error:",
        error
      );
    }
  };


  // ===================================================
  // Save Profile
  // ===================================================

  const handleSubmit = (event) => {
    event.preventDefault();

    onSaveProfile();
  };


  // ===================================================
  // Render
  // ===================================================

  return (
    <section className="profile-settings">


      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <div className="profile-settings-header">

        <div>
          <span className="settings-section-label">
            PROFILE
          </span>

          <h2>
            Personal Information
          </h2>

          <p>
            Update your profile information
            and profile picture.
          </p>
        </div>

      </div>


      {/* =================================================
          PROFILE IMAGE
      ================================================= */}

      <div className="profile-image-section">

        <div className="profile-image-preview">

          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
            />
          ) : (
            <div className="profile-image-placeholder">
              <FontAwesomeIcon
                icon={faCamera}
              />
            </div>
          )}

        </div>


        <div className="profile-image-content">

          <h3>
            Profile Picture
          </h3>

          <p>
            Choose an avatar or upload
            your own image.
          </p>


          <div className="profile-image-actions">

            <button
              type="button"
              className="profile-upload-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              <FontAwesomeIcon
                icon={faUpload}
              />

              {uploading
                ? "Uploading..."
                : "Upload Image"}
            </button>


            {currentImage && (
              <button
                type="button"
                className="profile-remove-image-button"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                />

                Remove
              </button>
            )}

          </div>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="profile-hidden-file-input"
          />

          <small>
            JPG, JPEG, PNG or WEBP · Maximum
            5 MB
          </small>

        </div>

      </div>


      {/* =================================================
          PROFILE FORM
      ================================================= */}

      <form
        className="profile-settings-form"
        onSubmit={handleSubmit}
      >

        <div className="profile-form-row">

          <div className="profile-form-group">

            <label htmlFor="firstName">
              First Name
            </label>

            <input
              id="firstName"
              name="firstName"
              type="text"
              value={
                formData?.firstName || ""
              }
              onChange={handleChange}
              placeholder="Enter your first name"
            />

          </div>


          <div className="profile-form-group">

            <label htmlFor="lastName">
              Last Name
            </label>

            <input
              id="lastName"
              name="lastName"
              type="text"
              value={
                formData?.lastName || ""
              }
              onChange={handleChange}
              placeholder="Enter your last name"
            />

          </div>

        </div>


        <div className="profile-form-group">

          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={
              formData?.email || ""
            }
            onChange={handleChange}
            placeholder="Enter your email"
          />

        </div>


        {/* =================================================
            AVATAR SELECTOR
        ================================================= */}

        <AvatarSelector
          selectedAvatar={
            profile?.selectedAvatar
          }
          onSelectAvatar={
            onSelectAvatar
          }
        />


        {/* =================================================
            SAVE BUTTON
        ================================================= */}

        <div className="profile-form-footer">

          <button
            type="submit"
            className="profile-save-button"
            disabled={saving}
          >
            <FontAwesomeIcon
              icon={faSave}
            />

            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </form>

    </section>
  );
};


export default ProfileSettings;