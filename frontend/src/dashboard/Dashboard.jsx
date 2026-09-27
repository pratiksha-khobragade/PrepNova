import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faMagnifyingGlass,
  faCheck,
  faTableList,
  faArrowTrendUp,
  faFire,
  faArrowRight,
  faPlus,
  faCircle,
  faChartPie,
  faCode,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import "./Dashboard.css";

import DashboardSidebar from "./layout/DashboardSidebar";

import { getProfile } from "../api/settingsApi";
import { getDsaProgress } from "../api/dsaApi";

// =========================================================
// LOCAL AVATAR IMAGES
// =========================================================

import boy1 from "../../images/boy1.png";
import boy2 from "../../images/boy2.png";
import boy3 from "../../images/boy3.png";
import boy4 from "../../images/boy4.png";
import boy5 from "../../images/boy5.png";

import girl1 from "../../images/girl1.png";
import girl2 from "../../images/girl2.png";
import girl3 from "../../images/girl3.png";
import girl4 from "../../images/girl4.png";
import girl5 from "../../images/girl5.png";


// =========================================================
// LOCAL AVATAR MAP
// =========================================================

const AVATAR_IMAGES = {
  "boy-1": boy1,
  "boy-2": boy2,
  "boy-3": boy3,
  "boy-4": boy4,
  "boy-5": boy5,

  "girl-1": girl1,
  "girl-2": girl2,
  "girl-3": girl3,
  "girl-4": girl4,
  "girl-5": girl5,
};


// =========================================================
// SEARCH ITEMS
// =========================================================

const SEARCH_ITEMS = [
  {
    title: "Dashboard",
    description: "Your learning dashboard",
    path: "/dashboard",
  },
  {
    title: "Resume Analyzer",
    description: "Analyze your resume",
    path: "/resume-analyzer",
  },
  {
    title: "Tests",
    description: "Take tests and assessments",
    path: "/tests",
  },
  {
    title: "DSA Challenges",
    description: "Practice coding problems",
    path: "/tests/dsa",
  },
  {
    title: "MCQ Tests",
    description: "Practice multiple choice questions",
    path: "/tests/mcq",
  },
  {
    title: "AI Interview",
    description: "Practice AI mock interviews",
    path: "/interview",
  },
  {
    title: "Progress Tracking",
    description: "Track your preparation",
    path: "/progress",
  },
  {
    title: "Settings",
    description: "Manage your profile and account",
    path: "/settings",
  },
];


const Dashboard = () => {

  const navigate = useNavigate();

  // =========================================================
  // PROFILE
  // =========================================================

  const [profile, setProfile] = useState(null);


  // =========================================================
  // DASHBOARD DATA
  // =========================================================

  const [dashboardData, setDashboardData] =
    useState({
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      failedSubmissions: 0,
      accuracy: 0,

      solvedProblems: 0,
      remainingProblems: 0,
      solvedPercentage: 0,

      currentStreak: 0,
      longestStreak: 0,

      recentSubmissions: [],
    });


  const [dashboardLoading, setDashboardLoading] =
    useState(true);


  // =========================================================
  // SEARCH
  // =========================================================

  const [searchQuery, setSearchQuery] =
    useState("");

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const searchInputRef = useRef(null);


  // =========================================================
  // LOAD PROFILE
  // =========================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const response = await getProfile();

        setProfile(
          response?.data ||
          response?.user ||
          response
        );

      } catch (error) {

        console.error(
          "Failed to load profile:",
          error
        );

      }

    };

    loadProfile();

  }, []);


  // =========================================================
  // LOAD DYNAMIC DASHBOARD DATA
  // =========================================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setDashboardLoading(true);

        const response =
          await getDsaProgress();

        /*
          The API response can be wrapped differently
          depending on the API helper.

          So we safely support:
          response.data.progress
          response.progress
          response.data
          response
        */

        const progress =
          response?.data?.progress ||
          response?.progress ||
          response?.data ||
          response;


        setDashboardData({
          totalSubmissions:
            Number(
              progress?.totalSubmissions || 0
            ),

          acceptedSubmissions:
            Number(
              progress?.acceptedSubmissions || 0
            ),

          failedSubmissions:
            Number(
              progress?.failedSubmissions || 0
            ),

          accuracy:
            Number(
              progress?.accuracy || 0
            ),

          solvedProblems:
            Number(
              progress?.solvedProblems || 0
            ),

          remainingProblems:
            Number(
              progress?.remainingProblems || 0
            ),

          solvedPercentage:
            Number(
              progress?.solvedPercentage || 0
            ),

          currentStreak:
            Number(
              progress?.currentStreak || 0
            ),

          longestStreak:
            Number(
              progress?.longestStreak || 0
            ),

          recentSubmissions:
            Array.isArray(
              progress?.recentSubmissions
            )
              ? progress.recentSubmissions
              : [],
        });

      } catch (error) {

        console.error(
          "Failed to load dashboard data:",
          error
        );

        /*
          Keep dashboard usable even if the
          progress API temporarily fails.
        */

        setDashboardData({
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          failedSubmissions: 0,
          accuracy: 0,
          solvedProblems: 0,
          remainingProblems: 0,
          solvedPercentage: 0,
          currentStreak: 0,
          longestStreak: 0,
          recentSubmissions: [],
        });

      } finally {

        setDashboardLoading(false);

      }

    };

    loadDashboardData();

  }, []);


  // =========================================================
  // CTRL + K SEARCH SHORTCUT
  // =========================================================

  useEffect(() => {

    const handleKeyboardShortcut = (
      event
    ) => {

      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {

        event.preventDefault();

        searchInputRef.current?.focus();

        setShowSearchResults(true);

      }

      // Escape closes search results
      if (event.key === "Escape") {

        setShowSearchResults(false);

        searchInputRef.current?.blur();

      }

    };


    window.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );

    };

  }, []);


  // =========================================================
  // PROFILE IMAGE LOGIC
  // =========================================================

  const getProfileImage = () => {

    // Custom uploaded image
    if (
      profile?.profileImageType === "custom" &&
      profile?.profileImage
    ) {

      if (
        profile.profileImage.startsWith(
          "http"
        )
      ) {

        return profile.profileImage;

      }

      return profile.profileImage;

    }


    // Selected local avatar
    if (
      profile?.profileImageType === "avatar" &&
      profile?.selectedAvatar
    ) {

      return (
        AVATAR_IMAGES[
          profile.selectedAvatar
        ] || null
      );

    }


    return null;

  };


  const profileImage =
    getProfileImage();


  // =========================================================
  // SEARCH RESULTS
  // =========================================================

  const filteredSearchItems =
    SEARCH_ITEMS.filter((item) => {

      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return false;
      }

      return (
        item.title
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query)
      );

    }).slice(0, 6);


  // =========================================================
  // HANDLE SEARCH
  // =========================================================

  const handleSearchKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      filteredSearchItems.length > 0
    ) {

      navigate(
        filteredSearchItems[0].path
      );

      setSearchQuery("");

      setShowSearchResults(false);

    }

  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatSubmissionDate = (
    date
  ) => {

    if (!date) {
      return "Recently";
    }

    const submissionDate =
      new Date(date);

    if (
      Number.isNaN(
        submissionDate.getTime()
      )
    ) {

      return "Recently";

    }

    const now = new Date();

    const difference =
      now.getTime() -
      submissionDate.getTime();

    const minutes = Math.floor(
      difference / 60000
    );

    const hours = Math.floor(
      difference / 3600000
    );

    const days = Math.floor(
      difference / 86400000
    );


    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return submissionDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );

  };


  // =========================================================
  // WEEKLY ACTIVITY
  // =========================================================

  const getWeeklyActivity = () => {

    const today = new Date();

    const days = [];

    for (let index = 6; index >= 0; index--) {

      const date = new Date(today);

      date.setDate(
        today.getDate() - index
      );

      date.setHours(0, 0, 0, 0);

      days.push({
        date,
        label: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),
        count: 0,
      });

    }


    dashboardData.recentSubmissions.forEach(
      (submission) => {

        if (!submission?.createdAt) {
          return;
        }

        const submissionDate =
          new Date(
            submission.createdAt
          );

        submissionDate.setHours(
          0,
          0,
          0,
          0
        );


        const matchingDay =
          days.find(
            (day) =>
              day.date.getTime() ===
              submissionDate.getTime()
          );


        if (matchingDay) {
          matchingDay.count += 1;
        }

      }
    );


    const maxCount =
      Math.max(
        ...days.map(
          (day) => day.count
        ),
        1
      );


    return days.map((day) => ({
      ...day,

      height: Math.max(
        day.count > 0
          ? (day.count / maxCount) * 85
          : 8,
        8
      ),
    }));

  };


  const weeklyActivity =
    getWeeklyActivity();


  // =========================================================
  // RECENT ACTIVITY
  // =========================================================

  const recentSubmissions =
    dashboardData.recentSubmissions
      .slice(0, 3);


  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <DashboardSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-main">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="dashboard-topbar">


          {/* =========================
              SEARCH
          ========================= */}

          <div className="dashboard-search-wrapper">

            <div className="dashboard-search">

              <FontAwesomeIcon
                icon={faMagnifyingGlass}
              />

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                placeholder="Search questions, tests..."
                onChange={(event) => {

                  setSearchQuery(
                    event.target.value
                  );

                  setShowSearchResults(
                    true
                  );

                }}
                onFocus={() => {

                  if (searchQuery.trim()) {
                    setShowSearchResults(
                      true
                    );
                  }

                }}
                onKeyDown={
                  handleSearchKeyDown
                }
              />

              <small>
                Ctrl K
              </small>

            </div>


            {/* =========================
                SEARCH RESULTS
            ========================= */}

            {showSearchResults &&
              searchQuery.trim() && (
                <div className="dashboard-search-results">

                  {filteredSearchItems.length >
                  0 ? (

                    filteredSearchItems.map(
                      (item) => (

                        <button
                          key={item.path}
                          type="button"
                          className="dashboard-search-result"
                          onClick={() => {

                            navigate(
                              item.path
                            );

                            setSearchQuery("");

                            setShowSearchResults(
                              false
                            );

                          }}
                        >

                          <div className="search-result-icon">

                            <FontAwesomeIcon
                              icon={
                                faMagnifyingGlass
                              }
                            />

                          </div>


                          <div>

                            <strong>
                              {item.title}
                            </strong>

                            <span>
                              {item.description}
                            </span>

                          </div>

                        </button>

                      )
                    )

                  ) : (

                    <div className="dashboard-search-empty">

                      No matching results found.

                    </div>

                  )}

                </div>
              )}

          </div>


          {/* =================================================
              USER PROFILE
          ================================================= */}

          <div
            className="dashboard-top-actions"
          >

            <div
              className="dashboard-user dashboard-user-large"
              onClick={() =>
                navigate("/settings")
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {

                  navigate("/settings");

                }

              }}
            >

              <div className="user-avatar user-avatar-large">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                  />

                ) : (

                  "P"

                )}

              </div>


              <div className="dashboard-user-info">

                <strong>
                  {profile?.firstName ||
                    "Pratiksha"}
                </strong>

                <span>
                  Student
                </span>

              </div>


              <span className="user-arrow">
                ▾
              </span>

            </div>

          </div>

        </header>


        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <section className="dashboard-content">


          {/* =================================================
              WELCOME
          ================================================= */}

          <div className="dashboard-heading">

            <div>

              <p className="dashboard-eyebrow">
                YOUR LEARNING SPACE
              </p>

              <h1>
                Good evening,{" "}
                {profile?.firstName ||
                  "Pratiksha"}
              </h1>

              <p>
                Keep learning, keep improving,
                and reach your goals.
              </p>

            </div>


            <button
              type="button"
              className="primary-dashboard-button"
              onClick={() =>
                navigate("/tests/dsa")
              }
            >

              <FontAwesomeIcon
                icon={faPlus}
              />

              <span>
                Start Practice
              </span>

            </button>

          </div>


          {/* =================================================
              DYNAMIC STAT CARDS
          ================================================= */}

          <div className="dashboard-stats">


            {/* Questions Practiced */}

            <div className="stat-card green-card">

              <div className="stat-card-top">

                <span>
                  Questions Practiced
                </span>

                <div className="stat-icon">

                  <FontAwesomeIcon
                    icon={faCheck}
                  />

                </div>

              </div>


              <h2>

                {dashboardLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  dashboardData.totalSubmissions
                )}

              </h2>


              <p>
                <b>
                  {dashboardData.acceptedSubmissions}
                </b>{" "}
                accepted solutions
              </p>

            </div>


            {/* Problems Solved */}

            <div className="stat-card">

              <div className="stat-card-top">

                <span>
                  Problems Solved
                </span>

                <div className="stat-icon light">

                  <FontAwesomeIcon
                    icon={faTableList}
                  />

                </div>

              </div>


              <h2>

                {dashboardLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  dashboardData.solvedProblems
                )}

              </h2>


              <p>

                <b>
                  {dashboardData.remainingProblems}
                </b>{" "}
                remaining

              </p>

            </div>


            {/* Average Accuracy */}

            <div className="stat-card">

              <div className="stat-card-top">

                <span>
                  Average Accuracy
                </span>

                <div className="stat-icon light">

                  <FontAwesomeIcon
                    icon={faArrowTrendUp}
                  />

                </div>

              </div>


              <h2>

                {dashboardLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  `${dashboardData.accuracy}%`
                )}

              </h2>


              <p>

                Based on your submissions

              </p>

            </div>


            {/* Study Streak */}

            <div className="stat-card">

              <div className="stat-card-top">

                <span>
                  Study Streak
                </span>

                <div className="stat-icon light">

                  <FontAwesomeIcon
                    icon={faFire}
                  />

                </div>

              </div>


              <h2>

                {dashboardLoading ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  `${dashboardData.currentStreak} Days`
                )}

              </h2>


              <p>

                Longest:{" "}
                <b>
                  {dashboardData.longestStreak}
                </b>{" "}
                days

              </p>

            </div>

          </div>


          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="dashboard-grid">


            {/* =================================================
                PERFORMANCE OVERVIEW
            ================================================= */}

            <div className="dashboard-card performance-card">

              <div className="card-heading">

                <div>

                  <h3>
                    Performance Overview
                  </h3>

                  <p>
                    Your DSA activity over the last 7 days
                  </p>

                </div>


                <span className="dashboard-live-label">
                  Live
                </span>

              </div>


              <div className="chart-area">

                <div className="chart-y-axis">

                  <span>
                    High
                  </span>

                  <span>
                    Medium
                  </span>

                  <span>
                    Low
                  </span>

                  <span>
                    0
                  </span>

                </div>


                <div className="chart">

                  <div className="chart-grid-line"></div>

                  <div className="chart-grid-line"></div>

                  <div className="chart-grid-line"></div>

                  <div className="chart-grid-line"></div>


                  <div className="chart-bars">

                    {weeklyActivity.map(
                      (day) => (

                        <div
                          className="chart-column"
                          key={
                            day.date.toISOString()
                          }
                        >

                          <div
                            className={
                              day.count > 0
                                ? "chart-bar active"
                                : "chart-bar"
                            }
                            style={{
                              height: `${day.height}%`,
                            }}
                            title={`${day.count} submission${
                              day.count === 1
                                ? ""
                                : "s"
                            }`}
                          />

                          <span>
                            {day.label}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                STUDY PROGRESS
            ================================================= */}

            <div className="dashboard-card progress-card">

              <div className="card-heading">

                <div>

                  <h3>
                    Study Progress
                  </h3>

                  <p>
                    Overall DSA preparation
                  </p>

                </div>


                <button
                  type="button"
                  className="small-action"
                  onClick={() =>
                    navigate("/progress")
                  }
                >
                  View
                </button>

              </div>


              <div
                className="progress-circle"
                style={{
                  "--progress":
                    `${dashboardData.solvedPercentage}%`,
                }}
              >

                <div className="progress-inner">

                  <strong>
                    {dashboardData.solvedPercentage}%
                  </strong>

                  <span>
                    Completed
                  </span>

                </div>

              </div>


              <div className="progress-details">

                <div>

                  <span className="dot completed">

                    <FontAwesomeIcon
                      icon={faCircle}
                    />

                  </span>

                  Completed

                  <b>
                    {dashboardData.solvedProblems}
                  </b>

                </div>


                <div>

                  <span className="dot remaining">

                    <FontAwesomeIcon
                      icon={faCircle}
                    />

                  </span>

                  Remaining

                  <b>
                    {dashboardData.remainingProblems}
                  </b>

                </div>

              </div>

            </div>


            {/* =================================================
                RECENT ACTIVITY
            ================================================= */}

            <div className="dashboard-card recent-tests-card">

              <div className="card-heading">

                <div>

                  <h3>
                    Recent Activity
                  </h3>

                  <p>
                    Your latest coding submissions
                  </p>

                </div>


                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    navigate(
                      "/tests/dsa/submissions"
                    )
                  }
                >

                  View All

                  <FontAwesomeIcon
                    icon={faArrowRight}
                  />

                </button>

              </div>


              <div className="test-list">

                {recentSubmissions.length > 0 ? (

                  recentSubmissions.map(
                    (submission, index) => {

                      const accepted =
                        String(
                          submission?.status ||
                          ""
                        ).toLowerCase() ===
                        "accepted";


                      return (
                        <div
                          className="test-item"
                          key={
                            submission?._id ||
                            submission?.id ||
                            index
                          }
                        >

                          <div className="test-icon">
                            <FontAwesomeIcon
                              icon={faCode}
                            />
                          </div>


                          <div className="test-info">

                            <strong>
                              {submission?.problemTitle ||
                                submission?.title ||
                                "DSA Submission"}
                            </strong>

                            <span>
                              {submission?.language ||
                                "Coding"}{" "}
                              ·{" "}
                              {formatSubmissionDate(
                                submission?.createdAt
                              )}
                            </span>

                          </div>


                          <div
                            className={
                              accepted
                                ? "test-score good"
                                : "test-score average"
                            }
                          >
                            {accepted
                              ? "Accepted"
                              : "Failed"}
                          </div>

                        </div>
                      );

                    }
                  )

                ) : (

                  <div className="dashboard-empty-state">

                    <FontAwesomeIcon
                      icon={faCode}
                    />

                    <p>
                      No submissions yet.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/tests/dsa"
                        )
                      }
                    >
                      Start DSA Practice
                    </button>

                  </div>

                )}

              </div>

            </div>


            {/* =================================================
                UPCOMING PRACTICE
            ================================================= */}

            <div className="dashboard-card upcoming-card">

              <div className="card-heading">

                <div>

                  <h3>
                    Recommended Practice
                  </h3>

                  <p>
                    Keep your preparation moving
                  </p>

                </div>


                <button
                  type="button"
                  className="small-add"
                  onClick={() =>
                    navigate(
                      "/tests/dsa"
                    )
                  }
                >

                  <FontAwesomeIcon
                    icon={faPlus}
                  />

                  <span>
                    Practice
                  </span>

                </button>

              </div>


              <div className="task-list">


                <div className="task-item">

                  <div className="task-check">

                    <FontAwesomeIcon
                      icon={faCircle}
                    />

                  </div>


                  <div>

                    <strong>
                      Solve another DSA problem
                    </strong>

                    <span>
                      {dashboardData.remainingProblems}{" "}
                      problems remaining
                    </span>

                  </div>

                </div>


                <div className="task-item">

                  <div className="task-check">

                    <FontAwesomeIcon
                      icon={faCircle}
                    />

                  </div>


                  <div>

                    <strong>
                      Improve your accuracy
                    </strong>

                    <span>
                      Current accuracy:{" "}
                      {dashboardData.accuracy}%
                    </span>

                  </div>

                </div>


                <div className="task-item">

                  <div className="task-check">

                    <FontAwesomeIcon
                      icon={faCircle}
                    />

                  </div>


                  <div>

                    <strong>
                      Maintain your streak
                    </strong>

                    <span>
                      Current streak:{" "}
                      {dashboardData.currentStreak} days
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="quick-actions-section">

            <div className="quick-section-heading">

              <div>

                <h3>
                  Quick Actions
                </h3>

                <p>
                  Jump straight into your preparation
                </p>

              </div>

            </div>


            <div className="quick-actions">


              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/tests/dsa")
                }
              >

                <span>

                  <FontAwesomeIcon
                    icon={faCode}
                  />

                </span>


                <div>

                  <strong>
                    Practice Questions
                  </strong>

                  <small>
                    Improve your coding skills
                  </small>

                </div>


                <b>

                  <FontAwesomeIcon
                    icon={faArrowRight}
                  />

                </b>

              </button>


              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/tests")
                }
              >

                <span>

                  <FontAwesomeIcon
                    icon={faTableList}
                  />

                </span>


                <div>

                  <strong>
                    Take a Mock Test
                  </strong>

                  <small>
                    Test your knowledge
                  </small>

                </div>


                <b>

                  <FontAwesomeIcon
                    icon={faArrowRight}
                  />

                </b>

              </button>


              <button
                type="button"
                className="quick-action"
                onClick={() =>
                  navigate("/progress")
                }
              >

                <span>

                  <FontAwesomeIcon
                    icon={faChartPie}
                  />

                </span>


                <div>

                  <strong>
                    View Performance
                  </strong>

                  <small>
                    Track your progress
                  </small>

                </div>


                <b>

                  <FontAwesomeIcon
                    icon={faArrowRight}
                  />

                </b>

              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};


export default Dashboard;