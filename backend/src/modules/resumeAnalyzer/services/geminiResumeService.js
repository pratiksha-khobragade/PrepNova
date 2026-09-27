const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const analyzeResumeWithGemini = async (resumeText) => {
  if (!resumeText || !resumeText.trim()) {
    throw new Error("Resume text is empty.");
  }

  const prompt = `
You are an expert ATS resume reviewer and career advisor.

Analyze the following resume carefully.

Give the resume an overall score out of 100 based on:
- ATS compatibility
- Resume structure
- Skills
- Projects
- Education
- Experience
- Achievements
- Clarity and impact
- Use of relevant technical keywords
- Professional presentation

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.

Use exactly this structure:

{
  "overallScore": 0,
  "atsScore": 0,
  "skillsScore": 0,
  "experienceScore": 0,
  "projectsScore": 0,
  "educationScore": 0,
  "strengths": [
    "..."
  ],
  "weaknesses": [
    "..."
  ],
  "missingKeywords": [
    "..."
  ],
  "suggestions": [
    "..."
  ],
  "summary": "..."
}

Rules:
- All scores must be integers from 0 to 100.
- Give practical and specific suggestions.
- Do not invent experience, skills, projects, or achievements that are not present.
- If experience is missing, evaluate that section based on what is actually provided.
- Keep strengths and weaknesses concise.
- Give 5-8 useful suggestions.
- Identify relevant keywords that could improve the resume.
- The summary should be 2-4 sentences.

RESUME:

${resumeText}
`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini JSON parse error:", text);
    throw new Error("Gemini returned an invalid analysis response.");
  }
};

module.exports = {
  analyzeResumeWithGemini,
};