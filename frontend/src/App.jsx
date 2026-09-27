import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// =========================================================
// Landing Page
// =========================================================

import Header from "./Landing Page/Header/Header";
import Features from "./Landing Page/Features/Features";
import Footer from "./Landing Page/Footer/Footer";

// =========================================================
// Authentication Pages
// =========================================================

import Login from "./auth/Login";
import Signup from "./auth/Signup";

// =========================================================
// Dashboard
// =========================================================

import Dashboard from "./dashboard/Dashboard";

// Dashboard Sidebar
import DashboardSidebar from "./dashboard/layout/DashboardSidebar";

// =========================================================
// Resume Analyzer
// =========================================================

import ResumeAnalyzer from "./modules/resumeAnalyzer/ResumeAnalyzer";

// =========================================================
// Tests Module
// =========================================================

import Tests from "./modules/tests/layout/Tests";

// =========================================================
// DSA Module
// =========================================================

import DSAHome from "./modules/tests/dsa/DSAHome";
import DSAProblem from "./modules/tests/dsa/pages/DSAProblem";
import SubmissionHistory from "./modules/tests/dsa/pages/SubmissionHistory";

// =========================================================
// MCQ Module
// =========================================================

import MCQHome from "./modules/tests/mcq/MCQHome";
import MCQDashboard from "./modules/tests/mcq/pages/MCQDashboard";
import MCQTest from "./modules/tests/mcq/pages/MCQTest";
import MCQResult from "./modules/tests/mcq/pages/MCQResult";
import MCQHistory from "./modules/tests/mcq/components/MCQHistory";

// =========================================================
// AI Interview
// =========================================================

import InterviewSetup from "./modules/interview/pages/InterviewSetup";
import Interview from "./modules/interview/Interview";
import InterviewReport from "./modules/interview/pages/InterviewReport";

// =========================================================
// Progress Tracking
// =========================================================

import ProgressTracking from "./modules/progress tracking/ProgressTracking";

// =========================================================
// Settings
// =========================================================

import Settings from "./modules/settings/Settings";


// =========================================================
// AI INTERVIEW FLOW
// =========================================================

const InterviewFlow = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("setup");
  const [interviewId, setInterviewId] = useState(null);
  const [report, setReport] = useState(null);

  // -------------------------------------------------------
  // Interview Created
  // -------------------------------------------------------

  const handleInterviewCreated = (response) => {
    console.log("Interview created response:", response);

    const interview =
      response?.interview ||
      response?.data?.interview ||
      response?.data ||
      response;

    const id =
      interview?.id ||
      interview?._id ||
      interview?.interviewId;

    if (!id) {
      console.error("Interview ID missing:", response);
      return;
    }

    console.log("Interview created successfully:", id);

    setInterviewId(id);
    setReport(null);
    setStep("live");
  };

  // -------------------------------------------------------
  // Interview Finished
  // -------------------------------------------------------

  const handleInterviewFinished = (
    finalReport,
    finishedInterviewId
  ) => {
    console.log(
      "Interview finished response:",
      finalReport
    );

    const id =
      finishedInterviewId ||
      finalReport?.interviewId ||
      finalReport?.report?.interviewId ||
      interviewId;

    if (!id) {
      console.error(
        "Interview ID missing after completion:",
        finalReport
      );
    }

    const finalReportData =
      finalReport?.report ||
      finalReport?.data?.report ||
      finalReport?.data ||
      finalReport;

    console.log(
      "Final interview report:",
      finalReportData
    );

    setInterviewId(id);
    setReport(finalReportData);
    setStep("report");
  };

  // -------------------------------------------------------
  // Start New Interview
  // -------------------------------------------------------

  const handleNewInterview = () => {
    console.log("Starting a new interview...");

    setInterviewId(null);
    setReport(null);
    setStep("setup");

    navigate("/interview");
  };

  // -------------------------------------------------------
  // Setup
  // -------------------------------------------------------

  if (step === "setup") {
    return (
      <InterviewSetup
        onInterviewCreated={handleInterviewCreated}
      />
    );
  }

  // -------------------------------------------------------
  // Live Interview
  // -------------------------------------------------------

  if (step === "live") {
    return (
      <Interview
        interviewId={interviewId}
        onFinish={handleInterviewFinished}
        onInterviewFinished={handleInterviewFinished}
      />
    );
  }

  // -------------------------------------------------------
  // Interview Report
  // -------------------------------------------------------

  if (step === "report") {
    return (
      <InterviewReport
        interviewId={interviewId}
        report={report}
        onNewInterview={handleNewInterview}
      />
    );
  }

  // -------------------------------------------------------
  // Fallback
  // -------------------------------------------------------

  return (
    <InterviewSetup
      onInterviewCreated={handleInterviewCreated}
    />
  );
};


// =========================================================
// PROGRESS TRACKING LAYOUT
// Sidebar + Progress Tracking
// =========================================================

const ProgressTrackingLayout = () => {
  return (
    <>
      <DashboardSidebar />
      <ProgressTracking />
    </>
  );
};


// =========================================================
// SETTINGS LAYOUT
// Sidebar + Settings
// =========================================================

const SettingsLayout = () => {
  return (
    <>
      <DashboardSidebar />
      <Settings />
    </>
  );
};


// =========================================================
// MAIN APP
// =========================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            LANDING PAGE
            Header + Features + Footer
        ================================================= */}

        <Route
          path="/"
          element={
            <>
              <Header />
              <Features />
              <Footer />
            </>
          }
        />


        {/* =================================================
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* =================================================
            DASHBOARD
        ================================================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* =================================================
            RESUME ANALYZER
        ================================================= */}

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />


        {/* =================================================
            TESTS
        ================================================= */}

        <Route
          path="/tests"
          element={<Tests />}
        />


        {/* =================================================
            DSA
        ================================================= */}

        <Route
          path="/tests/dsa"
          element={<DSAHome />}
        />

        <Route
          path="/tests/dsa/problem/:problemId"
          element={<DSAProblem />}
        />

        <Route
          path="/tests/dsa/submissions"
          element={<SubmissionHistory />}
        />


        {/* =================================================
            MCQ
        ================================================= */}

        <Route
          path="/tests/mcq"
          element={<MCQHome />}
        />

        <Route
          path="/tests/mcq/dashboard"
          element={<MCQDashboard />}
        />

        <Route
          path="/tests/mcq/test/:attemptId"
          element={<MCQTest />}
        />

        <Route
          path="/tests/mcq/result/:attemptId"
          element={<MCQResult />}
        />

        <Route
          path="/tests/mcq/history"
          element={<MCQHistory />}
        />


        {/* =================================================
            AI INTERVIEW
        ================================================= */}

        <Route
          path="/interview"
          element={<InterviewFlow />}
        />


        {/* =================================================
            PROGRESS TRACKING
        ================================================= */}

        <Route
          path="/progress"
          element={<ProgressTrackingLayout />}
        />

        <Route
          path="/performance"
          element={<ProgressTrackingLayout />}
        />


        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={<SettingsLayout />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;