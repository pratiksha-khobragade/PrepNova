import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

import logo from "../../../images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* =========================================
            LOGO / BRAND COLUMN
        ========================================= */}
        <div className="footer-column footer-brand">

          <Link to="/" className="footer-logo-block">
            <img
              src={logo}
              alt="PrepNova"
              className="footer-logo"
            />
          </Link>

          <p className="footer-tagline">
            Prepare smarter.
            <br />
            Interview with confidence.
          </p>
        </div>


        {/* =========================================
            PRODUCT
        ========================================= */}
        <div className="footer-column">
          <h3>PRODUCT</h3>

          <div className="footer-links">
            <Link to="/tests">Interview Prep</Link>
            <Link to="/resume-analyzer">Resume Analyzer</Link>
            <Link to="/interview">AI Mock Interview</Link>
            <Link to="/performance">Progress Tracking</Link>
          </div>
        </div>


        {/* =========================================
            RESOURCES
        ========================================= */}
        <div className="footer-column">
          <h3>RESOURCES</h3>

          <div className="footer-links">
            <Link to="/tests/dsa">DSA Problems</Link>
            <Link to="/tests/mcq">MCQ Tests</Link>
            <Link to="/tests/dsa">Coding Practice</Link>
            <Link to="/tests/dsa/submissions">Test History</Link>
          </div>
        </div>


        {/* =========================================
            GET STARTED
        ========================================= */}
        <div className="footer-column">
          <h3>GET STARTED</h3>

          <div className="footer-links">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
        </div>

      </div>


      {/* =========================================
          COPYRIGHT
      ========================================= */}
      <div className="footer-bottom">
        <p>© 2026 PrepNova. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;