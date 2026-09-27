import React from "react";
import "./Features.css";

// Feature images
import interviewPrepImage from "../../../images/features/interviewPrep.png";
import resumeAnalyzerImage from "../../../images/features/ResumeAnalyzer.png";
import mockInterviewImage from "../../../images/features/interview.png";
import progressImage from "../../../images/features/progress.png";

/* =========================================================
   FEATURE DATA
========================================================= */

const features = [
  {
    id: 1,
    tag: "INTERVIEW PREPARATION",
    title: "Interview Prep",
    subtitle: "Build stronger problem-solving skills",
    description:
      "Practice DSA and MCQ questions, improve your coding skills, and keep track of your test history in one place.",
    points: [
      "DSA Problems",
      "MCQ Tests",
      "Coding Practice",
      "Test History",
    ],
    image: interviewPrepImage,
    imageAlt: "Interview Prep DSA and MCQ illustration",
    reverse: false,
  },

  {
    id: 2,
    tag: "AI-POWERED",
    title: "AI Resume Analyzer",
    subtitle: "Build a stronger resume",
    description:
      "Get AI-powered insights into your resume, discover missing skills, and understand how well it matches a job description.",
    points: [
      "Resume Upload",
      "ATS Analysis",
      "Skill Gap Detection",
      "Job Matching",
    ],
    image: resumeAnalyzerImage,
    imageAlt: "AI Resume Analyzer illustration",
    reverse: true,
  },

  {
    id: 3,
    tag: "AI INTERVIEW",
    title: "AI Mock Interview",
    subtitle: "Practice like it's real",
    description:
      "Experience realistic technical and HR interviews with AI-generated questions, follow-ups, and detailed evaluation.",
    points: [
      "Technical & HR",
      "Voice Interviews",
      "AI Follow-ups",
      "Performance Evaluation",
    ],
    image: mockInterviewImage,
    imageAlt: "AI Mock Interview illustration",
    reverse: false,
  },

  {
    id: 4,
    tag: "YOUR PROGRESS",
    title: "Progress Tracking",
    subtitle: "Know how you're improving",
    description:
      "Keep track of your preparation journey with coding progress, accuracy, solved problems, and study streaks.",
    points: [
      "Coding Progress",
      "Solved Problems",
      "Accuracy Tracking",
      "Study Streaks",
    ],
    image: progressImage,
    imageAlt: "Progress Tracking illustration",
    reverse: true,
  },
];

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureItem({ feature }) {
  return (
    <article
      className={`feature-showcase ${
        feature.reverse ? "feature-showcase-reverse" : ""
      }`}
    >
      {/* =====================================================
          IMAGE SIDE
      ===================================================== */}

      <div className="feature-image-wrapper">
        <div className="feature-image-glow" />

        <div className="feature-image-card">
          <img
            src={feature.image}
            alt={feature.imageAlt}
            className="feature-image"
          />
        </div>
      </div>

      {/* =====================================================
          CONTENT SIDE
      ===================================================== */}

      <div className="feature-content">
        <div className="feature-tag">
          <span className="feature-tag-dot" />
          {feature.tag}
        </div>

        <h3>{feature.title}</h3>

        <h4>{feature.subtitle}</h4>

        <p>{feature.description}</p>

        <div className="feature-points">
          {feature.points.map((point) => (
            <div className="feature-point" key={point}>
              <span className="feature-check">✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="feature-arrow-button"
          onClick={() => {
            if (feature.id === 1) {
              window.location.href = "/tests";
            }

            if (feature.id === 2) {
              window.location.href = "/resume-analyzer";
            }

            if (feature.id === 3) {
              window.location.href = "/interview";
            }

            if (feature.id === 4) {
              window.location.href = "/progress";
            }
          }}
          aria-label={`Explore ${feature.title}`}
        >
          <span>Explore</span>
          <span className="arrow-icon">↗</span>
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   FEATURES SECTION
========================================================= */

export default function Features() {
  return (
    <section className="features-section" id="features">
      <div className="features-container">

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="features-heading">

          <div className="features-eyebrow">
            <span className="eyebrow-line" />
            EVERYTHING YOU NEED
            <span className="eyebrow-line" />
          </div>

          <h2>
            <span>Your complete interview preparation toolkit</span>
          </h2>

        </div>

        {/* ===================================================
            FEATURE SHOWCASE
        =================================================== */}

        <div className="features-list">
          {features.map((feature) => (
            <FeatureItem
              feature={feature}
              key={feature.id}
            />
          ))}
        </div>

      </div>
    </section>
  );
}