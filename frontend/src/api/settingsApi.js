// =====================================================
// PrepNova - Settings API
// =====================================================

const API_BASE_URL = "/api";


// =====================================================
// Get Authentication Token
// =====================================================

const getToken = () => {
  return localStorage.getItem(
    "prepnova_token"
  );
};


// =====================================================
// Common Headers
// =====================================================

const getHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


// =====================================================
// Get Profile
// =====================================================

export const getProfile = async () => {
  const response = await fetch(
    `${API_BASE_URL}/settings/profile`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to load profile."
    );
  }

  return data;
};


// =====================================================
// Update Profile
// =====================================================

export const updateProfile = async (
  profileData
) => {
  const response = await fetch(
    `${API_BASE_URL}/settings/profile`,
    {
      method: "PUT",

      headers: getHeaders(),

      body: JSON.stringify(
        profileData
      ),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update profile."
    );
  }

  return data;
};


// =====================================================
// Select Avatar
// =====================================================

export const selectAvatar = async (
  avatarName
) => {
  const response = await fetch(
    `${API_BASE_URL}/settings/avatar`,
    {
      method: "PUT",

      headers: getHeaders(),

      body: JSON.stringify({
        avatarName,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to select avatar."
    );
  }

  return data;
};


// =====================================================
// Upload Profile Image
// =====================================================

export const uploadProfileImage =
  async (imageFile) => {
    const formData = new FormData();

    formData.append(
      "profileImage",
      imageFile
    );

    const response = await fetch(
      `${API_BASE_URL}/settings/profile-image`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${getToken()}`,
        },

        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to upload profile image."
      );
    }

    return data;
  };


// =====================================================
// Remove Profile Image
// =====================================================

export const removeProfileImage =
  async () => {
    const response = await fetch(
      `${API_BASE_URL}/settings/profile-image`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to remove profile image."
      );
    }

    return data;
  };


// =====================================================
// Change Password
// =====================================================

export const changePassword = async ({
  currentPassword,
  newPassword,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/settings/password`,
    {
      method: "PUT",

      headers: getHeaders(),

      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to change password."
    );
  }

  return data;
};


// =====================================================
// Delete Account
// =====================================================

export const deleteAccount = async (
  password
) => {
  const response = await fetch(
    `${API_BASE_URL}/settings/account`,
    {
      method: "DELETE",

      headers: getHeaders(),

      body: JSON.stringify({
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete account."
    );
  }

  return data;
};