const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const { PDFParse } = require("pdf-parse");

const extractResumeText = async (filePath, originalName) => {
  if (!filePath || !originalName) {
    throw new Error("Resume file is required.");
  }

  const extension = path
    .extname(originalName)
    .toLowerCase();

  const fileBuffer = fs.readFileSync(filePath);

  // =====================================================
  // PDF
  // pdf-parse v2.4.5
  // =====================================================

  if (extension === ".pdf") {
    const parser = new PDFParse({
      data: fileBuffer,
    });

    try {
      const result = await parser.getText();

      return (result.text || "").trim();
    } finally {
      await parser.destroy();
    }
  }

  // =====================================================
  // DOCX
  // =====================================================

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({
      buffer: fileBuffer,
    });

    return (result.value || "").trim();
  }

  throw new Error(
    "Unsupported resume format. Please upload a PDF or DOCX file."
  );
};

module.exports = extractResumeText;