import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faFilter,
  faRotateLeft,
  faListCheck,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

import DashboardSidebar from "../../../dashboard/layout/DashboardSidebar";

import DSAProgress from "./components/DSAProgress";
import ProblemCard from "./components/ProblemCard";

import {
  getDsaProblems,
  getSolvedDsaProblems,
} from "../../../api/dsaApi";

import "./DSAHome.css";

const DSAHome = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [problems, setProblems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [status, setStatus] = useState("All");

  // =====================================================
  // FETCH DSA PROBLEMS + SOLVED PROBLEMS
  // =====================================================

  useEffect(() => {
    const fetchDsaData = async () => {
      try {
        setLoading(true);
        setError("");

        const [problemsData, solvedData] =
          await Promise.all([
            getDsaProblems(),
            getSolvedDsaProblems(),
          ]);

        const fetchedProblems =
          problemsData?.problems || [];

        const solvedProblems =
          solvedData?.solvedProblems || [];

        // Create a Set of solved problem IDs.
        const solvedIds = new Set();

        solvedProblems.forEach((problem) => {
          if (problem.id !== undefined) {
            solvedIds.add(String(problem.id));
          }

          if (problem._id !== undefined) {
            solvedIds.add(String(problem._id));
          }

          if (problem.problemId !== undefined) {
            solvedIds.add(String(problem.problemId));
          }
        });

        // Add solved status to every problem.
        const problemsWithStatus =
          fetchedProblems.map((problem) => {
            const problemIds = [
              problem.id,
              problem._id,
              problem.problemId,
            ]
              .filter(
                (id) =>
                  id !== undefined &&
                  id !== null
              )
              .map((id) => String(id));

            const isSolved = problemIds.some(
              (id) => solvedIds.has(id)
            );

            return {
              ...problem,
              solved: isSolved,
            };
          });

        setProblems(problemsWithStatus);
      } catch (err) {
        console.error(
          "Failed to fetch DSA data:",
          err
        );

        setError(
          err.message ||
            "Unable to load DSA problems."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDsaData();
  }, []);

  // =====================================================
  // BUILD TOPIC LIST
  // =====================================================

  const topics = useMemo(() => {
    const topicSet = new Set();

    problems.forEach((problem) => {
      (problem.topics || []).forEach((item) => {
        topicSet.add(item);
      });
    });

    return [
      "All",
      ...Array.from(topicSet).sort(),
    ];
  }, [problems]);

  // =====================================================
  // FILTER PROBLEMS
  // =====================================================

  const filteredProblems = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return problems.filter((problem) => {
      const matchesSearch =
        normalizedSearch === "" ||
        problem.title
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesDifficulty =
        difficulty === "All" ||
        problem.difficulty === difficulty;

      const matchesTopic =
        topic === "All" ||
        (problem.topics || []).includes(topic);

      const matchesStatus =
        status === "All" ||
        (status === "Solved" &&
          problem.solved === true) ||
        (status === "Unsolved" &&
          problem.solved !== true);

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic &&
        matchesStatus
      );
    });
  }, [
    problems,
    search,
    difficulty,
    topic,
    status,
  ]);

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setDifficulty("All");
    setTopic("All");
    setStatus("All");
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="dsa-page">
        <DashboardSidebar />

        <main className="dsa-main">
          <section className="dsa-content">

            <div className="dsa-loading-state">

              <div className="dsa-loading-spinner" />

              <h3>
                Loading DSA problems...
              </h3>

              <p>
                Fetching problems from PrepNova.
              </p>

            </div>

          </section>
        </main>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <div className="dsa-page">

        <DashboardSidebar />

        <main className="dsa-main">

          <section className="dsa-content">

            <div className="dsa-empty-state">

              <div className="dsa-empty-icon">

                <FontAwesomeIcon
                  icon={faListCheck}
                />

              </div>

              <h3>
                Unable to load problems
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </div>

          </section>

        </main>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="dsa-page">

      {/* =================================================
          PREPNOVA SIDEBAR
      ================================================= */}

      <DashboardSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dsa-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="dsa-topbar">

          <div className="dsa-topbar-search">

            <FontAwesomeIcon
              icon={faMagnifyingGlass}
            />

            <input
              type="text"
              placeholder="Search questions, tests..."
              aria-label="Search"
            />

            <small>
              Ctrl K
            </small>

          </div>


          <div className="dsa-topbar-user">

            <div className="dsa-user-avatar">
              P
            </div>

            <div className="dsa-user-details">

              <strong>
                Pratiksha
              </strong>

              <span>
                Student
              </span>

            </div>

            <span className="dsa-user-arrow">
              ▾
            </span>

          </div>

        </header>


        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <section className="dsa-content">

          {/* =================================================
              PAGE HEADING
          ================================================= */}

          <div className="dsa-heading">

            <div>

              <p className="dsa-eyebrow">
                DSA CHALLENGES
              </p>

              <h1>
                Master Data Structures & Algorithms
              </h1>

              <p className="dsa-heading-description">
                Practice coding problems, strengthen your
                problem-solving skills, and prepare for
                technical interviews.
              </p>

            </div>

          </div>


          {/* =================================================
              PROGRESS
          ================================================= */}

          <DSAProgress />


          {/* =================================================
              PROBLEM SECTION HEADER
          ================================================= */}

          <div className="dsa-problems-heading">

            <div>

              <div className="dsa-section-title-row">

                <h2>
                  Problem Set
                </h2>

                <span className="dsa-problem-count">
                  {filteredProblems.length} problems
                </span>

              </div>

              <p>
                Choose a problem and start improving your
                coding skills.
              </p>

            </div>


            {/* =================================================
                SUBMISSION HISTORY BUTTON
            ================================================= */}

            <button
              type="button"
              className="dsa-history-button"
              onClick={() =>
                navigate("/tests/dsa/submissions")
              }
            >
              <FontAwesomeIcon
                icon={faClockRotateLeft}
              />

              <span>
                Submission History
              </span>
            </button>

          </div>


          {/* =================================================
              FILTER BAR
          ================================================= */}

          <div className="dsa-filter-bar">

            {/* Search */}

            <div className="dsa-filter-search">

              <FontAwesomeIcon
                icon={faMagnifyingGlass}
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search problems..."
              />

            </div>


            {/* Difficulty */}

            <div className="dsa-filter-control">

              <label htmlFor="dsa-difficulty">
                Difficulty
              </label>

              <select
                id="dsa-difficulty"
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>

              </select>

            </div>


            {/* Topic */}

            <div className="dsa-filter-control">

              <label htmlFor="dsa-topic">
                Topic
              </label>

              <select
                id="dsa-topic"
                value={topic}
                onChange={(event) =>
                  setTopic(
                    event.target.value
                  )
                }
              >
                {topics.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

            </div>


            {/* Status */}

            <div className="dsa-filter-control">

              <label htmlFor="dsa-status">
                Status
              </label>

              <select
                id="dsa-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Solved">
                  Solved
                </option>

                <option value="Unsolved">
                  Unsolved
                </option>

              </select>

            </div>


            {/* Reset */}

            <button
              type="button"
              className="dsa-reset-button"
              onClick={resetFilters}
              title="Reset filters"
            >
              <FontAwesomeIcon
                icon={faRotateLeft}
              />

              <span>
                Reset
              </span>

            </button>

          </div>


          {/* =================================================
              ACTIVE FILTER INFO
          ================================================= */}

          <div className="dsa-filter-info">

            <div>

              <FontAwesomeIcon
                icon={faFilter}
              />

              <span>
                Showing {filteredProblems.length} of{" "}
                {problems.length} problems
              </span>

            </div>


            {(difficulty !== "All" ||
              topic !== "All" ||
              status !== "All" ||
              search) && (

              <button
                type="button"
                onClick={resetFilters}
              >
                Clear filters
              </button>

            )}

          </div>


          {/* =================================================
              PROBLEM LIST
          ================================================= */}

          {filteredProblems.length > 0 ? (

            <div className="dsa-problem-list">

              {filteredProblems.map((problem) => (

                <ProblemCard
                  key={
                    problem.id ||
                    problem._id ||
                    problem.problemId
                  }
                  problem={problem}
                />

              ))}

            </div>

          ) : (

            <div className="dsa-empty-state">

              <div className="dsa-empty-icon">

                <FontAwesomeIcon
                  icon={faListCheck}
                />

              </div>

              <h3>
                No problems found
              </h3>

              <p>
                Try changing your search or filters
                to find more DSA challenges.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default DSAHome;