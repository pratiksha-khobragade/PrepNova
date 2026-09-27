import React from "react";
import "./Header.css";

// =====================================================
// FEATURE CARDS
// =====================================================

const featureCards = [
  {
    position: "developer-card",
    video: "/videos/dashboard.mp4",
    title: "Developer Dashboard",
    items: [
      "GitHub activity",
      "Coding streak",
      "Project statistics",
      "Contribution graphs",
    ],
  },
  {
    position: "interview-card",
    video: "/videos/test.mp4",
    title: "Interview Prep",
    items: [
      "DSA questions",
      "MCQs",
      "Coding problems",
      "Mock interview mode",
      "Progress tracking",
    ],
  },
  {
    position: "mock-card",
    video: "/videos/online-interview.mp4",
    title: "AI Mock Interview",
    items: [
      "Role & experience selection",
      "Smart voice interview",
      "Dynamic follow-up questions",
      "AI answer evaluation",
    ],
  },
  {
    position: "resume-card",
    video: "/videos/cv.mp4",
    title: "Resume Analyzer",
    items: [
      "Upload resume",
      "ATS analysis",
      "Missing skills",
      "Job-description matching",
    ],
  },
];


// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({ card }) {
  return (
    <div className={`feature-card ${card.position}`}>

      <div className="feature-card-header">

        {/* Video used as the card icon */}
        <div className="feature-icon">

          <video
            src={card.video}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />

        </div>

        <span className="feature-title">
          {card.title}
        </span>

        <span className="feature-arrow">
          ›
        </span>

      </div>


      <div className="feature-list">

        {card.items.map((item) => (

          <div
            className="feature-item"
            key={item}
          >

            <span className="check">
              ✓
            </span>

            <span>
              {item}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}


// =====================================================
// LANDING PAGE HEADER
// =====================================================

export default function Header() {

  return (
    <header className="landing-header">

      {/* =================================================
          NAVIGATION
      ================================================= */}

      <nav className="navbar">

        <a
          href="/"
          className="brand"
          aria-label="PrepNova home"
        >

          <img
            src="/images/logo.png"
            alt="PrepNova"
            className="brand-logo"
          />

        </a>


        <div className="nav-actions">

          <button
            type="button"
            className="signin-btn"
            onClick={() => {
              window.location.href = "/signup";
            }}
          >
            Sign up
          </button>


          <button
            type="button"
            className="get-started-btn"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Log in
          </button>

        </div>

      </nav>


      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="hero">

        {/* =================================================
            FEATURE CARDS
        ================================================= */}

        {featureCards.map((card) => (

          <FeatureCard
            card={card}
            key={card.title}
          />

        ))}


        {/* =================================================
            SMALL CODING VISUAL
        ================================================= */}

        <div
          className="code-card"
          aria-hidden="true"
        >

          <div className="code-dots">

            <span />
            <span />
            <span />

          </div>

          <pre>{`function solve(arr) {
  return arr.map(x => x * 2);
}`}</pre>

        </div>


        {/* =================================================
            CENTER HERO CONTENT
        ================================================= */}

        <div className="hero-content">

          <div className="eyebrow">

            <span>
              ✦
            </span>

            AI-POWERED INTERVIEW PREPARATION

          </div>


          <h1>

            Prepare smarter.
            <br />

            Interview with{" "}

            <span>
              confidence.
            </span>

          </h1>


          <p>
            Everything you need to master technical, behavioral, and
            AI-powered mock interviews — all in one place.
          </p>


          <div className="hero-buttons">

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Explore More
            </button>

          </div>

        </div>


        {/* Decorative elements intentionally removed */}

      </section>

    </header>
  );
}