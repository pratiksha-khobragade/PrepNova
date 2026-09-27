import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  faArrowLeft,
  faPlay,
  faPaperPlane,
  faChevronLeft,
  faChevronRight,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import TestCasePanel from "../components/TestCasePanel";
import SubmissionResult from "../components/SubmissionResult";

import { starterCode } from "../components/starterCode";

import {
  getDsaProblems,
  getDsaProblem,
  runDsaCode,
  submitDsaCode,
} from "../../../../api/dsaApi";

import "./DSAProblem.css";


const DSAProblem = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // Problem State
  // =========================================================

  const [problem, setProblem] = useState(null);
  const [problems, setProblems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================================================
  // Editor State
  // =========================================================

  const [language, setLanguage] =
    useState("JavaScript");

  const [code, setCode] = useState(
    starterCode.JavaScript
  );

  const [result, setResult] = useState(null);

  const [isRunning, setIsRunning] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // =========================================================
  // Fetch DSA Problems
  // =========================================================

 useEffect(() => {
  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all problems for Previous / Next navigation
      const problemsData = await getDsaProblems();

      const fetchedProblems =
        problemsData?.problems || [];

      setProblems(fetchedProblems);

      // Fetch the exact problem using its route ID
      const problemData =
        await getDsaProblem(problemId);

      const selectedProblem =
        problemData?.problem;

      if (!selectedProblem) {
        setError(
          "The requested DSA problem was not found."
        );

        setProblem(null);
        return;
      }

      setProblem(selectedProblem);
    } catch (err) {
      console.error(
        "Failed to fetch DSA problem:",
        err
      );

      setError(
        err.message ||
          "Unable to load DSA problem."
      );

      setProblem(null);
    } finally {
      setLoading(false);
    }
  };

  if (problemId) {
    fetchProblems();
  }
}, [problemId]);


  // =========================================================
  // Current Problem ID
  // =========================================================

  const getProblemId = (item) => {
    return (
      item?.id ??
      item?.problemId ??
      item?._id
    );
  };


  // =========================================================
  // Current Problem Index
  // =========================================================

  const problemIndex =
    problems.findIndex((item) => {
      const id = getProblemId(item);

      return (
        id !== undefined &&
        String(id) === String(problemId)
      );
    });


  // =========================================================
  // Reset Editor When Problem Changes
  // =========================================================

  useEffect(() => {
    if (!problem) {
      return;
    }

    setLanguage("JavaScript");

    setCode(
      starterCode.JavaScript
    );

    setResult(null);
  }, [problem]);


  // =========================================================
  // Loading
  // =========================================================

  if (loading) {
    return (
      <div className="dsa-problem-not-found">

        <div className="not-found-card">

          <FontAwesomeIcon
            icon={faCircleNotch}
            spin
            style={{
              fontSize: "32px",
              marginBottom: "18px",
            }}
          />

          <h1>
            Loading Problem...
          </h1>

          <p>
            Fetching the DSA problem
            from PrepNova.
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // Error / Not Found
  // =========================================================

  if (!problem || error) {
    return (
      <div className="dsa-problem-not-found">

        <div className="not-found-card">

          <span className="not-found-number">
            404
          </span>

          <h1>
            Problem Not Found
          </h1>

          <p>
            {error ||
              "The DSA problem you're looking for doesn't exist or may have been removed."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/tests/dsa")
            }
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
            />

            Back to DSA
          </button>

        </div>

      </div>
    );
  }


  // =========================================================
  // Language Change
  // =========================================================

  const handleLanguageChange = (
    newLanguage
  ) => {
    setLanguage(newLanguage);

    setCode(
      starterCode[newLanguage] ||
        starterCode.JavaScript
    );

    setResult(null);
  };


  // =========================================================
  // Code Change
  // =========================================================

  const handleCodeChange = (
    newCode
  ) => {
    setCode(newCode);
  };


  // =========================================================
  // Run Code
  // =========================================================

  const handleRunCode = async () => {
    if (
      isRunning ||
      isSubmitting
    ) {
      return;
    }

    try {
      setIsRunning(true);
      setResult(null);

      const currentProblemId =
        getProblemId(problem);

      const data =
        await runDsaCode({
          problemId:
            currentProblemId,
          language,
          code,
        });

      setResult({
        ...data,

        status: data.status,

        title:
          data.status === "accepted"
            ? "All Test Cases Passed"
            : "Test Case Failed",

        message:
          `${data.passedTestCases} / ${data.totalTestCases} test cases passed.`,
      });
    } catch (error) {
      console.error(
        "Run Code Error:",
        error
      );

      setResult({
        status: "error",
        title: "Execution Error",
        message:
          error.message ||
          "Code execution failed.",
      });
    } finally {
      setIsRunning(false);
    }
  };


  // =========================================================
  // Submit Code
  // =========================================================

  const handleSubmit = async () => {
    if (
      isRunning ||
      isSubmitting
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setResult(null);

      const currentProblemId =
        getProblemId(problem);

      const data =
        await submitDsaCode({
          problemId:
            currentProblemId,
          language,
          code,
        });

      const isAccepted =
        data.status === "accepted";

      setResult({
        ...data,

        status: data.status,

        title:
          isAccepted
            ? "Accepted"
            : "Submission Failed",

        message:
          `${data.passedTestCases} / ${data.totalTestCases} test cases passed.`,
      });

    } catch (error) {
      console.error(
        "Submit Code Error:",
        error
      );

      setResult({
        status: "error",
        title: "Submission Error",
        message:
          error.message ||
          "Submission failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // =========================================================
  // Previous Problem
  // =========================================================

  const handlePrevious = () => {
    if (problemIndex <= 0) {
      return;
    }

    const previousProblem =
      problems[
        problemIndex - 1
      ];

    const previousProblemId =
      getProblemId(previousProblem);

    if (
      previousProblemId === undefined
    ) {
      return;
    }

    navigate(
      `/tests/dsa/problem/${previousProblemId}`
    );
  };


  // =========================================================
  // Next Problem
  // =========================================================

  const handleNext = () => {
    if (
      problemIndex === -1 ||
      problemIndex >=
        problems.length - 1
    ) {
      return;
    }

    const nextProblem =
      problems[
        problemIndex + 1
      ];

    const nextProblemId =
      getProblemId(nextProblem);

    if (
      nextProblemId === undefined
    ) {
      return;
    }

    navigate(
      `/tests/dsa/problem/${nextProblemId}`
    );
  };


  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="dsa-problem-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="dsa-problem-header">

        <div className="dsa-problem-header-left">

          <button
            type="button"
            className="back-to-dsa"
            onClick={() =>
              navigate("/tests/dsa")
            }
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
            />

            Back to DSA
          </button>

          <div className="dsa-problem-header-divider" />

          <div className="dsa-problem-header-title">

            <span>
              DSA PRACTICE
            </span>

            <h1>
              {problem.title}
            </h1>

          </div>

        </div>


        {/* =================================================
            PROBLEM NAVIGATION
        ================================================= */}

        <div className="problem-navigation">

          <button
            type="button"
            onClick={handlePrevious}
            disabled={
              problemIndex <= 0
            }
            title="Previous Problem"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
            />
          </button>

          <span>
            {problemIndex + 1} /{" "}
            {problems.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={
              problemIndex >=
              problems.length - 1
            }
            title="Next Problem"
          >
            <FontAwesomeIcon
              icon={faChevronRight}
            />
          </button>

        </div>

      </header>


      {/* =================================================
          WORKSPACE
      ================================================= */}

      <main className="dsa-workspace">

        {/* =================================================
            PROBLEM DESCRIPTION
        ================================================= */}

        <section className="problem-panel">

          <ProblemDescription
            problem={problem}
          />

        </section>


        {/* =================================================
            CODING PANEL
        ================================================= */}

        <section className="coding-panel">

          <div className="editor-container">

            <CodeEditor
              language={language}
              code={code}
              onLanguageChange={
                handleLanguageChange
              }
              onCodeChange={
                handleCodeChange
              }
            />

          </div>


          {/* =================================================
              ACTION BAR
          ================================================= */}

          <div className="coding-action-bar">

            <div className="coding-status">

              {isRunning && (
                <span>
                  Running your code...
                </span>
              )}

              {isSubmitting && (
                <span>
                  Submitting...
                </span>
              )}

              {!isRunning &&
                !isSubmitting &&
                !result && (
                  <span>
                    Ready to run
                  </span>
                )}

              {!isRunning &&
                !isSubmitting &&
                result && (
                  <span>
                    Execution finished
                  </span>
                )}

            </div>


            <div className="coding-actions">

              {/* Run Code */}

              <button
                type="button"
                className="run-code-btn"
                onClick={
                  handleRunCode
                }
                disabled={
                  isRunning ||
                  isSubmitting
                }
              >
                <FontAwesomeIcon
                  icon={faPlay}
                />

                {isRunning
                  ? "Running..."
                  : "Run Code"}
              </button>


              {/* Submit Code */}

              <button
                type="button"
                className="submit-code-btn"
                onClick={
                  handleSubmit
                }
                disabled={
                  isRunning ||
                  isSubmitting
                }
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                />

                {isSubmitting
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </div>

          </div>


          {/* =================================================
              TEST CASES
          ================================================= */}

          <TestCasePanel
            testCases={
              problem.testCases || []
            }
            result={result}
          />


          {/* =================================================
              SUBMISSION RESULT
          ================================================= */}

          {result && (
            <SubmissionResult
              result={result}
            />
          )}

        </section>

      </main>


      {/* =================================================
          FOOTER NAVIGATION
      ================================================= */}

      <footer className="dsa-problem-footer">

        <button
          type="button"
          onClick={
            handlePrevious
          }
          disabled={
            problemIndex <= 0
          }
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
          />

          Previous Problem
        </button>


        <button
          type="button"
          onClick={handleNext}
          disabled={
            problemIndex >=
            problems.length - 1
          }
        >
          Next Problem

          <FontAwesomeIcon
            icon={faChevronRight}
          />

        </button>

      </footer>

    </div>
  );
};

export default DSAProblem;