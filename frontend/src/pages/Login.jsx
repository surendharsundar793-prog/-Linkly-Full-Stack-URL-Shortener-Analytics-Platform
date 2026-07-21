import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setForgotSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.name || 'User');
        localStorage.setItem('userEmail', response.data.email || email);
        if (response.data.age) {
          localStorage.setItem('userAge', response.data.age.toString());
        }
        navigate('/dashboard');
      } else {
        setError('❌ Authentication failed. No token received.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('❌ Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  return (
    <div className="login-page-container">
      {/* Top Left Brand Logo */}
      <Link to="/" className="login-top-logo">
        <img src="/favicon.svg" alt="Logo" />
        <span className="login-top-logo-text">Linkly</span>
      </Link>

      {/* Left Half: Login Form Section */}
      <div className="login-left-half">
        <div className="login-form-inner">
          <h1 className="login-headline">Log in and start sharing</h1>
          <p className="login-subheadline">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>

          {error && <div className="error-alert">{error}</div>}
          {forgotSuccess && <div className="forgot-success-alert">{forgotSuccess}</div>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '4px' }}>
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
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

            {/* Forgot your password? link */}
            <div className="forgot-pwd-container">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password-link"
              >
                Forgot your password?
              </button>
            </div>

            <button type="submit" className="bitly-login-submit-btn" disabled={loading || !email || !password}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {/* Website Description Footer */}
          <div className="login-legal-footer">
            Linkly is the modern URL shortening and analytics platform built to shorten, brand, and track every link with precision.
          </div>
        </div>
      </div>

      {/* Right Half: Hero Banner & Illustration */}
      <div className="login-right-half">
        <div className="login-hero-img-wrapper">
          <img
            src="/login-hero.png"
            alt="Connect Linkly to the tools you use every day"
          />
        </div>
        <h2 className="login-hero-caption">Connect Linkly to the tools you use every day</h2>
      </div>
    </div>
  );
};

export default Login;