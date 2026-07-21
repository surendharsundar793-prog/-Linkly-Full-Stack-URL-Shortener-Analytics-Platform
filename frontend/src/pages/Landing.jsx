import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/landing.css';

const Landing = () => {
  const [inputUrl, setInputUrl] = useState('');
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    // Redirect directly to signin/login option when user tries to generate a link
    navigate('/login', { state: { pendingUrl: inputUrl } });
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/" style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', overflow: 'hidden' }}>
            <img src="/favicon.svg" alt="Linkly Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Link>
          <Link to="/" className="landing-logo">Linkly</Link>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn-signin">
            Sign In
          </Link>
          <Link to="/register" className="btn-signup">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="landing-main">
        <div className="landing-badge">⚡ Next-Gen Link Management</div>
        <h1 className="landing-title">
          Build stronger connections with every <span>short link</span>
        </h1>
        <p className="landing-subtitle">
          Create sleek, branded, and highly secure short URLs in seconds. Track detailed analytics and manage all your links in one unified dashboard.
        </p>

        {/* Shortener Input Box */}
        <div className="landing-shortener-box">
          <form onSubmit={handleShorten} className="landing-form">
            <input
              type="url"
              className="landing-input"
              placeholder="Enter your Long URL (e.g. https://example.com/long-url)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              required
            />
            <button type="submit" className="landing-btn-shorten">
              Shorten Link
            </button>
          </form>
        </div>
        <p className="landing-notice">
          🔒 Sign in or create a free account to instantly generate and track your short link.
        </p>
      </main>

      {/* Features Cards */}
      <section className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Lightning Fast</h3>
          <p>Redirect visitors instantly with clean root URLs and minimal latency across all devices.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Enterprise Security</h3>
          <p>Full JWT authentication keeps your account links, data, and analytics strictly isolated and secure.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Detailed Analytics</h3>
          <p>Monitor real-time click volumes, traffic share, and link popularity right from your dashboard.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
