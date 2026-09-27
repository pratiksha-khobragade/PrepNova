import React, { useState } from "react";
import {
  faFlask,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TestCasePanel = ({ testCases = [], result }) => {
  const [activeCase, setActiveCase] = useState(0);

  if (!testCases.length) {
    return (
      <div className="test-case-panel">
        <div className="test-case-empty">
          <FontAwesomeIcon icon={faFlask} />
          <p>No test cases available for this problem.</p>
        </div>
      </div>
    );
  }

  const currentCase = testCases[activeCase];

  const resultType =
    result?.status === "accepted" ? "success" : "error";

  return (
    <div className="test-case-panel">

      {/* Header */}
      <div className="test-case-header">
        <div className="test-case-title">
          <FontAwesomeIcon icon={faFlask} />
          <h3>Test Cases</h3>
        </div>

        {result && (
          <div
            className={`test-case-status ${resultType}`}
          >
            <FontAwesomeIcon
              icon={
                resultType === "success"
                  ? faCircleCheck
                  : faCircleXmark
              }
            />

            {result.title}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="test-case-tabs">
        {testCases.map((_, index) => (
          <button
            key={index}
            type="button"
            className={
              activeCase === index ? "active" : ""
            }
            onClick={() => setActiveCase(index)}
          >
            Case {index + 1}
          </button>
        ))}
      </div>

      {/* Current Test Case */}
      <div className="test-case-content">

        <div className="test-case-item">
          <span>Input</span>
          <pre>{currentCase.input}</pre>
        </div>

        <div className="test-case-item">
          <span>Expected Output</span>
          <pre>{currentCase.output}</pre>
        </div>

      </div>

      {/* Result */}
      {result && (
        <div
          className={`test-case-result ${resultType}`}
        >
          <div className="result-icon">
            <FontAwesomeIcon
              icon={
                resultType === "success"
                  ? faCircleCheck
                  : faCircleXmark
              }
            />
          </div>

          <div className="result-content">
            <strong>
              {result.title}
            </strong>

            <p>
              {result.message}
            </p>

            {result.output && (
              <div className="result-output">
                <span>Your Output</span>
                <pre>{result.output}</pre>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default TestCasePanel;