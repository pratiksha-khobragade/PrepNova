import React from "react";

const DifficultyBadge = ({ difficulty }) => {
  const difficultyClass = difficulty
    ? difficulty.toLowerCase()
    : "";

  return (
    <span className={`dsa-difficulty-badge ${difficultyClass}`}>
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;