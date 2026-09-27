import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBolt,
  faBookOpen,
  faCheck,
  faClock,
  faLayerGroup,
  faPlay,
  faQuestionCircle,
  faSliders,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

import { startMCQTest } from "../../../../api/mcqApi";
import "./MCQDashboard.css";

const MCQDashboard = () => {
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState("All");
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const difficultyOptions = [
    {
      value: "All",
      title: "All Levels",
      description: "Mixed difficulty",
      icon: faLayerGroup,
    },
    {
      value: "Easy",
      title: "Easy",
      description: "Build your basics",
      icon: faBookOpen,
    },
    {
      value: "Medium",
      title: "Medium",
      description: "Test your concepts",
      icon: faBolt,
    },
    {
      value: "Hard",
      title: "Hard",
      description: "Challenge yourself",
      icon: faTrophy,
    },
  ];

  const questionOptions = [10, 15, 20];
  const durationOptions = [10, 15, 20, 30];

  const selectedDifficulty =
    difficultyOptions.find(
      (item) => item.value === difficulty
    ) || difficultyOptions[0];

  const handleStartTest = async () => {
  try {
    setLoading(true);
    setError("");

    console.log("Starting MCQ test with:", {
      difficulty,
      questionCount,
      durationMinutes,
    });

    const response = await startMCQTest({
      difficulty,
      questionCount,
      durationMinutes,
    });

    console.log("MCQ start API response:", response);

    if (!response?.attempt) {
      console.error(
        "MCQ start response does not contain attempt:",
        response
      );

      throw new Error(
        response?.message ||
          response?.error ||
          "Backend did not return a test attempt."
      );
    }

    const attemptId =
      response.attempt.id ||
      response.attempt._id;

    console.log("MCQ attempt ID:", attemptId);

    if (!attemptId) {
      console.error(
        "Attempt exists but ID is missing:",
        response.attempt
      );

      throw new Error(
        "Test was created, but the attempt ID is missing."
      );
    }

    navigate(`/tests/mcq/test/${attemptId}`, {
      state: {
        attempt: response.attempt,
        questions: response.questions || [],
      },
    });
  } catch (err) {
    console.error("MCQ start error:", err);

    console.error(
      "Response data:",
      err?.response?.data
    );

    setError(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to start the test. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="mcq-dashboard-page">
      <div className="mcq-dashboard-container">
        {/* Header */}
        <header className="mcq-dashboard-header">
          <button
            type="button"
            className="mcq-dashboard-back"
            onClick={() => navigate("/tests/mcq")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to MCQ</span>
          </button>

          <button
            type="button"
            className="mcq-dashboard-history"
            onClick={() =>
              navigate("/tests/mcq/history")
            }
          >
            <FontAwesomeIcon icon={faClock} />
            <span>Test History</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </header>

        {/* Page Intro */}
        <section className="mcq-dashboard-intro">
          <div>
            <div className="mcq-dashboard-eyebrow">
              <span></span>
              TEST CONFIGURATION
            </div>

            <h1>
              Build your
              <span>perfect test.</span>
            </h1>

            <p>
              Configure your practice session based on
              your preferred difficulty, question count,
              and available time.
            </p>
          </div>

          <div className="mcq-intro-badge">
            <FontAwesomeIcon icon={faSliders} />
            <span>Customize your test</span>
          </div>
        </section>

        {/* Main Configuration */}
        <main className="mcq-dashboard-layout">
          {/* Left */}
          <section className="mcq-config-card">
            <div className="mcq-config-heading">
              <div className="mcq-config-heading-icon">
                <FontAwesomeIcon icon={faSliders} />
              </div>

              <div>
                <span>SETTINGS</span>
                <h2>Test Setup</h2>
              </div>
            </div>

            {/* Difficulty */}
            <div className="mcq-config-section">
              <div className="mcq-config-section-heading">
                <div>
                  <h3>Difficulty Level</h3>
                  <p>
                    Choose the difficulty for your test.
                  </p>
                </div>

                <span className="mcq-selection-label">
                  {selectedDifficulty.title}
                </span>
              </div>

              <div className="mcq-difficulty-grid">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`mcq-difficulty-option ${
                      difficulty === option.value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setDifficulty(option.value)
                    }
                  >
                    <div className="mcq-difficulty-icon">
                      <FontAwesomeIcon
                        icon={option.icon}
                      />
                    </div>

                    <div className="mcq-difficulty-text">
                      <strong>{option.title}</strong>
                      <span>{option.description}</span>
                    </div>

                    <div className="mcq-radio">
                      {difficulty === option.value && (
                        <FontAwesomeIcon icon={faCheck} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mcq-config-divider"></div>

            {/* Questions */}
            <div className="mcq-config-section">
              <div className="mcq-config-section-heading">
                <div>
                  <h3>Number of Questions</h3>
                  <p>
                    Select how many questions you want to
                    attempt.
                  </p>
                </div>

                <span className="mcq-selection-label">
                  {questionCount} Questions
                </span>
              </div>

              <div className="mcq-segment-control">
                {questionOptions.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={
                      questionCount === count
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setQuestionCount(count)
                    }
                  >
                    <strong>{count}</strong>
                    <span>Questions</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mcq-config-divider"></div>

            {/* Duration */}
            <div className="mcq-config-section">
              <div className="mcq-config-section-heading">
                <div>
                  <h3>Test Duration</h3>
                  <p>
                    Choose the amount of time available.
                  </p>
                </div>

                <span className="mcq-selection-label">
                  {durationMinutes} Minutes
                </span>
              </div>

              <div className="mcq-segment-control duration">
                {durationOptions.map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    className={
                      durationMinutes === duration
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setDurationMinutes(duration)
                    }
                  >
                    <strong>{duration}</strong>
                    <span>Minutes</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mcq-dashboard-error">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>{error}</span>
              </div>
            )}

            {/* Start */}
            <button
              type="button"
              className="mcq-start-test-button"
              onClick={handleStartTest}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mcq-button-spinner"></span>
                  <span>Preparing Test...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Start Test</span>
                  <FontAwesomeIcon
                    className="mcq-start-arrow"
                    icon={faArrowRight}
                  />
                </>
              )}
            </button>
          </section>

          {/* Right Summary */}
          <aside className="mcq-summary-column">
            <div className="mcq-summary-card">
              <div className="mcq-summary-top">
                <div>
                  <span>TEST OVERVIEW</span>
                  <h2>Your Test</h2>
                </div>

                <div className="mcq-summary-icon">
                  <FontAwesomeIcon icon={faBookOpen} />
                </div>
              </div>

              <div className="mcq-summary-preview">
                <div className="mcq-summary-preview-label">
                  <span>READY TO GO</span>
                  <FontAwesomeIcon icon={faCheck} />
                </div>

                <strong>
                  {questionCount} questions
                </strong>

                <p>
                  {selectedDifficulty.description} ·{" "}
                  {durationMinutes} minute session
                </p>
              </div>

              <div className="mcq-summary-items">
                <div className="mcq-summary-item">
                  <div className="mcq-summary-item-icon">
                    <FontAwesomeIcon icon={faLayerGroup} />
                  </div>

                  <div>
                    <span>Difficulty</span>
                    <strong>{difficulty}</strong>
                  </div>
                </div>

                <div className="mcq-summary-item">
                  <div className="mcq-summary-item-icon">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>

                  <div>
                    <span>Questions</span>
                    <strong>{questionCount}</strong>
                  </div>
                </div>

                <div className="mcq-summary-item">
                  <div className="mcq-summary-item-icon">
                    <FontAwesomeIcon icon={faClock} />
                  </div>

                  <div>
                    <span>Duration</span>
                    <strong>
                      {durationMinutes} min
                    </strong>
                  </div>
                </div>

                <div className="mcq-summary-item">
                  <div className="mcq-summary-item-icon">
                    <FontAwesomeIcon icon={faBookOpen} />
                  </div>

                  <div>
                    <span>Subjects</span>
                    <strong>6</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mcq-instructions-card">
              <div className="mcq-instructions-heading">
                <div className="mcq-instructions-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>

                <div>
                  <span>BEFORE YOU BEGIN</span>
                  <h3>Test Instructions</h3>
                </div>
              </div>

              <ul>
                <li>
                  <span>01</span>
                  <p>
                    Each question has one correct answer.
                  </p>
                </li>

                <li>
                  <span>02</span>
                  <p>
                    You can move between questions freely.
                  </p>
                </li>

                <li>
                  <span>03</span>
                  <p>
                    Your selected answers are saved
                    automatically.
                  </p>
                </li>

                <li>
                  <span>04</span>
                  <p>
                    The test submits automatically when
                    time ends.
                  </p>
                </li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default MCQDashboard;