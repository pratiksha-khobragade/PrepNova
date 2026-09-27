import axios from "axios";

const API_BASE_URL = "/api";

const mcqApi = axios.create({
  baseURL: `${API_BASE_URL}/mcq`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// AUTH TOKEN
// ============================================================

mcqApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("prepnova_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// GET MCQ QUESTIONS
// ============================================================

export const getMCQQuestions = async ({
  subject = "All",
  difficulty = "All",
  limit = 20,
} = {}) => {
  const response = await mcqApi.get("/questions", {
    params: {
      subject,
      difficulty,
      limit,
    },
  });

  return response.data;
};

// ============================================================
// GET SINGLE MCQ QUESTION
// ============================================================

export const getMCQQuestion = async (questionId) => {
  const response = await mcqApi.get(
    `/questions/${questionId}`
  );

  return response.data;
};

// ============================================================
// START MCQ TEST
// ============================================================

export const startMCQTest = async ({
  difficulty = "All",
  questionCount = 20,
  durationMinutes = 20,
} = {}) => {
  const response = await mcqApi.post("/tests/start", {
    difficulty,
    questionCount,
    durationMinutes,
  });

  return response.data;
};

// ============================================================
// GET MCQ ATTEMPT
// ============================================================

export const getMCQAttempt = async (attemptId) => {
  const response = await mcqApi.get(
    `/tests/${attemptId}`
  );

  return response.data;
};

// ============================================================
// GET COMPLETE MCQ RESULT
// ============================================================

export const getMCQResult = async (attemptId) => {
  const response = await mcqApi.get(
    `/tests/${attemptId}/result`
  );

  return response.data;
};

// ============================================================
// SUBMIT MCQ TEST
// ============================================================

export const submitMCQTest = async ({
  attemptId,
  answers = [],
  timeTakenSeconds = 0,
  autoSubmitted = false,
}) => {
  const response = await mcqApi.post(
    `/tests/${attemptId}/submit`,
    {
      answers,
      timeTakenSeconds,
      autoSubmitted,
    }
  );

  return response.data;
};

// ============================================================
// MCQ HISTORY
// ============================================================

export const getMCQHistory = async () => {
  const response = await mcqApi.get(
    "/tests/history"
  );

  return response.data;
};

export default mcqApi;