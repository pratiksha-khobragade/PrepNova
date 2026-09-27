import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

// API
import {
  loginUser,
  googleLoginUser,
} from "../api/authApi";

// Images
import logo from "../../images/logo.png";
import girlFormDesign from "../../images/girlFormDesign.png";

const Login = () => {
  const navigate = useNavigate();

  // Store login form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Show / hide password
  const [showPassword, setShowPassword] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Error message
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // Email / Password Login
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      // Call backend login API
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // Save JWT token
      const token = response?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not received."
        );
      }

      localStorage.setItem(
        "prepnova_token",
        token
      );

      // Login successful
      alert("Login successful!");

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google Login
  // =====================================================

  const handleGoogleSuccess = async (
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

      // Get PrepNova JWT token
      const token = response?.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token not received."
        );
      }

      // Save PrepNova JWT
      localStorage.setItem(
        "prepnova_token",
        token
      );

      // Google login successful
      alert("Google Login Successful!");

      // Go to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Google Login Error:",
        error
      );

      setError(
        error.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Google Login Failure
  // =====================================================

  const handleGoogleError = () => {
    console.error("Google Login Failed");

    setError(
      "Google login failed. Please try again."
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* =========================================
            LEFT SIDE - IMAGE
        ========================================= */}
        <div className="login-image-section">
          <img
            src={girlFormDesign}
            alt="PrepNova"
            className="login-design-image"
          />
        </div>

        {/* =========================================
            RIGHT SIDE - LOGIN FORM
        ========================================= */}
        <div className="login-form-section">
          <div className="login-form-wrapper">

            {/* Logo */}
            <div className="login-logo">
              <Link to="/">
                <img
                  src={logo}
                  alt="PrepNova Logo"
                />
              </Link>
            </div>

            {/* Heading */}
            <div className="login-heading">
              <h1>Welcome back</h1>

              <p>
                Log in to continue your PrepNova journey.
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

            {/* =========================================
                EMAIL / PASSWORD LOGIN
            ========================================= */}
            <form
              onSubmit={handleSubmit}
              className="login-form"
            >

              {/* Email */}
              <div className="login-input-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="login-input-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="password-input-wrapper">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </form>

            {/* =========================================
                GOOGLE LOGIN
            ========================================= */}
            <div className="google-login-section">

              <div className="google-divider">
                <span>OR</span>
              </div>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
              />

            </div>

            {/* Create Account Link */}
            <p className="signup-link-text">
              Don't have an account?{" "}

              <Link to="/signup">
                Create an account
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;