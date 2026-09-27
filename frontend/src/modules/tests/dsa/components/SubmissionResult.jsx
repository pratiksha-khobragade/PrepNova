import React from "react";
import {
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
  faBug,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const resultConfig = {
  accepted: {
    icon: faCircleCheck,
    title: "Accepted",
    className: "accepted",
  },

  wrong_answer: {
    icon: faCircleXmark,
    title: "Wrong Answer",
    className: "wrong-answer",
  },

  compilation_error: {
    icon: faTriangleExclamation,
    title: "Compilation Error",
    className: "compilation-error",
  },

  runtime_error: {
    icon: faBug,
    title: "Runtime Error",
    className: "runtime-error",
  },

  time_limit: {
    icon: faClock,
    title: "Time Limit Exceeded",
    className: "time-limit",
  },

  info: {
    icon: faTriangleExclamation,
    title: "Information",
    className: "info",
  },
};

const SubmissionResult = ({ result }) => {
  if (!result) {
    return null;
  }

  const config =
    resultConfig[result.status] || resultConfig.info;

  return (
    <div className={`submission-result ${config.className}`}>
      <div className="submission-result-header">
        <div className="submission-result-title">
          <FontAwesomeIcon icon={config.icon} />

          <div>
            <h3>{result.title || config.title}</h3>

            {result.message && (
              <p>{result.message}</p>
            )}
          </div>
        </div>
      </div>

      {result.details && (
        <div className="submission-result-details">
          <h4>Details</h4>
          <pre>{result.details}</pre>
        </div>
      )}

      {result.output && (
        <div className="submission-result-output">
          <h4>Your Output</h4>
          <pre>{result.output}</pre>
        </div>
      )}

      {result.expected && (
        <div className="submission-result-expected">
          <h4>Expected Output</h4>
          <pre>{result.expected}</pre>
        </div>
      )}

      {(result.runtime || result.memory) && (
        <div className="submission-result-stats">
          {result.runtime && (
            <div>
              <span>Runtime</span>
              <strong>{result.runtime}</strong>
            </div>
          )}

          {result.memory && (
            <div>
              <span>Memory</span>
              <strong>{result.memory}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionResult;