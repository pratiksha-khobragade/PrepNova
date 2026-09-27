// =====================================================
// PrepNova - DSA API
// =====================================================

const API_BASE_URL = "/api/dsa";

// =====================================================
// Get Auth Token
// =====================================================

const getToken = () => {
  return localStorage.getItem(
    "prepnova_token"
  );
};

// =====================================================
// Common Request Helper
// =====================================================

const dsaRequest = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,

        ...(options.headers || {}),
      },
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Invalid server response."
    );
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "DSA request failed."
    );
  }

  return data;
};

// =====================================================
// Get All DSA Problems
// =====================================================

export const getDsaProblems = async () => {
  return dsaRequest(
    "/problems"
  );
};

// =====================================================
// Get Single DSA Problem
// =====================================================

export const getDsaProblem = async (
  problemId
) => {
  return dsaRequest(
    `/problems/${problemId}`
  );
};

// =====================================================
// Run Code
// Public Test Cases
// =====================================================

export const runDsaCode = async ({
  problemId,
  language,
  code,
}) => {
  return dsaRequest(
    `/problems/${problemId}/run`,
    {
      method: "POST",

      body: JSON.stringify({
        language,
        code,
      }),
    }
  );
};

// =====================================================
// Submit Code
// Public + Hidden Test Cases
// =====================================================

export const submitDsaCode = async ({
  problemId,
  language,
  code,
}) => {
  return dsaRequest(
    `/problems/${problemId}/submit`,
    {
      method: "POST",

      body: JSON.stringify({
        language,
        code,
      }),
    }
  );
};

// =====================================================
// Phase 4 - Get DSA Progress
// =====================================================

export const getDsaProgress = async () => {
  return dsaRequest(
    "/progress"
  );
};

// =====================================================
// Phase 4 - Get Submission History
// =====================================================

export const getDsaSubmissions = async ({
  page = 1,
  limit = 20,
} = {}) => {
  return dsaRequest(
    `/submissions?page=${page}&limit=${limit}`
  );
};

// =====================================================
// Phase 4 - Get Solved Problems
// =====================================================

export const getSolvedDsaProblems = async () => {
  return dsaRequest(
    "/solved"
  );
};