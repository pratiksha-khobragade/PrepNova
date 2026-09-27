import React, { useRef, useState } from "react";
import DashboardSidebar from "../../dashboard/layout/DashboardSidebar";
import "./ResumeAnalyzer.css";

const ResumeAnalyzer = () => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleFileSelect = (file) => {
    setError("");
    setAnalysis(null);

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const fileName = file.name.toLowerCase();

    const isValid =
      allowedTypes.includes(file.type) ||
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx");

    if (!isValid) {
      setSelectedFile(null);
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setError("Resume size must be less than 5 MB.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (event) => {
    const file = event.target.files?.[0];

    handleFileSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // =========================================================
  // ANALYZE RESUME
  // =========================================================

  const analyzeResume = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const token = localStorage.getItem("prepnova_token");

      if (!token) {
        throw new Error(
          "Please login again to continue."
        );
      }

      const formData = new FormData();

      formData.append(
        "resume",
        selectedFile
      );

      const response = await fetch(
        "/api/resume-analyzer/analyze",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to analyze the resume."
        );
      }

      setAnalysis(data.analysis);
    } catch (error) {
      console.error(
        "Resume Analyzer Error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while analyzing your resume."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const resetAnalyzer = () => {
    setSelectedFile(null);
    setAnalysis(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // SCORE CLASS
  // =========================================================

  const scoreClass = (score) => {
    if (score >= 80) {
      return "score-good";
    }

    if (score >= 60) {
      return "score-average";
    }

    return "score-low";
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="resume-analyzer-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <DashboardSidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="resume-analyzer-main">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        {!analysis && (
          <div className="resume-page-header">

            <div>

              <div className="resume-eyebrow">

                <span className="eyebrow-dot"></span>

                AI POWERED CAREER TOOL

              </div>


              <h1>
                AI Resume Analyzer
              </h1>


              <p>
                Upload your resume and let AI identify
                strengths, weaknesses, ATS issues,
                and opportunities to improve.
              </p>

            </div>


            <div className="resume-header-badge">

              <span>
                ✦
              </span>

              Smart Resume Review

            </div>

          </div>
        )}


        {/* ===================================================
            UPLOAD SECTION
        =================================================== */}

        {!analysis && !loading && (
          <div className="resume-upload-card">

            <div
              className={`resume-drop-zone ${
                selectedFile ? "has-file" : ""
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() =>
                fileInputRef.current?.click()
              }
            >

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileInput}
                hidden
              />


              {!selectedFile ? (
                <>

                  <div className="upload-icon-wrapper">
                    <span>
                      ↑
                    </span>
                  </div>


                  <h2>
                    Upload your resume
                  </h2>


                  <p>
                    Drag & drop your resume here, or{" "}
                    <span>
                      browse files
                    </span>
                  </p>


                  <div className="upload-format">
                    PDF or DOCX • Maximum 5 MB
                  </div>

                </>
              ) : (
                <>

                  <div className="selected-file-icon">
                    📄
                  </div>


                  <h2>
                    {selectedFile.name}
                  </h2>


                  <p>
                    {(
                      selectedFile.size / 1024
                    ).toFixed(1)}{" "}
                    KB
                  </p>


                  <div className="change-file">
                    Click to choose another file
                  </div>

                </>
              )}

            </div>


            {/* ERROR */}

            {error && (
              <div className="resume-error">

                <span>
                  !
                </span>

                {error}

              </div>
            )}


            {/* UPLOAD FOOTER */}

            <div className="resume-upload-footer">

              <div className="privacy-note">

                <span>
                  🔒
                </span>

                Your resume is processed securely
                for analysis.

              </div>


              <button
                type="button"
                className="analyze-resume-btn"
                onClick={analyzeResume}
                disabled={!selectedFile || loading}
              >

                {loading ? (
                  <>

                    <span className="loading-spinner"></span>

                    Analyzing Resume...

                  </>
                ) : (
                  <>

                    Analyze Resume

                    <span>
                      →
                    </span>

                  </>
                )}

              </button>

            </div>

          </div>
        )}


        {/* ===================================================
            ERROR WHEN NOT ANALYZING
        =================================================== */}

        {!analysis &&
          !loading &&
          error &&
          !selectedFile && (
            <div className="resume-error resume-error-bottom">

              <span>
                !
              </span>

              {error}

            </div>
          )}


        {/* ===================================================
            AI LOADING
        =================================================== */}

        {loading && (
          <div className="resume-loading-card">

            <div className="ai-loader">

              <div className="ai-loader-ring"></div>

              <span>
                ✦
              </span>

            </div>


            <h2>
              AI is reviewing your resume
            </h2>


            <p>
              Checking ATS compatibility, skills,
              projects, experience and career
              keywords...
            </p>


            <div className="loading-progress">

              <div></div>

            </div>

          </div>
        )}


        {/* ===================================================
            RESULTS
        =================================================== */}

        {analysis && !loading && (
          <div className="resume-results">

            {/* =================================================
                RESULTS TOP BAR
            ================================================= */}

            <div className="results-topbar">

              <div>

                <span className="results-label">
                  AI ANALYSIS COMPLETE
                </span>


                <h2>
                  Your Resume Analysis
                </h2>

              </div>


              <button
                type="button"
                className="analyze-again-btn"
                onClick={resetAnalyzer}
              >
                ↻ Analyze Another Resume
              </button>

            </div>


            {/* =================================================
                OVERVIEW
            ================================================= */}

            <div className="resume-overview-grid">

              {/* OVERALL SCORE */}

              <div className="overall-score-card">

                <div className="score-card-label">
                  OVERALL RESUME SCORE
                </div>


                <div className="overall-score">

                  {analysis.overallScore}

                  <span>
                    /100
                  </span>

                </div>


                <div
                  className={`score-status ${scoreClass(
                    analysis.overallScore
                  )}`}
                >

                  {analysis.overallScore >= 80
                    ? "Strong Resume"
                    : analysis.overallScore >= 60
                    ? "Good Foundation"
                    : "Needs Improvement"}

                </div>


                <div className="score-track">

                  <div
                    style={{
                      width: `${analysis.overallScore}%`,
                    }}
                  ></div>

                </div>

              </div>


              {/* SUMMARY */}

              <div className="resume-summary-card">

                <div className="section-mini-title">
                  AI SUMMARY
                </div>


                <p>
                  {analysis.summary}
                </p>

              </div>

            </div>


            {/* =================================================
                RESUME HEALTH
            ================================================= */}

            <div className="resume-section-card">

              <div className="section-heading">

                <div>

                  <span className="section-kicker">
                    PERFORMANCE BREAKDOWN
                  </span>


                  <h3>
                    Resume Health
                  </h3>

                </div>

              </div>


              <div className="category-score-grid">

                {[
                  [
                    "ATS Compatibility",
                    analysis.atsScore,
                  ],
                  [
                    "Technical Skills",
                    analysis.skillsScore,
                  ],
                  [
                    "Experience",
                    analysis.experienceScore,
                  ],
                  [
                    "Projects",
                    analysis.projectsScore,
                  ],
                  [
                    "Education",
                    analysis.educationScore,
                  ],
                ].map(
                  ([label, score]) => (
                    <div
                      className="category-score"
                      key={label}
                    >

                      <div className="category-score-top">

                        <span>
                          {label}
                        </span>

                        <strong>
                          {score}
                        </strong>

                      </div>


                      <div className="category-track">

                        <div
                          className={scoreClass(score)}
                          style={{
                            width: `${score}%`,
                          }}
                        ></div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>


            {/* =================================================
                STRENGTHS + WEAKNESSES
            ================================================= */}

            <div className="resume-two-column">

              {/* STRENGTHS */}

              <div className="resume-section-card strengths-card">

                <div className="section-heading">

                  <div>

                    <span className="section-kicker">
                      WHAT WORKS
                    </span>


                    <h3>
                      Strengths
                    </h3>

                  </div>


                  <div className="section-icon success">
                    ✓
                  </div>

                </div>


                <div className="insight-list">

                  {analysis.strengths?.map(
                    (item, index) => (
                      <div
                        className="insight-item"
                        key={index}
                      >

                        <span className="insight-bullet success">
                          ✓
                        </span>


                        <p>
                          {item}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>


              {/* WEAKNESSES */}

              <div className="resume-section-card weaknesses-card">

                <div className="section-heading">

                  <div>

                    <span className="section-kicker">
                      AREAS TO IMPROVE
                    </span>


                    <h3>
                      Weaknesses
                    </h3>

                  </div>


                  <div className="section-icon warning">
                    !
                  </div>

                </div>


                <div className="insight-list">

                  {analysis.weaknesses?.map(
                    (item, index) => (
                      <div
                        className="insight-item"
                        key={index}
                      >

                        <span className="insight-bullet warning">
                          !
                        </span>


                        <p>
                          {item}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>


            {/* =================================================
                MISSING KEYWORDS
            ================================================= */}

            <div className="resume-section-card">

              <div className="section-heading">

                <div>

                  <span className="section-kicker">
                    ATS OPTIMIZATION
                  </span>


                  <h3>
                    Missing Keywords
                  </h3>

                </div>


                <div className="section-icon keyword">
                  #
                </div>

              </div>


              <div className="keyword-list">

                {analysis.missingKeywords?.length ? (
                  analysis.missingKeywords.map(
                    (keyword, index) => (
                      <span
                        className="keyword-chip"
                        key={index}
                      >
                        {keyword}
                      </span>
                    )
                  )
                ) : (
                  <p className="empty-message">
                    No major missing keywords were
                    identified.
                  </p>
                )}

              </div>

            </div>


            {/* =================================================
                AI SUGGESTIONS
            ================================================= */}

            <div className="resume-section-card suggestions-card">

              <div className="section-heading">

                <div>

                  <span className="section-kicker">
                    AI RECOMMENDATIONS
                  </span>


                  <h3>
                    How to Improve Your Resume
                  </h3>

                </div>


                <div className="section-icon ai">
                  ✦
                </div>

              </div>


              <div className="suggestion-list">

                {analysis.suggestions?.map(
                  (suggestion, index) => (
                    <div
                      className="suggestion-item"
                      key={index}
                    >

                      <div className="suggestion-number">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>


                      <p>
                        {suggestion}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default ResumeAnalyzer;