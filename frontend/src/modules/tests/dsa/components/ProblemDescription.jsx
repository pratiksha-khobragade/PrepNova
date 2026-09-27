import React from "react";

const ProblemDescription = ({ problem }) => {
  if (!problem) {
    return (
      <div className="problem-description-empty">
        <h2>Problem Not Found</h2>
        <p>
          The requested problem could not be found. Please return to the DSA
          problem list and select another problem.
        </p>
      </div>
    );
  }

  return (
    <div className="problem-description-content">
      {/* Problem Header */}
      <div className="problem-description-header">
        <div className="problem-number">
          Problem #{problem.id}
        </div>

        <h1>{problem.title}</h1>

        <div className="problem-description-meta">
          <span
            className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}
          >
            {problem.difficulty}
          </span>

          {problem.topics?.map((topic) => (
            <span className="problem-topic" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <section className="problem-content-section">
        <h2>Problem</h2>

        <p>
          {problem.description ||
            "Solve the given problem using an efficient approach."}
        </p>
      </section>

      {/* Example */}
      {problem.example && (
        <section className="problem-content-section">
          <h2>Example</h2>

          <div className="problem-example-box">
            <div className="example-item">
              <span>Input</span>
              <code>{problem.example.input}</code>
            </div>

            <div className="example-item">
              <span>Output</span>
              <code>{problem.example.output}</code>
            </div>

            {problem.example.explanation && (
              <div className="example-item">
                <span>Explanation</span>
                <p>{problem.example.explanation}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Constraints */}
      {problem.constraints?.length > 0 && (
        <section className="problem-content-section">
          <h2>Constraints</h2>

          <ul className="problem-constraints">
            {problem.constraints.map((constraint, index) => (
              <li key={index}>{constraint}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Topics */}
      {problem.topics?.length > 0 && (
        <section className="problem-content-section">
          <h2>Topics</h2>

          <div className="problem-topic-list">
            {problem.topics.map((topic) => (
              <span key={topic} className="problem-topic-large">
                {topic}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProblemDescription;