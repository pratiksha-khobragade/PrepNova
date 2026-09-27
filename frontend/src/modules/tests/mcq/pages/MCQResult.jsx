import React, { useEffect, useMemo, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  faArrowLeft,
  faArrowRight,
  faChartColumn,
  faCheck,
  faCircleCheck,
  faCircleXmark,
  faClock,
  faGaugeHigh,
  faLightbulb,
  faListCheck,
  faMinus,
  faRotateRight,
  faTriangleExclamation,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getMCQResult,
} from "../../../../api/mcqApi";

import "./MCQResult.css";

const MCQResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [result, setResult] = useState(
    location.state?.result || null
  );

  const [loading, setLoading] = useState(
    !location.state?.result
  );

  const [error, setError] = useState("");

  // ============================================================
  // LOAD COMPLETE RESULT
  // ============================================================

  useEffect(() => {
    const loadResult = async () => {
      // If complete result was already passed through navigation,
      // no API request is necessary.
      if (location.state?.result) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getMCQResult(attemptId);

        if (!response?.success) {
          throw new Error(
            response?.message ||
              "Unable to load test result."
          );
        }

        setResult(response);
      } catch (err) {
        console.error(
          "MCQ Result Error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load your test result."
        );
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      loadResult();
    }
  }, [attemptId, location.state]);

  // ============================================================
  // DATA
  // ============================================================

  const attempt = result?.attempt || null;

  const questions = useMemo(() => {
    return Array.isArray(result?.questions)
      ? result.questions
      : [];
  }, [result]);

  // ============================================================
  // HELPERS
  // ============================================================

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

  const getAnswerForQuestion = (questionId) => {
    if (!attempt?.answers) {
      return null;
    }

    const answer = attempt.answers.find(
      (item) =>
        String(item.question) ===
        String(questionId)
    );

    return answer || null;
  };

  const getQuestionStatus = (question) => {
    const answer = getAnswerForQuestion(
      question._id
    );

    if (!answer?.selectedAnswer) {
      return "skipped";
    }

    if (answer.isCorrect) {
      return "correct";
    }

    return "wrong";
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="mcq-result-page">
        <div className="mcq-result-loading">
          <div className="mcq-result-spinner" />

          <h2>Loading Result...</h2>

          <p>
            Please wait while we prepare your
            detailed result.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !attempt) {
    return (
      <div className="mcq-result-page">
        <div className="mcq-result-error">
          <div className="mcq-result-error-icon">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
            />
          </div>

          <h2>Unable to Load Result</h2>

          <p>
            {error ||
              "The test result could not be found."}
          </p>

          <div className="mcq-result-error-actions">
            <button
              type="button"
              className="mcq-result-secondary-btn"
              onClick={() =>
                navigate(
                  "/tests/mcq/dashboard"
                )
              }
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
              />
              Back to Dashboard
            </button>

            <button
              type="button"
              className="mcq-result-primary-btn"
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
  // RESULT VALUES
  // ============================================================

  const totalQuestions =
    Number(attempt.totalQuestions) ||
    questions.length ||
    0;

  const correctAnswers =
    Number(attempt.correctAnswers) || 0;

  const wrongAnswers =
    Number(attempt.wrongAnswers) || 0;

  const skippedQuestions =
    Number(attempt.skippedQuestions) || 0;

  const attemptedQuestions =
    Number(attempt.attemptedQuestions) ||
    correctAnswers + wrongAnswers;

  const totalMarks =
    Number(attempt.totalMarks) || 0;

  const obtainedMarks =
    Number(attempt.obtainedMarks) || 0;

  const percentage = Math.round(
    Number(attempt.percentage) || 0
  );

  const timeTaken =
    Number(attempt.timeTakenSeconds) || 0;

  const difficulty =
    attempt.difficulty || "All";

  const status =
    attempt.status || "completed";

  // ============================================================
  // RESULT MESSAGE
  // ============================================================

  const getResultMessage = () => {
    if (percentage >= 80) {
      return "Excellent performance! Keep up the great work.";
    }

    if (percentage >= 60) {
      return "Good job! Keep practicing to improve further.";
    }

    if (percentage >= 40) {
      return "Nice attempt! Review the explanations and keep practicing.";
    }

    return "Keep practicing! Review your mistakes and try again.";
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mcq-result-page">
      <div className="mcq-result-container">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mcq-result-header">
          <div>
            <div className="mcq-result-breadcrumb">
              <span>Tests</span>
              <FontAwesomeIcon
                icon={faArrowRight}
              />
              <span>MCQ</span>
              <FontAwesomeIcon
                icon={faArrowRight}
              />
              <strong>Result</strong>
            </div>

            <h1>
              Test Result
            </h1>

            <p>
              Review your performance and
              understand every question.
            </p>
          </div>

          <div className="mcq-result-header-actions">
            <button
              type="button"
              className="mcq-result-secondary-btn"
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

            <button
              type="button"
              className="mcq-result-primary-btn"
              onClick={() =>
                navigate(
                  "/tests/mcq/dashboard"
                )
              }
            >
              <FontAwesomeIcon
                icon={faRotateRight}
              />
              Take Another Test
            </button>
          </div>
        </div>

        {/* ======================================================
            SCORE CARD
        ====================================================== */}

        <section className="mcq-result-score-card">

          <div className="mcq-result-score-icon">
            <FontAwesomeIcon
              icon={faTrophy}
            />
          </div>

          <div className="mcq-result-score-content">
            <span className="mcq-result-score-label">
              Your Score
            </span>

            <div className="mcq-result-score">
              {obtainedMarks}
              <span>
                / {totalMarks}
              </span>
            </div>

            <div className="mcq-result-score-percentage">
              {percentage}%
            </div>

            <p>
              {getResultMessage()}
            </p>
          </div>

          <div className="mcq-result-score-meta">
            <div>
              <FontAwesomeIcon
                icon={faGaugeHigh}
              />

              <span>
                {difficulty}
              </span>
            </div>

            <div>
              <FontAwesomeIcon
                icon={faClock}
              />

              <span>
                {formatTime(timeTaken)}
              </span>
            </div>

            <div>
              <FontAwesomeIcon
                icon={faCheck}
              />

              <span>
                {status === "auto-submitted"
                  ? "Auto Submitted"
                  : "Completed"}
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================
            STATISTICS
        ====================================================== */}

        <section className="mcq-result-stats">

          <div className="mcq-result-stat-card">
            <div className="mcq-result-stat-icon">
              <FontAwesomeIcon
                icon={faListCheck}
              />
            </div>

            <div>
              <span>
                Total Questions
              </span>

              <strong>
                {totalQuestions}
              </strong>
            </div>
          </div>

          <div className="mcq-result-stat-card correct">
            <div className="mcq-result-stat-icon">
              <FontAwesomeIcon
                icon={faCircleCheck}
              />
            </div>

            <div>
              <span>
                Correct
              </span>

              <strong>
                {correctAnswers}
              </strong>
            </div>
          </div>

          <div className="mcq-result-stat-card wrong">
            <div className="mcq-result-stat-icon">
              <FontAwesomeIcon
                icon={faCircleXmark}
              />
            </div>

            <div>
              <span>
                Wrong
              </span>

              <strong>
                {wrongAnswers}
              </strong>
            </div>
          </div>

          <div className="mcq-result-stat-card skipped">
            <div className="mcq-result-stat-icon">
              <FontAwesomeIcon
                icon={faMinus}
              />
            </div>

            <div>
              <span>
                Skipped
              </span>

              <strong>
                {skippedQuestions}
              </strong>
            </div>
          </div>

          <div className="mcq-result-stat-card">
            <div className="mcq-result-stat-icon">
              <FontAwesomeIcon
                icon={faChartColumn}
              />
            </div>

            <div>
              <span>
                Attempted
              </span>

              <strong>
                {attemptedQuestions}
              </strong>
            </div>
          </div>

          <div className="mcq-result-stat-card">
            <div className="mcq-result-stat-icon">
              <FontAwesomeIcon
                icon={faClock}
              />
            </div>

            <div>
              <span>
                Time Taken
              </span>

              <strong>
                {formatTime(timeTaken)}
              </strong>
            </div>
          </div>

        </section>

        {/* ======================================================
            DETAILED REVIEW
        ====================================================== */}

        <section className="mcq-result-review">

          <div className="mcq-result-review-header">
            <div>
              <h2>
                <FontAwesomeIcon
                  icon={faListCheck}
                />
                Detailed Review
              </h2>

              <p>
                Review your answers and
                understand each question.
              </p>
            </div>

            <span className="mcq-result-question-count">
              {questions.length} Questions
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="mcq-result-no-questions">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
              />

              <h3>
                Detailed Review Unavailable
              </h3>

              <p>
                The test result was saved, but
                detailed question information
                could not be loaded.
              </p>
            </div>
          ) : (
            <div className="mcq-result-question-list">

              {questions.map(
                (question, index) => {
                  const answer =
                    getAnswerForQuestion(
                      question._id
                    );

                  const questionStatus =
                    getQuestionStatus(
                      question
                    );

                  const selectedAnswer =
                    answer?.selectedAnswer ||
                    null;

                  const correctAnswer =
                    answer?.correctAnswer ||
                    question.correctAnswer ||
                    null;

                  return (
                    <article
                      key={question._id}
                      className={`mcq-result-question-card ${questionStatus}`}
                    >

                      {/* Question Header */}

                      <div className="mcq-result-question-top">

                        <div className="mcq-result-question-number">
                          Q{index + 1}
                        </div>

                        <div className="mcq-result-question-info">

                          <div className="mcq-result-question-tags">
                            <span>
                              {question.subject}
                            </span>

                            <span>
                              {question.topic}
                            </span>

                            <span>
                              {question.difficulty}
                            </span>
                          </div>

                          <h3>
                            {question.question}
                          </h3>

                        </div>

                        <div
                          className={`mcq-result-question-status ${questionStatus}`}
                        >
                          {questionStatus ===
                            "correct" && (
                            <>
                              <FontAwesomeIcon
                                icon={
                                  faCircleCheck
                                }
                              />
                              Correct
                            </>
                          )}

                          {questionStatus ===
                            "wrong" && (
                            <>
                              <FontAwesomeIcon
                                icon={
                                  faCircleXmark
                                }
                              />
                              Wrong
                            </>
                          )}

                          {questionStatus ===
                            "skipped" && (
                            <>
                              <FontAwesomeIcon
                                icon={faMinus}
                              />
                              Skipped
                            </>
                          )}
                        </div>

                      </div>

                      {/* Options */}

                      <div className="mcq-result-options">

                        {Array.isArray(
                          question.options
                        ) &&
                          question.options.map(
                            (
                              option,
                              optionIndex
                            ) => {

                              const isSelected =
                                selectedAnswer ===
                                option;

                              const isCorrect =
                                correctAnswer ===
                                option;

                              let optionClass =
                                "";

                              if (isCorrect) {
                                optionClass =
                                  "correct";
                              } else if (
                                isSelected
                              ) {
                                optionClass =
                                  "wrong";
                              }

                              return (
                                <div
                                  key={`${question._id}-${optionIndex}`}
                                  className={`mcq-result-option ${optionClass}`}
                                >

                                  <span className="mcq-result-option-letter">
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                  </span>

                                  <span className="mcq-result-option-text">
                                    {option}
                                  </span>

                                  <span className="mcq-result-option-icon">

                                    {isCorrect && (
                                      <FontAwesomeIcon
                                        icon={
                                          faCircleCheck
                                        }
                                      />
                                    )}

                                    {isSelected &&
                                      !isCorrect && (
                                        <FontAwesomeIcon
                                          icon={
                                            faCircleXmark
                                          }
                                        />
                                      )}

                                  </span>

                                </div>
                              );
                            }
                          )}

                      </div>

                      {/* Answer Summary */}

                      <div className="mcq-result-answer-summary">

                        <div className="mcq-result-answer-row">

                          <span>
                            Your Answer
                          </span>

                          <strong
                            className={
                              selectedAnswer
                                ? questionStatus
                                : "skipped"
                            }
                          >
                            {selectedAnswer ||
                              "Not Attempted"}
                          </strong>

                        </div>

                        <div className="mcq-result-answer-row">

                          <span>
                            Correct Answer
                          </span>

                          <strong className="correct">
                            {correctAnswer ||
                              "Not Available"}
                          </strong>

                        </div>

                      </div>

                      {/* Explanation */}

                      {question.explanation && (
                        <div className="mcq-result-explanation">

                          <div className="mcq-result-explanation-icon">
                            <FontAwesomeIcon
                              icon={
                                faLightbulb
                              }
                            />
                          </div>

                          <div>
                            <h4>
                              Explanation
                            </h4>

                            <p>
                              {
                                question.explanation
                              }
                            </p>
                          </div>

                        </div>
                      )}

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ======================================================
            BOTTOM ACTIONS
        ====================================================== */}

        <div className="mcq-result-bottom-actions">

          <button
            type="button"
            className="mcq-result-secondary-btn"
            onClick={() =>
              navigate(
                "/tests/mcq/history"
              )
            }
          >
            <FontAwesomeIcon
              icon={faChartColumn}
            />
            View History
          </button>

          <button
            type="button"
            className="mcq-result-primary-btn"
            onClick={() =>
              navigate(
                "/tests/mcq/dashboard"
              )
            }
          >
            Go to Dashboard
            <FontAwesomeIcon
              icon={faArrowRight}
            />
          </button>

        </div>

      </div>
    </div>
  );
};

export default MCQResult;