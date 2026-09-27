import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  faGaugeHigh,
  faFileCircleCheck,
  faClipboardList,
  faUserTie,
  faChartLine,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./DashboardSidebar.css";

// PrepNova logo
import logo from "../../../images/logo.png";

const DashboardSidebar = () => {
  const navigate = useNavigate();

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = () => {
    // Remove login token
    localStorage.removeItem("prepnova_token");

    // Open login page
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">

      {/* =========================
          LOGO
      ========================= */}
      <div className="dashboard-sidebar-logo">
        <img
          src={logo}
          alt="PrepNova"
          className="dashboard-sidebar-logo-image"
        />
      </div>


      {/* =========================
          MAIN MENU
      ========================= */}
      <div className="dashboard-sidebar-section-title">
        MAIN MENU
      </div>

      <nav className="dashboard-sidebar-nav">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `dashboard-sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon icon={faGaugeHigh} />
          </span>

          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/resume-analyzer"
          className={({ isActive }) =>
            `dashboard-sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon
              icon={faFileCircleCheck}
            />
          </span>

          <span>Resume Analyzer</span>
        </NavLink>


        <NavLink
          to="/tests"
          className={({ isActive }) =>
            `dashboard-sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon
              icon={faClipboardList}
            />
          </span>

          <span>Tests</span>
        </NavLink>


        <NavLink
          to="/interview"
          className={({ isActive }) =>
            `dashboard-sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon icon={faUserTie} />
          </span>

          <span>AI Interview</span>
        </NavLink>


        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `dashboard-sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </span>

          <span>Progress tracking</span>
        </NavLink>

      </nav>
      <br></br>

      {/* =========================
          PERSONAL
      ========================= */}
      <div className="dashboard-sidebar-section-title">
        PERSONAL
      </div>

      <nav className="dashboard-sidebar-nav">

        {/* Saved Questions removed */}

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `dashboard-sidebar-item ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon icon={faGear} />
          </span>

          <span>Settings</span>
        </NavLink>

      </nav>


      {/* =========================
          LOGOUT
      ========================= */}
      <div className="dashboard-sidebar-logout">
        <button
          type="button"
          className="dashboard-sidebar-logout-btn"
          onClick={handleLogout}
        >
          <span className="sidebar-item-icon">
            <FontAwesomeIcon
              icon={faRightFromBracket}
            />
          </span>

          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default DashboardSidebar;