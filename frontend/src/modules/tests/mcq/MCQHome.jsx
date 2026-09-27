import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faBookOpen,
  faCheck,
  faClock,
  faPlay,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

import "./MCQHome.css";

const MCQHome = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      name: "DBMS",
      description: "Databases & SQL",
      image:
        "https://cdn-icons-png.flaticon.com/512/10226/10226954.png",
    },
    {
      name: "Operating Systems",
      description: "Processes & memory",
      image:
        "https://cdn-icons-png.flaticon.com/512/6558/6558605.png",
      source:
        "https://www.flaticon.com/free-stickers/computer",
    },
    {
      name: "Computer Networks",
      description: "Protocols & networking",
      image:
        "https://cdn-icons-png.flaticon.com/512/6693/6693446.png",
      source:
        "https://www.flaticon.com/free-stickers/global",
    },
    {
      name: "OOP",
      description: "Object-oriented concepts",
      image:
        "https://cdn-icons-png.flaticon.com/512/9011/9011062.png",
      source:
        "https://www.flaticon.com/free-stickers/automation",
    },
    {
      name: "Data Structures",
      description: "Structures & operations",
      image:
        "https://cdn-icons-png.flaticon.com/512/6486/6486196.png",
      source:
        "https://www.flaticon.com/free-stickers/web-programming",
    },
    {
      name: "Algorithms",
      description: "Logic & problem solving",
      image:
        "https://cdn-icons-png.flaticon.com/512/6036/6036177.png",
      source:
        "https://www.flaticon.com/free-stickers/coding",
    },
  ];

  const startTest = () => {
    navigate("/tests/mcq/dashboard");
  };

  const viewHistory = () => {
    navigate("/tests/mcq/history");
  };

  return (
    <div className="mcq-home-page">
      <div className="mcq-home-container">
        {/* Top Navigation */}
        <header className="mcq-home-nav">
          <button
            type="button"
            className="mcq-back-button"
            onClick={() => navigate("/tests")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Tests</span>
          </button>

          <button
            type="button"
            className="mcq-history-button"
            onClick={viewHistory}
          >
            <span>Test History</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </header>

        {/* Hero Section */}
        <main className="mcq-hero">
          <section className="mcq-hero-content">
            <div className="mcq-label">
              <span className="mcq-label-line"></span>
              <span>CS FUNDAMENTALS</span>
            </div>

            <h1>
              Master Computer Science
              <span>through MCQs.</span>
            </h1>

            <p className="mcq-hero-description">
              Strengthen your computer science fundamentals
              with carefully selected multiple-choice
              questions, timed practice tests, and detailed
              explanations.
            </p>

            <div className="mcq-hero-actions">
              <button
                type="button"
                className="mcq-primary-button"
                onClick={startTest}
              >
                <FontAwesomeIcon icon={faPlay} />

                <span>Start Test</span>

                <FontAwesomeIcon
                  className="mcq-button-arrow"
                  icon={faArrowRight}
                />
              </button>

              <button
                type="button"
                className="mcq-secondary-button"
                onClick={viewHistory}
              >
                <FontAwesomeIcon icon={faClock} />

                <span>View previous attempts</span>

                <FontAwesomeIcon
                  className="mcq-button-arrow"
                  icon={faArrowRight}
                />
              </button>
            </div>

            {/* Stats */}
            <div className="mcq-hero-stats">
              <div className="mcq-stat">
                <strong>20+</strong>
                <span>Questions</span>
              </div>

              <div className="mcq-stat-divider"></div>

              <div className="mcq-stat">
                <strong>6</strong>
                <span>CS Subjects</span>
              </div>

              <div className="mcq-stat-divider"></div>

              <div className="mcq-stat">
                <strong>3</strong>
                <span>Difficulty Levels</span>
              </div>

              <div className="mcq-stat-divider"></div>

              <div className="mcq-stat">
                <strong>
                  <FontAwesomeIcon icon={faClock} />
                </strong>
                <span>Timed Tests</span>
              </div>
            </div>
          </section>

          {/* MCQ Preview */}
          <section className="mcq-visual-wrapper">
            <div className="mcq-visual-card">
              <div className="mcq-visual-top">
                <div className="mcq-visual-title">
                  <span>MCQ PRACTICE</span>
                  <strong>Question 01</strong>
                </div>

                <div className="mcq-visual-timer">
                  <FontAwesomeIcon icon={faClock} />
                  <span>18:42</span>
                </div>
              </div>

              <div className="mcq-visual-progress">
                <span></span>
              </div>

              <div className="mcq-question-box">
                <div className="mcq-question-number">
                  <FontAwesomeIcon icon={faQuestion} />
                </div>

                <p>
                  Which data structure follows the
                  <strong> LIFO </strong>
                  principle?
                </p>

                <div className="mcq-options">
                  <div className="mcq-option">
                    <span className="mcq-option-letter">
                      A
                    </span>
                    <span>Queue</span>
                  </div>

                  <div className="mcq-option selected">
                    <span className="mcq-option-letter">
                      B
                    </span>

                    <span>Stack</span>

                    <FontAwesomeIcon
                      className="mcq-option-check"
                      icon={faCheck}
                    />
                  </div>

                  <div className="mcq-option">
                    <span className="mcq-option-letter">
                      C
                    </span>
                    <span>Linked List</span>
                  </div>

                  <div className="mcq-option">
                    <span className="mcq-option-letter">
                      D
                    </span>
                    <span>Tree</span>
                  </div>
                </div>
              </div>

              <div className="mcq-visual-bottom">
                <div className="mcq-question-counter">
                  <strong>01</strong>
                  <span>/ 20</span>
                </div>

                <div className="mcq-mini-dots">
                  <span className="active"></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <div className="mcq-visual-next">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Subject Section */}
        <section className="mcq-subject-section">
          <div className="mcq-section-heading">
            <div className="mcq-section-title">
              <span>EXPLORE</span>
              <h2>Practice by subject</h2>
            </div>
          </div>

          <div className="mcq-subject-grid">
            {subjects.map((subject) => (
              <a
                key={subject.name}
                href={subject.source}
                target="_blank"
                rel="noopener noreferrer"
                className="mcq-subject-card"
              >
                <div className="mcq-subject-sticker">
                  <img
                    src={subject.image}
                    alt={`${subject.name} illustration`}
                    loading="lazy"
                  />
                </div>

                <div className="mcq-subject-info">
                  <h3>{subject.name}</h3>
                  <p>{subject.description}</p>
                </div>

                <div className="mcq-subject-arrow">
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mcq-final-cta">
          <div className="mcq-final-content">
            <div className="mcq-final-icon">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>

            <div>
              <span>READY TO BEGIN?</span>

              <h2>
                Put your CS knowledge to the test.
              </h2>

              <p>
                Choose your difficulty and start your first
                MCQ practice test.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mcq-final-button"
            onClick={startTest}
          >
            <span>Start Test</span>

            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default MCQHome;