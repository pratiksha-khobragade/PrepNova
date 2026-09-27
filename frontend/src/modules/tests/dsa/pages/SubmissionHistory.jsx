import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faXmarkCircle,
  faClock,
  faArrowLeft,
  faCode,
} from "@fortawesome/free-solid-svg-icons";

import { getDsaSubmissions } from "../../../../api/dsaApi";
import "./SubmissionHistory.css";

const SubmissionHistory = () => {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSubmissions = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const data = await getDsaSubmissions({
        page,
        limit: 20,
      });

      setSubmissions(data.submissions || []);

      setPagination(
        data.pagination || {
          page,
          limit: 20,
          total: 0,
          totalPages: 1,
        }
      );
    } catch (err) {
      console.error("Submission History Error:", err);
      setError(err.message || "Failed to load submission history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(1);
  }, []);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.page
    ) {
      return;
    }

    fetchSubmissions(page);
  };

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (
      normalizedStatus === "accepted" ||
      normalizedStatus === "success"
    ) {
      return "accepted";
    }

    return "failed";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString();
  };

  const getLanguageLabel = (language) => {
    if (!language) return "Unknown";

    const languageMap = {
      javascript: "JavaScript",
      js: "JavaScript",
      python: "Python",
      java: "Java",
      cpp: "C++",
      "c++": "C++",
    };

    return (
      languageMap[String(language).toLowerCase()] ||
      language
    );
  };

  return (
    <div className="submission-history-page">

      {/* Header */}
      <div className="submission-history-header">
        <div className="submission-history-title-section">

          <button
            type="button"
            className="submission-back-btn"
            onClick={() => navigate("/tests/dsa")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to DSA
          </button>

          <div>
            <h1>Submission History</h1>
            <p>
              Track your previous DSA code submissions and results.
            </p>
          </div>

        </div>

        <div className="submission-total">
          <FontAwesomeIcon icon={faCode} />
          <span>{pagination.total} Submissions</span>
        </div>
      </div>


      {/* Loading */}
      {loading && (
        <div className="submission-state-card">
          <div className="submission-loader"></div>
          <p>Loading submission history...</p>
        </div>
      )}


      {/* Error */}
      {!loading && error && (
        <div className="submission-state-card submission-error-card">

          <FontAwesomeIcon icon={faXmarkCircle} />

          <h3>Unable to load submissions</h3>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => fetchSubmissions(pagination.page)}
          >
            Try Again
          </button>

        </div>
      )}


      {/* Empty */}
      {!loading && !error && submissions.length === 0 && (
        <div className="submission-state-card">

          <FontAwesomeIcon icon={faClock} />

          <h3>No submissions yet</h3>

          <p>
            Your DSA submissions will appear here after you
            submit a solution.
          </p>

          <button
            type="button"
            onClick={() => navigate("/tests/dsa")}
          >
            Practice DSA
          </button>

        </div>
      )}


      {/* Submission List */}
      {!loading && !error && submissions.length > 0 && (
        <>
          <div className="submission-list">

            {submissions.map((submission) => {
              const statusClass = getStatusClass(
                submission.status
              );

              const isAccepted =
                statusClass === "accepted";

              return (
                <div
                  className="submission-card"
                  key={submission.id}
                >

                  {/* Status */}
                  <div
                    className={`submission-status-icon ${statusClass}`}
                  >
                    <FontAwesomeIcon
                      icon={
                        isAccepted
                          ? faCheckCircle
                          : faXmarkCircle
                      }
                    />
                  </div>


                  {/* Main Information */}
                  <div className="submission-main">

                    <div className="submission-problem-row">

                      <h3>
                        {submission.problemTitle ||
                          "Unknown Problem"}
                      </h3>

                      {submission.difficulty && (
                        <span
                          className={`submission-difficulty ${String(
                            submission.difficulty
                          ).toLowerCase()}`}
                        >
                          {submission.difficulty}
                        </span>
                      )}

                    </div>


                    <div className="submission-meta">

                      <span>
                        <strong>Status:</strong>{" "}
                        {submission.status || "Unknown"}
                      </span>

                      <span>
                        <strong>Language:</strong>{" "}
                        {getLanguageLabel(
                          submission.language
                        )}
                      </span>

                      <span>
                        <strong>Tests:</strong>{" "}
                        {submission.passedTestCases ?? 0}
                        {" / "}
                        {submission.totalTestCases ?? 0}
                      </span>

                      <span>
                        <strong>Runtime:</strong>{" "}
                        {submission.runtime !== undefined &&
                        submission.runtime !== null
                          ? `${submission.runtime}s`
                          : "—"}
                      </span>

                      <span>
                        <strong>Memory:</strong>{" "}
                        {submission.memory !== undefined &&
                        submission.memory !== null
                          ? submission.memory
                          : "—"}
                      </span>

                    </div>


                    <div className="submission-date">
                      Submitted:{" "}
                      {formatDate(submission.createdAt)}
                    </div>

                  </div>


                  {/* View Problem */}
                  <div className="submission-action">

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/tests/dsa/problem/${submission.problemId}`
                        )
                      }
                    >
                      View Problem
                    </button>

                  </div>

                </div>
              );
            })}

          </div>


          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="submission-pagination">

              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() =>
                  handlePageChange(
                    pagination.page - 1
                  )
                }
              >
                Previous
              </button>

              <span>
                Page {pagination.page} of{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  handlePageChange(
                    pagination.page + 1
                  )
                }
              >
                Next
              </button>

            </div>
          )}

        </>
      )}

    </div>
  );
};

export default SubmissionHistory;