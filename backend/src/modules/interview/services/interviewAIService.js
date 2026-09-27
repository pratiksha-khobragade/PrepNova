const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL =
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

// ======================================================
// CONSTANTS
// ======================================================

const MAX_RETRIES = 4;

// ======================================================
// SLEEP HELPER
// ======================================================

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ======================================================
// CHECK TEMPORARY GEMINI ERROR
// ======================================================

const isTemporaryGeminiError = (error) => {
  const status =
    error?.status ||
    error?.error?.code;

  const message =
    error?.message || "";

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("temporarily") ||
    message.includes("overloaded") ||
    message.includes("RESOURCE_EXHAUSTED")
  );
};

// ======================================================
// GEMINI REQUEST WITH AUTOMATIC RETRY
// ======================================================

const generateWithRetry = async (prompt) => {
  let lastError = null;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `Gemini request - attempt ${attempt}/${MAX_RETRIES}`
      );

      const response =
        await ai.models.generateContent({
          model: MODEL,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

      return response;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini request failed on attempt ${attempt}:`,
        error?.message || error
      );

      // Don't retry permanent errors.
      if (!isTemporaryGeminiError(error)) {
        throw error;
      }

      // No more retries.
      if (attempt === MAX_RETRIES) {
        break;
      }

      // Exponential backoff:
      // 2 sec
      // 4 sec
      // 8 sec
      const delay =
        Math.pow(2, attempt) * 1000;

      console.log(
        `Gemini temporarily unavailable. Retrying in ${
          delay / 1000
        } seconds...`
      );

      await sleep(delay);
    }
  }

  throw new Error(
    "The AI interviewer is temporarily busy. Please try again in a few seconds."
  );
};

// ======================================================
// SAFELY PARSE GEMINI JSON
// ======================================================

const parseJsonResponse = (text) => {
  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleaned = String(text).trim();

  // Remove markdown code fences.
  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(
      "Gemini JSON parse error:",
      error
    );

    console.error(
      "Gemini response:",
      text
    );

    throw new Error(
      "Unable to parse AI response."
    );
  }
};

// ======================================================
// NORMALIZE SCORE
// ======================================================

const normalizeScore = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      10,
      Number(number.toFixed(1))
    )
  );
};

// ======================================================
// GENERATE INTERVIEW QUESTION
// ======================================================

const generateInterviewQuestion = async ({
  role,
  experience,
  mode,
  resumeText = "",
  previousQuestions = [],
  previousAnswer = "",
  previousFeedback = "",
  questionNumber = 1,
}) => {
  const isTechnical =
    mode === "Technical";

  const previousContext =
    previousQuestions.length > 0
      ? previousQuestions
          .map((item, index) => {
            // Supports both strings and question objects.
            if (typeof item === "string") {
              return `Question ${
                index + 1
              }: ${item}`;
            }

            return `Question ${
              index + 1
            }: ${
              item.question ||
              "Unknown question"
            }
Answer: ${
              item.answer ||
              "No answer provided"
            }
Score: ${
              item.score ?? 0
            }/10
Feedback: ${
              item.feedback ||
              "No feedback"
            }`;
          })
          .join("\n\n")
      : "No previous questions. This is the first question.";

  const prompt = `
You are an expert AI interviewer conducting a realistic ${mode} interview.

Candidate information:
Role: ${role}
Experience: ${experience}
Interview Type: ${mode}

Candidate Resume:
${resumeText || "No resume was provided."}

Previous interview context:
${previousContext}

Previous answer:
${previousAnswer || "No previous answer."}

Previous feedback:
${previousFeedback || "No previous feedback."}

Current question number:
${questionNumber}

Your task is to generate exactly ONE interview question.

Requirements:
- Make the question relevant to the candidate's role and experience.
- ${
    isTechnical
      ? "For a Technical interview, test programming, computer science, web development, system knowledge, projects, problem solving, or role-specific technical knowledge."
      : "For an HR interview, test communication, motivation, teamwork, leadership, conflict handling, career goals, strengths, weaknesses, adaptability, and workplace situations."
  }
- Do NOT repeat a previous question.
- If a previous answer was weak or incomplete, the next question may naturally probe that area.
- Make the interview adaptive.
- Increase difficulty gradually.
- The question should feel like something a real interviewer would ask.
- Avoid unnecessary introductory text.
- Return ONLY valid JSON.

Difficulty guidance:
Question 1: easy
Question 2: easy/medium
Question 3: medium
Question 4: medium/hard
Question 5: hard

Return exactly:

{
  "question": "Your interview question here",
  "difficulty": "easy"
}

The difficulty must be one of:
easy, medium, hard
`;

  const response =
    await generateWithRetry(prompt);

  const responseText =
    response?.text ||
    response?.candidates?.[0]
      ?.content?.parts?.[0]?.text ||
    "";

  const result =
    parseJsonResponse(responseText);

  if (
    !result ||
    !result.question
  ) {
    throw new Error(
      "AI did not generate a valid interview question."
    );
  }

  return {
    question:
      String(result.question).trim(),

    difficulty:
      ["easy", "medium", "hard"].includes(
        result.difficulty
      )
        ? result.difficulty
        : "medium",

    // Your Interview model/controller
    // already has a timeLimit field.
    timeLimit: 90,
  };
};

// ======================================================
// EVALUATE INTERVIEW ANSWER
// ======================================================

const evaluateInterviewAnswer = async ({
  role,
  experience,
  mode,
  question,
  answer,
  resumeText = "",
}) => {
  // ----------------------------------------------------
  // Empty answer
  // ----------------------------------------------------

  if (!answer || !answer.trim()) {
    return {
      score: 0,
      confidence: 0,
      communication: 0,
      correctness: 0,

      feedback:
        "No answer provided. Try to answer the question clearly.",
    };
  }

  const prompt = `
You are an expert interview evaluator.

Evaluate the candidate's answer objectively.

Candidate:
Role: ${role}
Experience: ${experience}
Interview Type: ${mode}

Resume:
${resumeText || "No resume provided."}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate these areas from 0 to 10:

1. confidence
- Does the answer sound confident and decisive?
- Avoid judging personality.
- Judge only the confidence demonstrated in the response.

2. communication
- Is the answer clear, structured, concise, and understandable?

3. correctness
- Is the answer technically/factually appropriate for the question?

4. score
- Overall quality of the answer.

Rules:
- Be fair to a beginner.
- Do not penalize simple language.
- Do not invent facts about the candidate.
- Do not assume experience that was not stated.
- Give useful, specific feedback.
- Feedback should be 1-2 concise sentences.
- Return ONLY valid JSON.
- All scores must be between 0 and 10.

Return exactly:

{
  "score": 0,
  "confidence": 0,
  "communication": 0,
  "correctness": 0,
  "feedback": "Specific constructive feedback."
}
`;

  try {
    const response =
      await generateWithRetry(prompt);

    const responseText =
      response?.text ||
      response?.candidates?.[0]
        ?.content?.parts?.[0]?.text ||
      "";

    const result =
      parseJsonResponse(responseText);

    return {
      score: normalizeScore(
        result.score
      ),

      confidence: normalizeScore(
        result.confidence
      ),

      communication: normalizeScore(
        result.communication
      ),

      correctness: normalizeScore(
        result.correctness
      ),

      feedback:
        typeof result.feedback ===
          "string" &&
        result.feedback.trim()
          ? result.feedback.trim()
          : "Keep practicing and provide a more structured answer.",
    };
  } catch (error) {
    console.error(
      "Interview answer evaluation failed:",
      error
    );

    throw error;
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  generateInterviewQuestion,
  evaluateInterviewAnswer,
};