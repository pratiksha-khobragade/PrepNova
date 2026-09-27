import React, { useEffect, useMemo, useState } from "react";
import { getInterviewReport } from "../../../api/interviewApi";
import "./InterviewReport.css";

const InterviewReport = ({
  interviewId,
  report: initialReport,
  onNewInterview,
}) => {
  const [report, setReport] = useState(initialReport || null);
  const [loading, setLoading] = useState(!initialReport);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!interviewId || initialReport) {
      return;
    }

    loadReport();
  }, [interviewId, initialReport]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInterviewReport(interviewId);

      setReport(
        response.report ||
          response.data ||
          response.interview ||
          response
      );
    } catch (err) {
      console.error("Interview report error:", err);

      setError(
        err.message || "Unable to load interview report."
      );
    } finally {
      setLoading(false);
    }
  };

  const questions = useMemo(() => {
    return (
      report?.questions ||
      report?.questionBreakdown ||
      report?.results ||
      []
    );
  }, [report]);

  const overallScore = Number(
    report?.finalScore ??
      report?.overallScore ??
      report?.score ??
      0
  );

  const confidenceScore = Number(
    report?.confidenceScore ??
      report?.confidence ??
      0
  );

  const communicationScore = Number(
    report?.communicationScore ??
      report?.communication ??
      0
  );

  const correctnessScore = Number(
    report?.correctnessScore ??
      report?.correctness ??
      0
  );

  const role = report?.role || "AI Interview";

  const mode = report?.mode || "Technical";

  const experience = report?.experience || "";

  const getScoreLabel = (score) => {
    if (score >= 8.5) return "Excellent";
    if (score >= 7) return "Strong";
    if (score >= 5) return "Developing";

    return "Needs Improvement";
  };

  const getScoreClass = (score) => {
    if (score >= 8.5) return "excellent";
    if (score >= 7) return "strong";
    if (score >= 5) return "developing";

    return "needs-work";
  };

  const getPercentage = (score) => {
    return Math.max(
      0,
      Math.min(100, (Number(score) / 10) * 100)
    );
  };

  const getQuestionScore = (item) => {
    return Number(
      item?.score ??
        item?.overallScore ??
        item?.evaluation?.score ??
        0
    );
  };

  const getQuestionFeedback = (item) => {
    return (
      item?.feedback ||
      item?.evaluation?.feedback ||
      item?.message ||
      "No detailed feedback available."
    );
  };

  const getQuestionText = (item, index) => {
    return (
      item?.question ||
      item?.questionText ||
      `Interview Question ${index + 1}`
    );
  };

  const getAnswerText = (item) => {
    return item?.answer || "No answer recorded.";
  };

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const autoTableModule = await import(
        "jspdf-autotable"
      );

      const autoTable =
        autoTableModule.default ||
        autoTableModule.autoTable;

      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFillColor(22, 120, 74);
      doc.rect(0, 0, pageWidth, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(21);
      doc.setFont("helvetica", "bold");
      doc.text("PrepNova", 18, 15);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("AI Interview Performance Report", 18, 24);

      doc.setTextColor(35, 52, 43);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Interview Overview", 18, 49);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      doc.text(`Role: ${role}`, 18, 59);
      doc.text(`Interview Type: ${mode}`, 18, 66);

      if (experience) {
        doc.text(
          `Experience: ${experience}`,
          18,
          73
        );
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      doc.text(
        `Overall Score: ${overallScore}/10`,
        18,
        88
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Confidence: ${confidenceScore}/10`,
        18,
        97
      );

      doc.text(
        `Communication: ${communicationScore}/10`,
        18,
        104
      );

      doc.text(
        `Correctness: ${correctnessScore}/10`,
        18,
        111
      );

      if (questions.length > 0 && autoTable) {
        const rows = questions.map((item, index) => [
          index + 1,
          getQuestionText(item, index),
          `${getQuestionScore(item)}/10`,
          getQuestionFeedback(item),
        ]);

        autoTable(doc, {
          startY: 122,
          head: [
            [
              "#",
              "Question",
              "Score",
              "AI Feedback",
            ],
          ],
          body: rows,
          theme: "grid",
          styles: {
            fontSize: 8,
            cellPadding: 4,
            textColor: [45, 58, 51],
          },
          headStyles: {
            fillColor: [22, 120, 74],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          columnStyles: {
            0: {
              cellWidth: 10,
            },
            1: {
              cellWidth: 62,
            },
            2: {
              cellWidth: 20,
            },
            3: {
              cellWidth: 82,
            },
          },
        });
      }

      const finalY =
        doc.lastAutoTable?.finalY
          ? doc.lastAutoTable.finalY + 18
          : 130;

      const summary =
        report?.summary ||
        report?.overallFeedback ||
        report?.feedback ||
        "Keep practicing structured, clear, and confident responses.";

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Overall Feedback", 18, finalY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const wrappedSummary = doc.splitTextToSize(
        summary,
        pageWidth - 36
      );

      doc.text(
        wrappedSummary,
        18,
        finalY + 9
      );

      doc.save(
        `PrepNova-AI-Interview-${role
          .replace(/[^a-z0-9]/gi, "-")
          .toLowerCase()}.pdf`
      );
    } catch (err) {
      console.error("PDF generation error:", err);

      alert(
        "Unable to generate the PDF report. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="interview-report-page">
        <div className="report-loading">
          <div className="report-loader"></div>

          <h2>Preparing your report</h2>

          <p>
            We're compiling your interview performance...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="interview-report-page">
        <div className="report-error-card">
          <div className="report-error-icon">!</div>

          <h2>Unable to load report</h2>

          <p>
            {error ||
              "Interview report data is not available."}
          </p>

          <button
            type="button"
            onClick={loadReport}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-report-page">
      {/* Header */}

      <header className="report-header">
        <div className="report-brand">
          <div className="report-brand-mark">P</div>

          <div>
            <strong>PrepNova</strong>
            <span>AI Interview</span>
          </div>
        </div>

        <div className="report-header-actions">
          <button
            type="button"
            className="new-interview-button"
            onClick={onNewInterview}
          >
            ← New Interview
          </button>

          <button
            type="button"
            className="download-report-button"
            onClick={handleDownloadPDF}
          >
            <span>↓</span>
            Download PDF
          </button>
        </div>
      </header>

      <main className="report-content">
        {/* Hero */}

        <section className="report-hero">
          <div className="hero-copy">
            <span className="report-eyebrow">
              INTERVIEW COMPLETE
            </span>

            <h1>
              Your AI Interview
              <br />
              Performance Report
            </h1>

            <p>
              Here's a detailed breakdown of your
              performance, communication, confidence, and
              technical understanding.
            </p>

            <div className="interview-info">
              <span>
                <strong>Role</strong>
                {role}
              </span>

              <span>
                <strong>Type</strong>
                {mode}
              </span>

              {experience && (
                <span>
                  <strong>Experience</strong>
                  {experience}
                </span>
              )}
            </div>
          </div>

          {/* Overall Score */}

          <div className="overall-score-card">
            <div
              className={`score-ring ${getScoreClass(
                overallScore
              )}`}
              style={{
                "--score-progress": `${getPercentage(
                  overallScore
                )}%`,
              }}
            >
              <div className="score-ring-inner">
                <strong>{overallScore}</strong>
                <span>/ 10</span>
              </div>
            </div>

            <div className="overall-score-copy">
              <strong>
                {getScoreLabel(overallScore)}
              </strong>

              <span>Overall Performance</span>
            </div>
          </div>
        </section>

        {/* Metric Cards */}

        <section className="report-metrics">
          <div className="report-metric-card">
            <div className="metric-top">
              <span className="metric-icon">◉</span>
              <span>Confidence</span>
            </div>

            <div className="metric-value">
              <strong>{confidenceScore}</strong>
              <span>/10</span>
            </div>

            <div className="metric-progress">
              <div
                style={{
                  width: `${getPercentage(
                    confidenceScore
                  )}%`,
                }}
              ></div>
            </div>

            <small>
              How confidently you communicated your
              answers.
            </small>
          </div>

          <div className="report-metric-card">
            <div className="metric-top">
              <span className="metric-icon">✦</span>
              <span>Communication</span>
            </div>

            <div className="metric-value">
              <strong>{communicationScore}</strong>
              <span>/10</span>
            </div>

            <div className="metric-progress">
              <div
                style={{
                  width: `${getPercentage(
                    communicationScore
                  )}%`,
                }}
              ></div>
            </div>

            <small>
              Clarity, structure, and effectiveness of
              your responses.
            </small>
          </div>

          <div className="report-metric-card">
            <div className="metric-top">
              <span className="metric-icon">✓</span>
              <span>Correctness</span>
            </div>

            <div className="metric-value">
              <strong>{correctnessScore}</strong>
              <span>/10</span>
            </div>

            <div className="metric-progress">
              <div
                style={{
                  width: `${getPercentage(
                    correctnessScore
                  )}%`,
                }}
              ></div>
            </div>

            <small>
              Accuracy and depth of your answers.
            </small>
          </div>
        </section>

        {/* Summary + Performance */}

        <section className="report-analysis-grid">
          <div className="summary-card">
            <div className="section-heading">
              <span className="section-kicker">
                AI INSIGHTS
              </span>

              <h2>Performance Summary</h2>
            </div>

            <div className="summary-body">
              <div className="summary-symbol">✦</div>

              <p>
                {report.summary ||
                  report.overallFeedback ||
                  report.feedback ||
                  "Your interview has been evaluated across confidence, communication, and correctness. Review the question-level feedback below to identify areas for continued improvement."}
              </p>
            </div>

            {(report.strengths?.length > 0 ||
              report.improvementAreas?.length > 0 ||
              report.weaknesses?.length > 0) && (
              <div className="insight-columns">
                {report.strengths?.length > 0 && (
                  <div className="insight-block strengths">
                    <div className="insight-title">
                      <span>✓</span>
                      Strengths
                    </div>

                    <ul>
                      {report.strengths.map(
                        (item, index) => (
                          <li key={index}>{item}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {(report.improvementAreas?.length > 0 ||
                  report.weaknesses?.length > 0) && (
                  <div className="insight-block improvements">
                    <div className="insight-title">
                      <span>↗</span>
                      Areas to Improve
                    </div>

                    <ul>
                      {(
                        report.improvementAreas ||
                        report.weaknesses ||
                        []
                      ).map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="performance-card">
            <div className="section-heading">
              <span className="section-kicker">
                SCORE BREAKDOWN
              </span>

              <h2>Performance Overview</h2>
            </div>

            <div className="performance-bars">
              {[
                {
                  label: "Overall",
                  value: overallScore,
                },
                {
                  label: "Confidence",
                  value: confidenceScore,
                },
                {
                  label: "Communication",
                  value: communicationScore,
                },
                {
                  label: "Correctness",
                  value: correctnessScore,
                },
              ].map((item) => (
                <div
                  className="performance-row"
                  key={item.label}
                >
                  <div className="performance-row-top">
                    <span>{item.label}</span>
                    <strong>
                      {item.value}/10
                    </strong>
                  </div>

                  <div className="performance-track">
                    <div
                      style={{
                        width: `${getPercentage(
                          item.value
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Question Breakdown */}

        <section className="questions-section">
          <div className="section-heading questions-heading">
            <div>
              <span className="section-kicker">
                QUESTION ANALYSIS
              </span>

              <h2>Question-by-Question Breakdown</h2>
            </div>

            <span className="question-count">
              {questions.length} Questions
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="empty-questions">
              <span>○</span>
              <p>
                Detailed question analysis is not
                available for this interview.
              </p>
            </div>
          ) : (
            <div className="question-results">
              {questions.map((item, index) => {
                const score = getQuestionScore(item);

                return (
                  <article
                    className="question-result-card"
                    key={
                      item?._id ||
                      item?.id ||
                      index
                    }
                  >
                    <div className="question-number">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="question-result-main">
                      <div className="question-result-top">
                        <div>
                          <span className="question-result-label">
                            QUESTION {index + 1}
                          </span>

                          <h3>
                            {getQuestionText(
                              item,
                              index
                            )}
                          </h3>
                        </div>

                        <div
                          className={`question-score ${getScoreClass(
                            score
                          )}`}
                        >
                          <strong>{score}</strong>
                          <span>/10</span>
                        </div>
                      </div>

                      <div className="candidate-answer">
                        <span>Your Answer</span>

                        <p>{getAnswerText(item)}</p>
                      </div>

                      <div className="question-feedback">
                        <span>✦ AI Feedback</span>

                        <p>
                          {getQuestionFeedback(
                            item
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom CTA */}

        <section className="report-final-cta">
          <div>
            <span>READY FOR ANOTHER ROUND?</span>

            <h2>
              Keep practicing. Keep improving.
            </h2>

            <p>
              Take another AI interview and track how
              your performance changes over time.
            </p>
          </div>

          <button
            type="button"
            onClick={onNewInterview}
          >
            Start New Interview
            <span>→</span>
          </button>
        </section>

        <footer className="report-footer">
          <span>
            Generated by <strong>PrepNova AI</strong>
          </span>

          <span>
            Practice smarter. Interview better.
          </span>
        </footer>
      </main>
    </div>
  );
};

export default InterviewReport;