// =====================================================
// PrepNova - Signup Page
// =====================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import {
  signupUser,
  googleLoginUser,
} from "../api/authApi";

import logo from "../../images/logo.png";
import boyFormDesign from "../../images/boyFormDesign.png";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  // =====================================================
  // Form State
  // =====================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // =====================================================
  // UI State
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // Handle Signup
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Check password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      // Call backend signup API
      const response = await signupUser({
        firstName,
        lastName,
        email,
        password,
      });

      // Get JWT token
      const token = response?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not received."
        );
      }

      // Save JWT token
      localStorage.setItem(
        "prepnova_token",
        token
      );

      // Signup successful
      alert("Account created successfully!");

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google Signup / Login
  // =====================================================

  const handleGoogleSignup = async (
    credentialResponse
  ) => {
    setError("");

    try {
      setLoading(true);

      // Google returns the ID token here
      const credential =
        credentialResponse?.credential;

      if (!credential) {
        throw new Error(
          "Google credential not received."
        );
      }

      // Send Google credential to backend
      const response =
        await googleLoginUser(credential);

      // Get PrepNova JWT
      const token = response?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not received."
        );
      }

      // Save JWT token
      localStorage.setItem(
        "prepnova_token",
        token
      );

      // Google signup/login successful
      alert("Google Signup Successful!");

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Google Signup Error:",
        error
      );

      setError(
        error.message ||
          "Google signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google Login Failure
  // =====================================================

  const handleGoogleError = () => {
    console.error("Google Signup Failed");

    setError(
      "Google signup failed. Please try again."
    );
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="signup-page">

      {/* =================================================
          Main Signup Card
          ================================================= */}

      <div className="signup-container">

        {/* =================================================
            LEFT - IMAGE
            ================================================= */}

        <div className="signup-image-section">

          <img
            src={boyFormDesign}
            alt="PrepNova Signup"
            className="signup-design-image"
          />

        </div>

        {/* =================================================
            RIGHT - FORM
            ================================================= */}

        <div className="signup-form-section">

          <div className="signup-form-wrapper">

            {/* Logo */}

            <div className="signup-logo">

              <Link to="/">
                <img
                  src={logo}
                  alt="PrepNova"
                />
              </Link>

            </div>

            {/* Heading */}

            <div className="signup-heading">

              <h1>
                Create your account
              </h1>

              <p>
                Start your preparation journey
                with PrepNova.
              </p>

            </div>

            {/* Error Message */}

            {error && (
              <div
                style={{
                  color: "#b42318",
                  background: "#fff1f0",
                  border: "1px solid #ffd1cc",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "15px",
                  fontSize: "12px",
                }}
              >
                {error}
              </div>
            )}

            {/* =================================================
                FORM
                ================================================= */}

            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >

              {/* First + Last Name */}

              <div className="name-row">

                <div className="input-group">

                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

                <div className="input-group">

                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>

              {/* Email */}

              <div className="input-group">

                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                />

              </div>

              {/* Password */}

              <div className="input-group">

                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  minLength={6}
                  required
                />

              </div>

              {/* Confirm Password */}

              <div className="input-group">

                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  minLength={6}
                  required
                />

              </div>

              {/* Create Account */}

              <button
                type="submit"
                className="signup-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>

            </form>

            {/* Divider */}

            <div className="signup-divider">

              <span></span>

              <p>OR</p>

              <span></span>

            </div>

            {/* =================================================
                Google Signup
                ================================================= */}

            <div className="google-signup-section">

              <GoogleLogin
                onSuccess={
                  handleGoogleSignup
                }
                onError={
                  handleGoogleError
                }
                useOneTap={false}
              />

            </div>

            {/* Login */}

            <p className="login-text">

              Already have an account?{" "}

              <Link to="/login">
                Log in
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;