import React from "react";
import { useNavigate } from "react-router-dom";
import {
  faArrowRight,
  faCheck,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DSAProblemCard = ({ problem }) => {
  const navigate = useNavigate();

  const handleSolve = () => {
  const problemId =
    problem.id ??
    problem.problemId ??
    problem._id;

  navigate(`/tests/dsa/problem/${problemId}`);
};

  return (
    <div className="dsa-problem-card">
      {/* Problem Status */}
      <div className="problem-status">
        {problem.solved ? (
          <span className="solved-icon" title="Solved">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        ) : (
          <span className="unsolved-icon" title="Not solved">
            <FontAwesomeIcon icon={faCode} />
          </span>
        )}
      </div>

      {/* Problem Information */}
      <div className="problem-info">
        <div className="problem-title-row">
          <h3>{problem.title}</h3>

          <span
            className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <p className="problem-description">
          {problem.description}
        </p>

        {/* Topics */}
        <div className="problem-topics">
          {problem.topics?.map((topic) => (
            <span className="topic-tag" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <div className="problem-action">
        <button
          type="button"
          className="solve-problem-btn"
          onClick={handleSolve}
        >
          {problem.solved ? "Practice Again" : "Solve"}

          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default DSAProblemCard;