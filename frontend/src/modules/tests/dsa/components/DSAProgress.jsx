import React, {
  useEffect,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCircleCheck,
  faBolt,
  faFire,
  faChartLine,
  faCode,
  faXmark,
  faTrophy,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import { getDsaProgress } from "../../../../api/dsaApi";

import "./DSAProgress.css";


const DSAProgress = () => {
  const [progress, setProgress] = useState({
    totalProblems: 0,
    solvedProblems: 0,
    remainingProblems: 0,
    solvedPercentage: 0,

    totalSubmissions: 0,
    acceptedSubmissions: 0,
    failedSubmissions: 0,
    accuracy: 0,

    difficulty: {
      easy: {
        total: 0,
        solved: 0,
      },
      medium: {
        total: 0,
        solved: 0,
      },
      hard: {
        total: 0,
        solved: 0,
      },
    },

    currentStreak: 0,
    longestStreak: 0,

    recentSubmissions: [],
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =========================================================
  // Fetch Progress
  // =========================================================

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getDsaProgress();

        if (data?.progress) {
          setProgress(data.progress);
        }
      } catch (err) {
        console.error(
          "Failed to fetch DSA progress:",
          err
        );

        setError(
          err.message ||
            "Failed to load DSA progress."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);


  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <section className="dsa-progress-section">
        <div className="dsa-progress-loading">
          Loading progress...
        </div>
      </section>
    );
  }


  // =========================================================
  // Error
  // =========================================================

  if (error) {
    return (
      <section className="dsa-progress-section">
        <div className="dsa-progress-error">
          {error}
        </div>
      </section>
    );
  }


  // =========================================================
  // Difficulty Data
  // =========================================================

  const easy =
    progress.difficulty?.easy || {
      total: 0,
      solved: 0,
    };

  const medium =
    progress.difficulty?.medium || {
      total: 0,
      solved: 0,
    };

  const hard =
    progress.difficulty?.hard || {
      total: 0,
      solved: 0,
    };


  // =========================================================
  // Difficulty Percentage
  // =========================================================

  const getDifficultyPercentage = (
    solved,
    total
  ) => {
    if (!total) {
      return 0;
    }

    return Math.round(
      (solved / total) * 100
    );
  };


  // =========================================================
  // Recent Submissions
  // =========================================================

  const recentSubmissions =
    progress.recentSubmissions || [];


  return (
    <section className="dsa-progress-section">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dsa-progress-heading">

        <div>
          {/* <span className="dsa-progress-label">
            DSA PROGRESS
          </span> */}

          <h2>
            Your Coding Progress
          </h2>

          {/* <p>
            Track your problem-solving journey
            and submission performance.
          </p> */}
        </div>

      </div>


      {/* =====================================================
          OVERALL PROGRESS
      ===================================================== */}

      <div className="dsa-progress-main">

        <div className="dsa-progress-icon">
          <FontAwesomeIcon
            icon={faCircleCheck}
          />
        </div>

        <div className="dsa-progress-main-content">

          <span className="dsa-progress-label">
            OVERALL PROGRESS
          </span>

          <div className="dsa-progress-value-row">

            <strong>
              {progress.solvedProblems}

              <span>
                {" "}
                / {progress.totalProblems}
              </span>
            </strong>

            <span>
              Problems Solved
            </span>

          </div>

          <div className="dsa-progress-bar">

            <div
              className="dsa-progress-bar-fill"
              style={{
                width: `${progress.solvedPercentage}%`,
              }}
            />

          </div>

          <small>
            {progress.solvedPercentage}%
            completed
          </small>

        </div>

      </div>


      {/* =====================================================
          SUBMISSION STATISTICS
      ===================================================== */}

      <div className="dsa-progress-stats-grid">

        {/* Total Submissions */}

        <div className="dsa-progress-stat">

          <div className="dsa-progress-stat-icon">
            <FontAwesomeIcon
              icon={faCode}
            />
          </div>

          <div>
            <span>
              Submissions
            </span>

            <strong>
              {progress.totalSubmissions}
            </strong>
          </div>

        </div>


        {/* Accepted */}

        <div className="dsa-progress-stat">

          <div className="dsa-progress-stat-icon accepted">
            <FontAwesomeIcon
              icon={faCircleCheck}
            />
          </div>

          <div>
            <span>
              Accepted
            </span>

            <strong>
              {progress.acceptedSubmissions}
            </strong>
          </div>

        </div>


        {/* Failed */}

        <div className="dsa-progress-stat">

          <div className="dsa-progress-stat-icon failed">
            <FontAwesomeIcon
              icon={faXmark}
            />
          </div>

          <div>
            <span>
              Failed
            </span>

            <strong>
              {progress.failedSubmissions}
            </strong>
          </div>

        </div>


        {/* Accuracy */}

        <div className="dsa-progress-stat">

          <div className="dsa-progress-stat-icon accuracy">
            <FontAwesomeIcon
              icon={faChartLine}
            />
          </div>

          <div>
            <span>
              Accuracy
            </span>

            <strong>
              {progress.accuracy}%
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================================
          DIFFICULTY PROGRESS
      ===================================================== */}

      <div className="dsa-difficulty-section">

        <div className="dsa-section-title">

          <div>
            <h3>
              Difficulty Progress
            </h3>

            <p>
              Problems solved by difficulty.
            </p>
          </div>

        </div>


        <div className="dsa-difficulty-list">

          {/* Easy */}

          <div className="dsa-difficulty-row">

            <div className="dsa-difficulty-info">

              <span className="difficulty-name easy">
                Easy
              </span>

              <strong>
                {easy.solved}
                <small>
                  {" "}
                  / {easy.total}
                </small>
              </strong>

            </div>

            <div className="dsa-difficulty-progress">

              <div className="dsa-difficulty-bar">

                <div
                  className="dsa-difficulty-fill easy"
                  style={{
                    width: `${getDifficultyPercentage(
                      easy.solved,
                      easy.total
                    )}%`,
                  }}
                />

              </div>

              <span>
                {getDifficultyPercentage(
                  easy.solved,
                  easy.total
                )}
                %
              </span>

            </div>

          </div>


          {/* Medium */}

          <div className="dsa-difficulty-row">

            <div className="dsa-difficulty-info">

              <span className="difficulty-name medium">
                Medium
              </span>

              <strong>
                {medium.solved}
                <small>
                  {" "}
                  / {medium.total}
                </small>
              </strong>

            </div>

            <div className="dsa-difficulty-progress">

              <div className="dsa-difficulty-bar">

                <div
                  className="dsa-difficulty-fill medium"
                  style={{
                    width: `${getDifficultyPercentage(
                      medium.solved,
                      medium.total
                    )}%`,
                  }}
                />

              </div>

              <span>
                {getDifficultyPercentage(
                  medium.solved,
                  medium.total
                )}
                %
              </span>

            </div>

          </div>


          {/* Hard */}

          <div className="dsa-difficulty-row">

            <div className="dsa-difficulty-info">

              <span className="difficulty-name hard">
                Hard
              </span>

              <strong>
                {hard.solved}
                <small>
                  {" "}
                  / {hard.total}
                </small>
              </strong>

            </div>

            <div className="dsa-difficulty-progress">

              <div className="dsa-difficulty-bar">

                <div
                  className="dsa-difficulty-fill hard"
                  style={{
                    width: `${getDifficultyPercentage(
                      hard.solved,
                      hard.total
                    )}%`,
                  }}
                />

              </div>

              <span>
                {getDifficultyPercentage(
                  hard.solved,
                  hard.total
                )}
                %
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          STREAKS
      ===================================================== */}

      <div className="dsa-streak-grid">

        {/* Current Streak */}

        <div className="dsa-streak-card">

          <div className="dsa-streak-icon current">
            <FontAwesomeIcon
              icon={faFire}
            />
          </div>

          <div>

            <span>
              Current Streak
            </span>

            <strong>
              {progress.currentStreak}
              <small>
                {" "}
                days
              </small>
            </strong>

          </div>

        </div>


        {/* Longest Streak */}

        <div className="dsa-streak-card">

          <div className="dsa-streak-icon longest">
            <FontAwesomeIcon
              icon={faTrophy}
            />
          </div>

          <div>

            <span>
              Longest Streak
            </span>

            <strong>
              {progress.longestStreak}
              <small>
                {" "}
                days
              </small>
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <div className="dsa-recent-section">

        <div className="dsa-section-title">

          <div>
            <h3>
              Recent Activity
            </h3>

            <p>
              Your latest coding submissions.
            </p>
          </div>

        </div>


        {recentSubmissions.length === 0 ? (
          <div className="dsa-recent-empty">

            <FontAwesomeIcon
              icon={faClockRotateLeft}
            />

            <p>
              No submissions yet.
            </p>

            <span>
              Solve a DSA problem to see your
              activity here.
            </span>

          </div>
        ) : (
          <div className="dsa-recent-list">

            {recentSubmissions.map(
              (submission) => {

                const isAccepted =
                  submission.status ===
                  "accepted";

                return (
                  <div
                    className="dsa-recent-item"
                    key={submission.id}
                  >

                    <div
                      className={`dsa-recent-status ${
                        isAccepted
                          ? "accepted"
                          : "failed"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          isAccepted
                            ? faCircleCheck
                            : faXmark
                        }
                      />
                    </div>

                    <div className="dsa-recent-info">

                      <strong>
                        Problem #
                        {submission.problemId}
                      </strong>

                      <span>
                        {submission.language ||
                          "Unknown"}{" "}
                        •{" "}
                        {submission.passedTestCases ||
                          0}
                        /
                        {submission.totalTestCases ||
                          0}{" "}
                        tests passed
                      </span>

                    </div>

                    <span
                      className={`dsa-recent-result ${
                        isAccepted
                          ? "accepted"
                          : "failed"
                      }`}
                    >
                      {isAccepted
                        ? "Accepted"
                        : "Failed"}
                    </span>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

    </section>
  );
};


export default DSAProgress;