// =====================================================
// PrepNova - Progress Tracking API
// =====================================================

const API_BASE_URL = "/api";

// small helper so we don't repeat the "attach token" logic
// in every single function below
const getAuthHeaders = () => {
  const token = localStorage.getItem("prepnova_token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// =====================================================
// Get saved progress profile (all 4 platforms)
// =====================================================

export const getProgress = async () => {
  const response = await fetch(`${API_BASE_URL}/progress`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load progress data.");
  }

  return data;
};

// =====================================================
// Connect (save + fetch stats for) a platform username
// =====================================================

export const connectPlatform = async ({ platform, username }) => {
  const response = await fetch(`${API_BASE_URL}/progress/connect`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ platform, username }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to connect profile.");
  }

  return data;
};

// =====================================================
// Refresh stats for an already-connected platform
// =====================================================

export const refreshPlatform = async (platform) => {
  const response = await fetch(
    `${API_BASE_URL}/progress/refresh/${platform}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to refresh stats.");
  }

  return data;
};

// =====================================================
// Disconnect a platform
// =====================================================

export const disconnectPlatform = async (platform) => {
  const response = await fetch(`${API_BASE_URL}/progress/${platform}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to disconnect profile.");
  }

  return data;
};
