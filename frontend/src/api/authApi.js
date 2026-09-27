// =====================================================
// PrepNova - Authentication API
// =====================================================

// Monolithic deployment:
// Frontend and backend use the same domain.
//
// Local:
// http://localhost:5173/api
//
// Render:
// https://your-prepnova-app.onrender.com/api
//
const API_BASE_URL = "/api";

// =====================================================
// Signup API
// =====================================================

export const signupUser = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/signup`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Signup failed."
    );
  }

  return data;
};

// =====================================================
// Login API
// =====================================================

export const loginUser = async ({
  email,
  password,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed."
    );
  }

  return data;
};

// =====================================================
// Google Login API
// =====================================================

export const googleLoginUser = async (
  credential
) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/google`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        credential,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Google login failed."
    );
  }

  return data;
};

// =====================================================
// Get Current User API
// =====================================================

export const getCurrentUser = async () => {
  const token = localStorage.getItem(
    "prepnova_token"
  );

  if (!token) {
    throw new Error(
      "Authentication token not found."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to get user."
    );
  }

  return data;
};