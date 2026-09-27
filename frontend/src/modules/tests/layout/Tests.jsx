import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCode,
  faBookOpen,
  faArrowRight,
  faCircleCheck,
  faMagnifyingGlass,
  faBell,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import DashboardSidebar from "../../../dashboard/layout/DashboardSidebar";
import "./Tests.css";

const Tests = () => {
  const navigate = useNavigate();

  return (
    <div className="tests-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <DashboardSidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <main className="tests-main">

        {/* =====================================================
            NAVBAR
        ===================================================== */}
        <header className="tests-topbar">

          <div className="tests-search">

            <FontAwesomeIcon icon={faMagnifyingGlass} />

            <input
              type="text"
              placeholder="Search questions, tests..."
            />

            <small>Ctrl K</small>

          </div>

          <div className="tests-top-actions">

            <button
              type="button"
              className="tests-top-icon"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
            </button>

            <button
              type="button"
              className="tests-top-icon"
              aria-label="Messages"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </button>

            <div className="tests-user">

              <div className="tests-user-avatar">
                P
              </div>

              <div className="tests-user-details">
                <strong>Pratiksha</strong>
                <span>Student</span>
              </div>

              <span className="tests-user-arrow">
                ▾
              </span>

            </div>

          </div>

        </header>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}
        <section className="tests-content">

          {/* ===================================================
              PAGE HEADING
          =================================================== */}
          <div className="tests-heading">

            <p className="tests-eyebrow">
              YOUR TEST CENTER
            </p>

            <h1>
              Choose your challenge
            </h1>

          </div>

          {/* ===================================================
              TEST OPTIONS
          =================================================== */}
          <div className="tests-options-grid">

            {/* =================================================
                DSA CARD
            ================================================= */}
            <div className="test-option-card">

              <div className="test-card-header">

                <div className="test-option-icon">
                  <FontAwesomeIcon icon={faCode} />
                </div>

                <span className="test-badge">
                  CODING
                </span>

              </div>

              <div className="test-card-content">

                <h3>
                  DSA Challenges
                </h3>

                <p>
                  Solve coding problems, write your own
                  solution, run your code, and submit it
                  for evaluation.
                </p>

                <div className="test-features">

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      Real coding problems
                    </span>
                  </div>

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      Multiple programming languages
                    </span>
                  </div>

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      Run & submit your code
                    </span>
                  </div>

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      Solution review & feedback
                    </span>
                  </div>

                </div>

              </div>

              <button
                type="button"
                className="test-start-button"
                onClick={() => navigate("/tests/dsa")}
              >
                <span>
                  Start DSA
                </span>

                <FontAwesomeIcon icon={faArrowRight} />
              </button>

            </div>

            {/* =================================================
                MCQ CARD
            ================================================= */}
            <div className="test-option-card">

              <div className="test-card-header">

                <div className="test-option-icon">
                  <FontAwesomeIcon icon={faBookOpen} />
                </div>

                <span className="test-badge">
                  MCQ
                </span>

              </div>

              <div className="test-card-content">

                <h3>
                  CS Fundamentals
                </h3>

                <p>
                  Practice multiple-choice questions across
                  important computer science subjects.
                </p>

                <div className="test-features">

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      DBMS, OS & Computer Networks
                    </span>
                  </div>

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      OOP & Data Structures
                    </span>
                  </div>

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      Timed MCQ tests
                    </span>
                  </div>

                  <div>
                    <FontAwesomeIcon icon={faCircleCheck} />

                    <span>
                      Detailed results & explanations
                    </span>
                  </div>

                </div>

              </div>

              {/* =================================================
                  MCQ → /tests/mcq
              ================================================= */}
              <button
                type="button"
                className="test-start-button"
                onClick={() => navigate("/tests/mcq")}
              >
                <span>
                  Start Test
                </span>

                <FontAwesomeIcon icon={faArrowRight} />
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default Tests;