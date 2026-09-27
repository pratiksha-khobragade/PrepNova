import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCheck,
  faCircleCheck,
  faClock,
  faFlag,
  faListOl,
  faPaperPlane,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import {
  getMCQAttempt,
  getMCQQuestion,
  submitMCQTest,
} from "../../../../api/mcqApi";

import "./MCQTest.css";

const MCQTest = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [attempt, setAttempt] = useState(
    location.state?.attempt || null
  );

  const [questions, setQuestions] = useState(
    location.state?.questions || []
  );

  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(
    !location.state?.questions?.length
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  /*
   * ---------------------------------------------------------
   * LOAD TEST AFTER REFRESH
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const loadTest = async () => {
      if (attempt && questions.length > 0) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getMCQAttempt(attemptId);

        if (!response?.success || !response?.attempt) {
          throw new Error(
            response?.message || "Unable to load this test."
          );
        }

        const loadedAttempt = response.attempt;

        let loadedQuestions = response.questions || [];

        /*
         * Older backend response may only return question IDs.
         * Load each question through the API helper.
         */
        if (
          loadedQuestions.length === 0 &&
          Array.isArray(loadedAttempt.questions)
        ) {
          const questionResponses = await Promise.all(
            loadedAttempt.questions.map(async (question) => {
              const questionId =
                typeof question === "object"
                  ? question._id || question.id
                  : question;

              if (!questionId) {
                return null;
              }

              try {
                const questionResponse =
                  await getMCQQuestion(questionId);

                return (
                  questionResponse?.question ||
                  questionResponse?.data ||
                  null
                );
              } catch (questionError) {
                console.error(
                  "Question Load Error:",
                  questionError
                );

                return null;
              }
            })
          );

          loadedQuestions = questionResponses.filter(Boolean);
        }

        setAttempt(loadedAttempt);
        setQuestions(loadedQuestions);

        /*
         * Restore previously selected answers if backend
         * contains them.
         */
        if (Array.isArray(loadedAttempt.answers)) {
          const restoredAnswers = {};

          loadedAttempt.answers.forEach((answer) => {
            const questionId =
              typeof answer.question === "object"
                ? answer.question?._id ||
                  answer.question?.id
                : answer.question;

            if (questionId) {
              restoredAnswers[String(questionId)] =
                answer.selectedAnswer ?? null;
            }
          });

          setAnswers(restoredAnswers);
        }
      } catch (err) {
        console.error("Load MCQ Test Error:", err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load the test."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [attemptId]);

  /*
   * ---------------------------------------------------------
   * TIMER
   * ---------------------------------------------------------
   */

  const totalDurationSeconds = useMemo(() => {
    return Number(attempt?.durationMinutes || 20) * 60;
  }, [attempt]);

  useEffect(() => {
    if (!attempt || submitting) {
      return;
    }

    const updateTimer = () => {
      const startedAt = new Date(
        attempt.startedAt || attempt.createdAt
      ).getTime();

      if (!startedAt) {
        return;
      }

      const now = Date.now();

      const elapsed = Math.floor(
        (now - startedAt) / 1000
      );

      setElapsedTime(
        Math.min(
          Math.max(elapsed, 0),
          totalDurationSeconds
        )
      );
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [
    attempt,
    totalDurationSeconds,
    submitting,
  ]);

  const remainingSeconds = Math.max(
    totalDurationSeconds - elapsedTime,
    0
  );

  /*
   * ---------------------------------------------------------
   * AUTO SUBMIT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (
      !attempt ||
      loading ||
      submitting ||
      questions.length === 0
    ) {
      return;
    }

    if (remainingSeconds <= 0) {
      handleSubmit(true);
    }
  }, [
    remainingSeconds,
    attempt,
    loading,
    submitting,
    questions.length,
  ]);

  /*
   * ---------------------------------------------------------
   * FORMAT TIMER
   * ---------------------------------------------------------
   */

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(
      Number(seconds) || 0,
      0
    );

    const minutes = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  /*
   * ---------------------------------------------------------
   * ANSWER SELECT
   * ---------------------------------------------------------
   */

  const handleAnswerSelect = (answer) => {
    if (!currentQuestion || submitting) {
      return;
    }

    const questionId =
      currentQuestion._id || currentQuestion.id;

    setAnswers((previous) => ({
      ...previous,
      [String(questionId)]: answer,
    }));
  };

  /*
   * ---------------------------------------------------------
   * NAVIGATION
   * ---------------------------------------------------------
   */

  const goToPrevious = () => {
    setCurrentIndex((index) =>
      Math.max(index - 1, 0)
    );
  };

  const goToNext = () => {
    setCurrentIndex((index) =>
      Math.min(index + 1, questions.length - 1)
    );
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */

  const handleSubmit = async (autoSubmitted = false) => {
    if (submitting || !attemptId) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers = questions.map(
        (question) => {
          const questionId =
            question._id || question.id;

          return {
            questionId,
            selectedAnswer:
              answers[String(questionId)] ?? null,
          };
        }
      );

      const response = await submitMCQTest({
        attemptId,
        answers: formattedAnswers,
        timeTakenSeconds: Math.min(
          Math.max(elapsedTime, 0),
          totalDurationSeconds
        ),
        autoSubmitted,
      });

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to submit the test."
        );
      }

      navigate(`/tests/mcq/result/${attemptId}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Submit MCQ Test Error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to submit the test. Please try again."
      );

      setSubmitting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="mcq-test-page">
        <div className="mcq-test-loading">
          <div className="mcq-test-spinner" />

          <h2>Loading Test...</h2>

          <p>
            Preparing your MCQ questions.
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR
   * ---------------------------------------------------------
   */

  if (error && !currentQuestion) {
    return (
      <div className="mcq-test-page">
        <div className="mcq-test-error">
          <div className="mcq-test-error-icon">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
            />
          </div>

          <h2>Unable to Load Test</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              navigate("/tests/mcq/dashboard")
            }
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  /*
   * ---------------------------------------------------------
   * CURRENT QUESTION DATA
   * ---------------------------------------------------------
   */

  const questionId =
    currentQuestion._id || currentQuestion.id;

  const selectedAnswer =
    answers[String(questionId)] ?? null;

  const answeredCount = questions.filter(
    (question) => {
      const id = question._id || question.id;

      return Boolean(
        answers[String(id)]
      );
    }
  ).length;

  const progressPercentage =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  const isLastQuestion =
    currentIndex === questions.length - 1;

  const timerWarning =
    remainingSeconds <= 60;

  return (
    <div className="mcq-test-page">
      <div className="mcq-test-container">
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mcq-test-header">
          <div className="mcq-test-header-left">
            <button
              type="button"
              className="mcq-test-back-btn"
              onClick={() =>
                navigate("/tests/mcq/dashboard")
              }
              disabled={submitting}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <div>
              <span className="mcq-test-label">
                MCQ TEST
              </span>

              <h1>
                {attempt?.difficulty || "All"} Level
              </h1>
            </div>
          </div>

          <div
            className={`mcq-test-timer ${
              timerWarning ? "warning" : ""
            }`}
          >
            <FontAwesomeIcon icon={faClock} />

            <div>
              <span>Time Remaining</span>
              <strong>
                {formatTime(remainingSeconds)}
              </strong>
            </div>
          </div>
        </header>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="mcq-test-progress-card">
          <div className="mcq-test-progress-top">
            <div>
              <span>Question</span>

              <strong>
                {currentIndex + 1}
                <small> / {questions.length}</small>
              </strong>
            </div>

            <div>
              <span>Answered</span>

              <strong>
                {answeredCount}
                <small> / {questions.length}</small>
              </strong>
            </div>
          </div>

          <div className="mcq-test-progress-track">
            <div
              className="mcq-test-progress-fill"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* =================================================
            QUESTION
        ================================================= */}

        <main className="mcq-test-main">
          <section className="mcq-question-card">
            <div className="mcq-question-meta">
              <span>
                {currentQuestion.subject ||
                  "Computer Science"}
              </span>

              {currentQuestion.topic && (
                <>
                  <span className="mcq-meta-dot">
                    •
                  </span>

                  <span>
                    {currentQuestion.topic}
                  </span>
                </>
              )}

              {currentQuestion.difficulty && (
                <span
                  className={`mcq-question-difficulty ${String(
                    currentQuestion.difficulty
                  ).toLowerCase()}`}
                >
                  {currentQuestion.difficulty}
                </span>
              )}
            </div>

            <h2 className="mcq-question-text">
              {currentQuestion.question}
            </h2>

            <div className="mcq-options">
              {(currentQuestion.options || []).map(
                (option, index) => {
                  const optionLetter =
                    String.fromCharCode(
                      65 + index
                    );

                  const isSelected =
                    selectedAnswer === option;

                  return (
                    <button
                      type="button"
                      key={`${questionId}-${index}`}
                      className={`mcq-option ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() =>
                        handleAnswerSelect(option)
                      }
                      disabled={submitting}
                    >
                      <span className="mcq-option-letter">
                        {optionLetter}
                      </span>

                      <span className="mcq-option-text">
                        {option}
                      </span>

                      {isSelected && (
                        <span className="mcq-option-check">
                          <FontAwesomeIcon
                            icon={faCircleCheck}
                          />
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </section>

          {/* =================================================
              QUESTION PALETTE
          ================================================= */}

          <aside className="mcq-question-palette">
            <div className="mcq-palette-header">
              <div>
                <span>TEST NAVIGATION</span>
                <h2>Questions</h2>
              </div>

              <FontAwesomeIcon icon={faListOl} />
            </div>

            <div className="mcq-palette-grid">
              {questions.map(
                (question, index) => {
                  const id =
                    question._id ||
                    question.id;

                  const isAnswered =
                    Boolean(
                      answers[String(id)]
                    );

                  const isCurrent =
                    index === currentIndex;

                  return (
                    <button
                      type="button"
                      key={String(id)}
                      className={`mcq-palette-number ${
                        isCurrent ? "current" : ""
                      } ${
                        isAnswered ? "answered" : ""
                      }`}
                      onClick={() =>
                        goToQuestion(index)
                      }
                      disabled={submitting}
                    >
                      {index + 1}

                      {isAnswered && (
                        <FontAwesomeIcon
                          icon={faCheck}
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>

            <div className="mcq-palette-legend">
              <div>
                <span className="legend-current" />
                Current
              </div>

              <div>
                <span className="legend-answered" />
                Answered
              </div>

              <div>
                <span className="legend-unanswered" />
                Unanswered
              </div>
            </div>
          </aside>
        </main>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mcq-test-inline-error">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
            />

            <span>{error}</span>
          </div>
        )}

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="mcq-test-footer">
          <button
            type="button"
            className="mcq-test-navigation-btn secondary"
            onClick={goToPrevious}
            disabled={
              currentIndex === 0 ||
              submitting
            }
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Previous
          </button>

          <div className="mcq-test-footer-status">
            <FontAwesomeIcon icon={faFlag} />

            <span>
              {answeredCount} of{" "}
              {questions.length} answered
            </span>
          </div>

          {isLastQuestion ? (
            <button
              type="button"
              className="mcq-test-navigation-btn submit"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="mcq-test-button-spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                  />
                  Submit Test
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              className="mcq-test-navigation-btn primary"
              onClick={goToNext}
              disabled={submitting}
            >
              Next
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default MCQTest;