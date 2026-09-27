import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faChartColumn,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faClock,
  faListCheck,
  faMinus,
  faRotateRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import { getMCQHistory } from "../../../../api/mcqApi";

import "./MCQHistory.css";

const MCQHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD HISTORY
  // ============================================================

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMCQHistory();

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Unable to load MCQ history."
          );
        }

        setHistory(
          Array.isArray(response.attempts)
            ? response.attempts
            : Array.isArray(response.history)
            ? response.history
            : []
        );
      } catch (err) {
        console.error(
          "MCQ History Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load your MCQ history."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (seconds = 0) => {
    const safeSeconds = Math.max(
      Number(seconds) || 0,
      0
    );

    const minutes = Math.floor(
      safeSeconds / 60
    );

    const remainingSeconds =
      safeSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  const getPercentage = (attempt) => {
    if (
      attempt?.percentage !== undefined &&
      attempt?.percentage !== null
    ) {
      return Math.round(
        Number(attempt.percentage) || 0
      );
    }

    const totalMarks =
      Number(attempt?.totalMarks) || 0;

    const obtainedMarks =
      Number(attempt?.obtainedMarks) || 0;

    if (!totalMarks) {
      return 0;
    }

    return Math.round(
      (obtainedMarks / totalMarks) * 100
    );
  };

  const getStatusLabel = (status) => {
    if (status === "auto-submitted") {
      return "Auto Submitted";
    }

    if (status === "completed") {
      return "Completed";
    }

    if (status === "in-progress") {
      return "In Progress";
    }

    return "Completed";
  };

  const getStatusClass = (status) => {
    if (status === "auto-submitted") {
      return "auto";
    }

    if (status === "in-progress") {
      return "progress";
    }

    return "completed";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="mcq-history-page">
        <div className="mcq-history-loading">
          <div className="mcq-history-spinner" />

          <h2>
            Loading History...
          </h2>

          <p>
            Please wait while we load your
            previous MCQ tests.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="mcq-history-page">
        <div className="mcq-history-container">

          <div className="mcq-history-header">
            <div>
              <div className="mcq-history-breadcrumb">
                <span>Tests</span>

                <FontAwesomeIcon
                  icon={faArrowRight}
                />

                <span>MCQ</span>

                <FontAwesomeIcon
                  icon={faArrowRight}
                />

                <strong>History</strong>
              </div>

              <h1>
                Test History
              </h1>
            </div>

            <button
              type="button"
              className="mcq-history-secondary-btn"
              onClick={() =>
                navigate(
                  "/tests/mcq/dashboard"
                )
              }
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
              />
              Dashboard
            </button>
          </div>

          <div className="mcq-history-error">
            <div className="mcq-history-error-icon">
              <FontAwesomeIcon
                icon={
                  faTriangleExclamation
                }
              />
            </div>

            <h2>
              Unable to Load History
            </h2>

            <p>{error}</p>

            <button
              type="button"
              className="mcq-history-primary-btn"
              onClick={() =>
                window.location.reload()
              }
            >
              <FontAwesomeIcon
                icon={faRotateRight}
              />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // EMPTY HISTORY
  // ============================================================

  return (
    <div className="mcq-history-page">
      <div className="mcq-history-container">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mcq-history-header">

          <div>
            <div className="mcq-history-breadcrumb">
              <span>Tests</span>

              <FontAwesomeIcon
                icon={faArrowRight}
              />

              <span>MCQ</span>

              <FontAwesomeIcon
                icon={faArrowRight}
              />

              <strong>History</strong>
            </div>

            <h1>
              Test History
            </h1>

            <p>
              View your previous MCQ attempts
              and review your performance.
            </p>
          </div>

          <div className="mcq-history-header-actions">

            <button
              type="button"
              className="mcq-history-secondary-btn"
              onClick={() =>
                navigate(
                  "/tests/mcq"
                )
              }
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
              />
              MCQ Home
            </button>

            <button
              type="button"
              className="mcq-history-primary-btn"
              onClick={() =>
                navigate(
                  "/tests/mcq/dashboard"
                )
              }
            >
              <FontAwesomeIcon
                icon={faListCheck}
              />
              Start Test
            </button>

          </div>
        </div>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <div className="mcq-history-summary">

          <div className="mcq-history-summary-card">
            <div className="mcq-history-summary-icon">
              <FontAwesomeIcon
                icon={faChartColumn}
              />
            </div>

            <div>
              <span>
                Total Tests
              </span>

              <strong>
                {history.length}
              </strong>
            </div>
          </div>

          <div className="mcq-history-summary-card">
            <div className="mcq-history-summary-icon">
              <FontAwesomeIcon
                icon={faCircleCheck}
              />
            </div>

            <div>
              <span>
                Questions Correct
              </span>

              <strong>
                {history.reduce(
                  (total, attempt) =>
                    total +
                    (Number(
                      attempt.correctAnswers
                    ) || 0),
                  0
                )}
              </strong>
            </div>
          </div>

          <div className="mcq-history-summary-card">
            <div className="mcq-history-summary-icon">
              <FontAwesomeIcon
                icon={faCheck}
              />
            </div>

            <div>
              <span>
                Questions Attempted
              </span>

              <strong>
                {history.reduce(
                  (total, attempt) =>
                    total +
                    (Number(
                      attempt.attemptedQuestions
                    ) || 0),
                  0
                )}
              </strong>
            </div>
          </div>

        </div>

        {/* ======================================================
            HISTORY LIST
        ====================================================== */}

        {history.length === 0 ? (
          <div className="mcq-history-empty">

            <div className="mcq-history-empty-icon">
              <FontAwesomeIcon
                icon={faListCheck}
              />
            </div>

            <h2>
              No Tests Yet
            </h2>

            <p>
              You haven't completed an MCQ
              test yet. Start your first test
              to see your results here.
            </p>

            <button
              type="button"
              className="mcq-history-primary-btn"
              onClick={() =>
                navigate(
                  "/tests/mcq/dashboard"
                )
              }
            >
              <FontAwesomeIcon
                icon={faListCheck}
              />
              Start Your First Test
            </button>

          </div>
        ) : (
          <div className="mcq-history-list">

            {history.map(
              (attempt, index) => {
                const percentage =
                  getPercentage(
                    attempt
                  );

                const correct =
                  Number(
                    attempt.correctAnswers
                  ) || 0;

                const wrong =
                  Number(
                    attempt.wrongAnswers
                  ) || 0;

                const skipped =
                  Number(
                    attempt.skippedQuestions
                  ) || 0;

                const total =
                  Number(
                    attempt.totalQuestions
                  ) || 0;

                const obtained =
                  Number(
                    attempt.obtainedMarks
                  ) || 0;

                const totalMarks =
                  Number(
                    attempt.totalMarks
                  ) || 0;

                return (
                  <article
                    key={
                      attempt._id ||
                      attempt.id ||
                      index
                    }
                    className="mcq-history-card"
                  >

                    {/* Card Header */}

                    <div className="mcq-history-card-header">

                      <div className="mcq-history-card-title">

                        <div className="mcq-history-card-icon">
                          <FontAwesomeIcon
                            icon={faListCheck}
                          />
                        </div>

                        <div>
                          <span>
                            MCQ Test
                          </span>

                          <h2>
                            Test #
                            {history.length -
                              index}
                          </h2>
                        </div>

                      </div>

                      <div
                        className={`mcq-history-status ${getStatusClass(
                          attempt.status
                        )}`}
                      >
                        {attempt.status ===
                        "auto-submitted" ? (
                          <FontAwesomeIcon
                            icon={
                              faClock
                            }
                          />
                        ) : attempt.status ===
                          "completed" ? (
                          <FontAwesomeIcon
                            icon={
                              faCircleCheck
                            }
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={
                              faClock
                            }
                          />
                        )}

                        {getStatusLabel(
                          attempt.status
                        )}
                      </div>

                    </div>

                    {/* Card Meta */}

                    <div className="mcq-history-card-meta">

                      <div>
                        <span>
                          <FontAwesomeIcon
                            icon={faClock}
                          />
                          Date
                        </span>

                        <strong>
                          {formatDate(
                            attempt.createdAt ||
                              attempt.startedAt
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          <FontAwesomeIcon
                            icon={
                              faListCheck
                            }
                          />
                          Questions
                        </span>

                        <strong>
                          {total}
                        </strong>
                      </div>

                      <div>
                        <span>
                          <FontAwesomeIcon
                            icon={
                              faChartColumn
                            }
                          />
                          Difficulty
                        </span>

                        <strong>
                          {attempt.difficulty ||
                            "All"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          <FontAwesomeIcon
                            icon={faClock}
                          />
                          Time
                        </span>

                        <strong>
                          {formatTime(
                            attempt.timeTakenSeconds
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* Performance */}

                    <div className="mcq-history-performance">

                      <div className="mcq-history-score">

                        <span>
                          Score
                        </span>

                        <strong>
                          {obtained}
                          <small>
                            /
                            {totalMarks}
                          </small>
                        </strong>

                        <b>
                          {percentage}%
                        </b>

                      </div>

                      <div className="mcq-history-progress">

                        <div className="mcq-history-progress-track">
                          <div
                            className="mcq-history-progress-fill"
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  percentage,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />
                        </div>

                      </div>

                      <button
                        type="button"
                        className="mcq-history-review-btn"
                        onClick={() =>
                          navigate(
                            `/tests/mcq/result/${
                              attempt._id ||
                              attempt.id
                            }`
                          )
                        }
                      >
                        View Result

                        <FontAwesomeIcon
                          icon={faArrowRight}
                        />
                      </button>

                    </div>

                    {/* Statistics */}

                    <div className="mcq-history-stats">

                      <div className="correct">
                        <FontAwesomeIcon
                          icon={
                            faCircleCheck
                          }
                        />

                        <span>
                          Correct
                        </span>

                        <strong>
                          {correct}
                        </strong>
                      </div>

                      <div className="wrong">
                        <FontAwesomeIcon
                          icon={
                            faCircleXmark
                          }
                        />

                        <span>
                          Wrong
                        </span>

                        <strong>
                          {wrong}
                        </strong>
                      </div>

                      <div className="skipped">
                        <FontAwesomeIcon
                          icon={faMinus}
                        />

                        <span>
                          Skipped
                        </span>

                        <strong>
                          {skipped}
                        </strong>
                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default MCQHistory;