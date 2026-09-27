import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import "./ConnectProfileModal.css";

// Small popup modal used to ask the user for their username
// on whichever platform they clicked "Connect" on.
const ConnectProfileModal = ({
  platformLabel,
  isSubmitting,
  onSubmit,
  onClose,
}) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = username.trim();
    if (!trimmed) return;

    onSubmit(trimmed);
  };

  return (
    <div className="connect-modal-overlay" onClick={onClose}>
      {/* stopPropagation so clicking inside the box doesn't close the modal */}
      <div className="connect-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="connect-modal-header">
          <h3>Connect {platformLabel}</h3>

          <button className="connect-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="platform-username">
            Your {platformLabel} username
          </label>

          <input
            id="platform-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`e.g. your-${platformLabel.toLowerCase()}-handle`}
            autoFocus
          />

          <button
            type="submit"
            className="connect-modal-submit-btn"
            disabled={isSubmitting || !username.trim()}
          >
            {isSubmitting ? "Connecting..." : "Connect"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConnectProfileModal;
