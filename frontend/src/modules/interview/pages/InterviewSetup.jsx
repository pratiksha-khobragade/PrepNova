import React, { useRef, useState } from "react";
import {
  createInterview,
  uploadInterviewResume,
} from "../../../api/interviewApi";

import DashboardSidebar from "../../../dashboard/layout/DashboardSidebar";

import "./InterviewSetup.css";

/* =========================================================
   ICONS
   ========================================================= */

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
    <path d="M3 11h18" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20c.7-3.2 2.9-5 6.5-5s5.8 1.8 6.5 5" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m14 5-4 14" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.5-3 2.4-4.8 5.5-4.8s5 1.8 5.5 4.8" />
    <path d="M16 5.5a2.8 2.8 0 0 1 0 5.5" />
    <path d="M17 14.5c2 .5 3.3 2 3.6 4.5" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M12 16V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v5h4" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="m7 7 10 10" />
    <path d="m17 7-10 10" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 12h13" />
    <path d="m13 7 5 5-5 5" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="m7 9 5 5 5-5" />
  </svg>
);

/* =========================================================
   COMPONENT
   ========================================================= */

const InterviewSetup = ({ onInterviewCreated }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    mode: "Technical",
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const [uploadingResume, setUploadingResume] = useState(false);
  const [startingInterview, setStartingInterview] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     INPUT CHANGE
     ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================================
     RESUME
     ========================================================= */

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!["pdf", "docx"].includes(extension)) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume size must be less than 5 MB.");
      return;
    }

    setError("");
    setResumeFile(file);
    setUploadingResume(true);

    try {
      const data = await uploadInterviewResume(file);

      setResumeText(data.resumeText || "");
    } catch (uploadError) {
      setResumeFile(null);
      setResumeText("");

      setError(
        uploadError.message ||
          "Unable to process the resume."
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const removeResume = () => {
    setResumeFile(null);
    setResumeText("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     SPEECH UNLOCK
     ========================================================= */

  const unlockSpeechSynthesis = () => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.getVoices();

    const silentTestUtterance =
      new SpeechSynthesisUtterance("");

    silentTestUtterance.volume = 0;

    window.speechSynthesis.speak(
      silentTestUtterance
    );
  };

  /* =========================================================
     START INTERVIEW
     ========================================================= */

  const handleStartInterview = async () => {
    if (!formData.role.trim()) {
      setError(
        "Please enter the role you are preparing for."
      );
      return;
    }

    if (!formData.experience) {
      setError(
        "Please select your experience level."
      );
      return;
    }

    if (uploadingResume) {
      setError(
        "Please wait until your resume finishes processing."
      );
      return;
    }

    setError("");
    setStartingInterview(true);

    unlockSpeechSynthesis();

    try {
      const data = await createInterview({
        role: formData.role.trim(),
        experience: formData.experience,
        mode: formData.mode,
        resumeText,
      });

      if (onInterviewCreated) {
        onInterviewCreated(data);
      }
    } catch (startError) {
      setError(
        startError.message ||
          "Unable to start interview."
      );
    } finally {
      setStartingInterview(false);
    }
  };

  return (
    <div className="interview-setup-page">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <DashboardSidebar />

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="interview-setup-main">

        <div className="interview-setup-container">

          {/* HEADER */}

          <header className="interview-page-header">

            <div>
              <span className="interview-page-label">
                AI INTERVIEW
              </span>

              <h1>Practice smarter.</h1>

              <p>
                Prepare for your next interview with AI.
              </p>
            </div>

          </header>

          {/* =================================================
              SETUP
              ================================================= */}

          <section className="interview-setup-card">

            <div className="card-title-row">

              <div>
                <span className="card-eyebrow">
                  INTERVIEW SETUP
                </span>

              </div>

            </div>

            <div className="form-grid">

              {/* ROLE */}

              <div className="setup-field">

                <label htmlFor="role">
                  Target Role
                </label>

                <div className="setup-input">

                  <span>
                    <BriefcaseIcon />
                  </span>

                  <input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="e.g. Software Developer"
                    value={formData.role}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* EXPERIENCE */}

              <div className="setup-field">

                <label htmlFor="experience">
                  Experience Level
                </label>

                <div className="setup-input">

                  <span>
                    <UserIcon />
                  </span>

                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select experience level
                    </option>

                    <option value="Fresher">
                      Fresher / Student
                    </option>

                    <option value="0-1 years">
                      0–1 years
                    </option>

                    <option value="1-3 years">
                      1–3 years
                    </option>

                    <option value="3-5 years">
                      3–5 years
                    </option>

                    <option value="5+ years">
                      5+ years
                    </option>
                  </select>

                  <ChevronDownIcon />

                </div>

              </div>

            </div>

            {/* INTERVIEW TYPE */}

            <div className="interview-type-section">

              <div className="interview-type-heading">
                <label>Interview Type</label>

                <span>
                  Select one
                </span>
              </div>

              <div className="interview-type-options">

                <button
                  type="button"
                  className={`interview-type-card ${
                    formData.mode === "Technical"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      mode: "Technical",
                    }))
                  }
                >

                  <span className="type-icon">
                    <CodeIcon />
                  </span>

                  <span className="type-text">
                    <strong>Technical</strong>
                    <small>
                      Coding & CS concepts
                    </small>
                  </span>

                  <span className="type-radio">
                    {formData.mode === "Technical" && (
                      <CheckIcon />
                    )}
                  </span>

                </button>

                <button
                  type="button"
                  className={`interview-type-card ${
                    formData.mode === "HR"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      mode: "HR",
                    }))
                  }
                >

                  <span className="type-icon">
                    <UsersIcon />
                  </span>

                  <span className="type-text">
                    <strong>HR Interview</strong>
                    <small>
                      Behavioral & communication
                    </small>
                  </span>

                  <span className="type-radio">
                    {formData.mode === "HR" && (
                      <CheckIcon />
                    )}
                  </span>

                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              BOTTOM CONTENT
              ================================================= */}

          <div className="interview-bottom-grid">

            {/* RESUME */}

            <section className="resume-card">

              <div className="resume-card-title">

                <div className="resume-icon">
                  <FileIcon />
                </div>

                <div>
                  <h3>Resume</h3>
                  <p>
                    Optional · Recommended
                  </p>
                </div>

              </div>

              {!resumeFile ? (

                <button
                  type="button"
                  className="resume-upload-box"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >

                  <span className="upload-icon">
                    <UploadIcon />
                  </span>

                  <span>
                    <strong>
                      Upload your resume
                    </strong>

                    <small>
                      PDF or DOCX · Maximum 5 MB
                    </small>
                  </span>

                  <b>
                    Browse
                  </b>

                </button>

              ) : (

                <div className="resume-selected-box">

                  <span className="selected-file">
                    <FileIcon />
                  </span>

                  <div>
                    <strong>
                      {resumeFile.name}
                    </strong>

                    <small>
                      {uploadingResume
                        ? "Analyzing..."
                        : "Resume ready"}
                    </small>
                  </div>

                  <button
                    type="button"
                    onClick={removeResume}
                    disabled={uploadingResume}
                    aria-label="Remove resume"
                  >
                    <CloseIcon />
                  </button>

                </div>

              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleResumeChange}
                hidden
              />

            </section>

            {/* SESSION */}

            <section className="session-card">

              <div className="session-card-header">

                <div>
                  <span>
                    SESSION
                  </span>

                  <h3>
                    Interview Overview
                  </h3>
                </div>

                <span className="session-dot" />

              </div>

              <div className="session-info">

                <div>
                  <strong>05</strong>
                  <small>Questions</small>
                </div>

                <div>
                  <strong>AI</strong>
                  <small>Adaptive</small>
                </div>

                <div>
                  <strong>10</strong>
                  <small>Scoring</small>
                </div>

              </div>

            </section>

          </div>

          {/* ERROR */}

          {error && (
            <div className="interview-error">
              <span>!</span>
              {error}
            </div>
          )}

          {/* ACTION */}

          <div className="interview-action">

            <button
              type="button"
              onClick={handleStartInterview}
              disabled={
                startingInterview ||
                uploadingResume
              }
            >

              {startingInterview ? (
                <>
                  <i />
                  Preparing...
                </>
              ) : (
                <>
                  Start AI Interview
                  <ArrowRightIcon />
                </>
              )}

            </button>

          </div>

        </div>

      </main>

    </div>
  );
};

export default InterviewSetup;