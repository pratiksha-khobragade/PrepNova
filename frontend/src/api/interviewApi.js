const API_BASE_URL = "/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("prepnova_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// Upload resume
export const uploadInterviewResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(
    `${API_BASE_URL}/interview/resume`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to upload resume."
    );
  }

  return data;
};

// Create interview
export const createInterview = async ({
  role,
  experience,
  mode,
  resumeText = "",
}) => {
  const response = await fetch(
    `${API_BASE_URL}/interview`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        experience,
        mode,
        resumeText,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create interview."
    );
  }

  return data;
};

// Get current question
export const getCurrentQuestion = async (interviewId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/interview/${interviewId}/question`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: false,
        message: text || "Invalid server response.",
      };
    }

    console.log(
      "GET CURRENT QUESTION:",
      {
        status: response.status,
        ok: response.ok,
        data,
      }
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Unable to load question. Server returned ${response.status}.`
      );
    }

    if (!data.success) {
      throw new Error(
        data.message ||
          "Question could not be loaded."
      );
    }

    return data;
  } catch (error) {
    console.error(
      "getCurrentQuestion API error:",
      error
    );

    throw error;
  }
};

// Submit answer
export const submitInterviewAnswer = async ({
  interviewId,
  answer,
  timeTaken,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/interview/answer`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewId,
        answer,
        timeTaken,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to evaluate answer."
    );
  }

  return data;
};

// Generate next adaptive question
export const generateNextQuestion = async (interviewId) => {
  const response = await fetch(
    `${API_BASE_URL}/interview/next-question`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to generate the next question."
    );
  }

  return data;
};

// Finish interview
export const finishInterview = async (interviewId) => {
  const response = await fetch(
    `${API_BASE_URL}/interview/finish`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interviewId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to finish interview."
    );
  }

  return data;
};

// Get report
export const getInterviewReport = async (interviewId) => {
  const response = await fetch(
    `${API_BASE_URL}/interview/report/${interviewId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load interview report."
    );
  }

  return data;
};

// Get interview history
export const getInterviewHistory = async () => {
  const response = await fetch(
    `${API_BASE_URL}/interview/history`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load interview history."
    );
  }

  return data;
};