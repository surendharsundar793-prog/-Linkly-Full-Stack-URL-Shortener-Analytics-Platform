import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        age: age ? parseInt(age, 10) : 24
      });

      if (response.status === 201 || response.data) {
        setSuccessMsg("✅ Account registered successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("❌ Registration failed. Please check backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      {/* Top Left Brand Logo */}
      <Link to="/" className="register-top-logo">
        <img src="/favicon.svg" alt="Logo" />
        <span className="register-top-logo-text">Linkly</span>
      </Link>

      {/* Left Half: Register Form Section */}
      <div className="register-left-half">
        <div className="register-form-inner">
          <h1 className="register-headline">Create your Linkly account</h1>
          <p className="register-subheadline">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          {error && <div className="error-alert">{error}</div>}
          {successMsg && <div className="success-alert">{successMsg}</div>}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                placeholder="24"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle-btn"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>

              {confirmPassword && (
                password === confirmPassword ? (
                  <p style={{ color: '#047857', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>✅ Passwords match</p>
                ) : (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>❌ Passwords do not match</p>
                )
              )}
            </div>

            <button
              type="submit"
              className="bitly-register-submit-btn"
              disabled={
                password !== confirmPassword ||
                password === "" ||
                loading
              }
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          {/* Website Description Footer */}
          <div className="register-legal-footer">
            Linkly is the modern URL shortening and analytics platform built to shorten, brand, and track every link with precision.
          </div>
        </div>
      </div>

      {/* Right Half: Hero Banner & Illustration */}
      <div className="register-right-half">
        <div className="register-hero-img-wrapper">
          <img
            src="/register-hero.png"
            alt="Start your Linkly journey today and track every link"
          />
        </div>
        <h2 className="register-hero-caption">Start your Linkly journey today and track every link</h2>
      </div>
    </div>
  );
};

export default Register;