const fs = require("fs");

const extractResumeText = require("../utils/extractResumeText");
const {
  analyzeResumeWithGemini,
} = require("../services/geminiResumeService");

const analyzeResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    filePath = req.file.path;

    const resumeText = await extractResumeText(
      filePath,
      req.file.originalname
    );

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Could not extract any text from the uploaded resume.",
      });
    }

    const analysis = await analyzeResumeWithGemini(
      resumeText
    );

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully.",
      file: {
        name: req.file.originalname,
        size: req.file.size,
      },
      analysis,
    });
  } catch (error) {
    console.error(
      "Resume Analyzer Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to analyze the resume.",
    });
  } finally {
    // Remove uploaded file after analysis.
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (deleteError) {
        console.error(
          "Resume cleanup error:",
          deleteError
        );
      }
    }
  }
};

module.exports = {
  analyzeResume,
};