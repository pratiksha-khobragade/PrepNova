import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faLinkSlash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import "./PlatformCard.css";

// A single card for one platform (GitHub / LeetCode / Codeforces / CodeChef).
// Shows a "Connect" button when no username is saved yet, or the
// synced stats + refresh/disconnect controls once it is connected.
const PlatformCard = ({
  config,
  data,
  isBusy,
  onConnectClick,
  onRefreshClick,
  onDisconnectClick,
}) => {
  const isConnected = Boolean(data?.username);

  return (
    <div className="platform-card">

      {/* =========================
          HEADER (icon + name)
      ========================= */}
      <div className="platform-card-header">
        <div
          className="platform-card-icon"
          style={{ backgroundColor: config.color }}
        >
          <FontAwesomeIcon icon={config.icon} />
        </div>

        <div className="platform-card-title">
          <h3>{config.label}</h3>
          {isConnected && <span>@{data.username}</span>}
        </div>
      </div>

      {/* =========================
          NOT CONNECTED YET
      ========================= */}
      {!isConnected && (
        <div className="platform-card-empty">
          <p>No profile connected yet.</p>

          <button
            className="platform-card-connect-btn"
            onClick={onConnectClick}
            disabled={isBusy}
          >
            <FontAwesomeIcon icon={faPlus} />
            Connect
          </button>
        </div>
      )}

      {/* =========================
          CONNECTED - SHOW STATS
      ========================= */}
      {isConnected && (
        <>
          <div className="platform-card-stats">
            {config.getStatFields(data.stats || {}).map((stat) => (
              <div className="platform-card-stat" key={stat.label}>
                <span className="platform-card-stat-value">
                  {stat.value ?? "-"}
                </span>
                <span className="platform-card-stat-label">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="platform-card-footer">
            <span className="platform-card-synced">
              {data.lastSynced
                ? `Synced ${new Date(data.lastSynced).toLocaleString()}`
                : "Not synced yet"}
            </span>

            <div className="platform-card-actions">
              <button
                title="Refresh stats"
                onClick={onRefreshClick}
                disabled={isBusy}
              >
                <FontAwesomeIcon icon={faArrowsRotate} spin={isBusy} />
              </button>

              <button
                title="Disconnect"
                onClick={onDisconnectClick}
                disabled={isBusy}
              >
                <FontAwesomeIcon icon={faLinkSlash} />
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default PlatformCard;
