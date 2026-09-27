import React, { useEffect, useState } from "react";

import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faCode,
  faTrophy,
  faBowlFood,
} from "@fortawesome/free-solid-svg-icons";

import PlatformCard from "./components/PlatformCard";
import ConnectProfileModal from "./components/ConnectProfileModal";

import {
  getProgress,
  connectPlatform,
  refreshPlatform,
  disconnectPlatform,
} from "../../api/progressApi";

import "./ProgressTracking.css";

// -----------------------------------------------------
// Config for the 4 platforms we support. To add a new
// platform later: add one entry here, plus one matching
// service function on the backend. Nothing else changes.
// -----------------------------------------------------
const PLATFORMS = [
  {
    key: "github",
    label: "GitHub",
    icon: faGithub,
    color: "#24292f",
    getStatFields: (stats) => [
      { label: "Public Repos", value: stats.publicRepos },
      { label: "Followers", value: stats.followers },
      { label: "Following", value: stats.following },
    ],
  },
  {
    key: "leetcode",
    label: "LeetCode",
    icon: faCode,
    color: "#f89f1b",
    getStatFields: (stats) => [
      { label: "Total Solved", value: stats.totalSolved },
      { label: "Easy", value: stats.easySolved },
      { label: "Medium", value: stats.mediumSolved },
      { label: "Hard", value: stats.hardSolved },
    ],
  },
  {
    key: "codeforces",
    label: "Codeforces",
    icon: faTrophy,
    color: "#1f8acb",
    getStatFields: (stats) => [
      { label: "Rating", value: stats.rating },
      { label: "Max Rating", value: stats.maxRating },
      { label: "Rank", value: stats.rank },
    ],
  },
  {
    key: "codechef",
    label: "CodeChef",
    icon: faBowlFood,
    color: "#5b4638",
    getStatFields: (stats) => [
      { label: "Rating", value: stats.rating },
      { label: "Stars", value: stats.stars },
      { label: "Highest Rating", value: stats.highestRating },
    ],
  },
];

const ProgressTracking = () => {
  // full profile document from the backend, shaped like:
  // { github: {username, stats, lastSynced}, leetcode: {...}, ... }
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // which platform's "connect" modal is currently open (or null)
  const [activeModalPlatform, setActiveModalPlatform] = useState(null);

  // which single platform is currently being saved/refreshed,
  // so we can show a loading state on just that one card
  const [busyPlatform, setBusyPlatform] = useState(null);

  // -----------------------------------------------------
  // Load saved progress data once, when the page opens
  // -----------------------------------------------------
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const response = await getProgress();
      setProfile(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------
  // Connect a new username for a platform
  // -----------------------------------------------------
  const handleConnect = async (platformKey, username) => {
    try {
      setBusyPlatform(platformKey);

      const response = await connectPlatform({
        platform: platformKey,
        username,
      });

      // only update that one platform's slice of state
      setProfile((prev) => ({ ...prev, [platformKey]: response.data }));
      setActiveModalPlatform(null);
    } catch (err) {
      // simple alert for now - swap for a toast component if you have one
      alert(err.message);
    } finally {
      setBusyPlatform(null);
    }
  };

  // -----------------------------------------------------
  // Refresh stats for an already-connected platform
  // -----------------------------------------------------
  const handleRefresh = async (platformKey) => {
    try {
      setBusyPlatform(platformKey);
      const response = await refreshPlatform(platformKey);
      setProfile((prev) => ({ ...prev, [platformKey]: response.data }));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyPlatform(null);
    }
  };

  // -----------------------------------------------------
  // Disconnect a platform
  // -----------------------------------------------------
  const handleDisconnect = async (platformKey) => {
    const confirmed = window.confirm(
      `Disconnect your ${platformKey} profile?`
    );

    if (!confirmed) return;

    try {
      setBusyPlatform(platformKey);
      await disconnectPlatform(platformKey);

      setProfile((prev) => ({
        ...prev,
        [platformKey]: { username: null, stats: null, lastSynced: null },
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyPlatform(null);
    }
  };

  if (loading) {
    return (
      <div className="progress-tracking-loading">
        Loading your progress...
      </div>
    );
  }

  if (error) {
    return <div className="progress-tracking-error">{error}</div>;
  }

  return (
    <div className="progress-tracking-page">

      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="progress-tracking-header">
        <h2>Progress Tracking</h2>
        <p>
          Connect your coding profiles to track your progress in one place.
        </p>
      </div>

      {/* =========================
          PLATFORM CARDS GRID
      ========================= */}
      <div className="progress-tracking-grid">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.key}
            config={platform}
            data={profile?.[platform.key]}
            isBusy={busyPlatform === platform.key}
            onConnectClick={() => setActiveModalPlatform(platform.key)}
            onRefreshClick={() => handleRefresh(platform.key)}
            onDisconnectClick={() => handleDisconnect(platform.key)}
          />
        ))}
      </div>

      {/* =========================
          CONNECT MODAL
          only rendered while a card's "Connect" button is active
      ========================= */}
      {activeModalPlatform && (
        <ConnectProfileModal
          platformLabel={
            PLATFORMS.find((p) => p.key === activeModalPlatform).label
          }
          isSubmitting={busyPlatform === activeModalPlatform}
          onSubmit={(username) => handleConnect(activeModalPlatform, username)}
          onClose={() => setActiveModalPlatform(null)}
        />
      )}

    </div>
  );
};

export default ProgressTracking;
