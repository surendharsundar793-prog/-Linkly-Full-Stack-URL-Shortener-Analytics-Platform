import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Layout = ({ children, searchQuery = '', onSearchChange = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.toLowerCase();

  const userName = localStorage.getItem('userName') || 'Surendhar';
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = localStorage.getItem('userEmail') || 'surendharsundar793@gmail.com';

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('sidebarCollapsed', nextState.toString());
  };

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Top Header Navbar */}
      <header className="dashboard-header">
        <div className={`brand-section ${isCollapsed ? 'collapsed' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 1. Menubar Dropdown Button beside Logo (Visible ONLY on Mobile/Tablet <= 768px) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="mobile-menubar-btn"
              title="Toggle Navigation Menu"
            >
              ☰
            </button>

            {/* 2. Logo */}
            <Link to="/dashboard" className="bitly-logo-icon" title="Linkly">
              <img src="/favicon.svg" alt="Linkly Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Link>
            {!isCollapsed && <Link to="/dashboard" className="brand-logo-text">Linkly</Link>}
          </div>
        </div>

        <div className="header-right-area">
          <div className="header-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search.."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="header-search-input"
            />
          </div>

          <div className="header-right" style={{ position: 'relative' }}>
            <div
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="user-profile-badge"
              title="Account Options"
              style={{ cursor: 'pointer' }}
            >
              <div className="user-avatar">{userInitial}</div>
              <span className="user-name-text">{userName}</span>
              <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '2px' }}>▼</span>
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <>
                <div
                  className="profile-dropdown-backdrop"
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                <div className="profile-user-dropdown">
                  <div className="profile-dropdown-header">
                    <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '16px', flexShrink: 0 }}>
                      {userInitial}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {userName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {userEmail}
                      </div>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  {/* Logout option in profile dropdown: ONLY visible on Mobile Responsive (<= 768px) where sidebar is hidden */}
                  <button
                    type="button"
                    onClick={(e) => {
                      setIsProfileDropdownOpen(false);
                      handleLogout(e);
                    }}
                    className="profile-dropdown-item logout-item mobile-only-item"
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                    </span>{' '}
                    Logout
                  </button>

                  <div className="profile-dropdown-divider mobile-only-item" />

                  <Link
                    to="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="profile-dropdown-item"
                  >
                    <span>⚙️</span> Profile Settings
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menubar Dropdown Menu (Slide-out directly below header - ONLY on Mobile/Tablet <= 768px) */}
      {isMobileMenuOpen && (
        <>
          <div className="mobile-dropdown-overlay" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-dropdown-menu">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (path !== '/dashboard') {
                  navigate('/dashboard');
                } else {
                  document.getElementById('url-input-field')?.focus();
                }
              }}
              className="sidebar-create-btn"
              style={{ marginBottom: '16px' }}
            >
              + Create new
            </button>

            <nav className="mobile-nav-list">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`sidebar-link ${path === '/dashboard' ? 'active' : ''}`}
              >
                <span>🏠</span> Home
              </Link>
              <Link
                to="/history"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`sidebar-link ${path === '/history' ? 'active' : ''}`}
              >
                <span>🔗</span> Links
              </Link>
              <Link
                to="/analytics"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`sidebar-link ${path === '/analytics' ? 'active' : ''}`}
              >
                <span>📊</span> Analytics
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`sidebar-link ${path === '/profile' ? 'active' : ''}`}
              >
                <span>⚙️</span>Profile Settings
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Body Layout: Left Sidebar (Desktop ONLY > 768px) + Main Area */}
      <div className="dashboard-body">
        {/* Left Sidebar (Desktop Only) */}
        <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
          {/* Circular Toggle Button positioned exactly on the vertical dividing border line */}
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn desktop-only-btn"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? '›' : '‹'}
          </button>

          <button
            onClick={() => {
              if (path !== '/dashboard') {
                navigate('/dashboard');
              } else {
                document.getElementById('url-input-field')?.focus();
              }
            }}
            className="sidebar-create-btn"
            title="Create new short link"
          >
            {isCollapsed ? '+' : 'Create new'}
          </button>

          <div className="sidebar-divider" />

          <nav className="sidebar-nav">
            <Link
              to="/dashboard"
              className={`sidebar-link ${path === '/dashboard' ? 'active' : ''}`}
              title="Home"
            >
              <span>🏠</span> {!isCollapsed && 'Home'}
            </Link>
            <Link
              to="/history"
              className={`sidebar-link ${path === '/history' ? 'active' : ''}`}
              title="Links"
            >
              <span>🔗</span> {!isCollapsed && 'Links'}
            </Link>
            <Link
              to="/analytics"
              className={`sidebar-link ${path === '/analytics' ? 'active' : ''}`}
              title="Analytics"
            >
              <span>📊</span> {!isCollapsed && 'Analytics'}
            </Link>
            <Link
              to="/profile"
              className={`sidebar-link ${path === '/profile' ? 'active' : ''}`}
              title="Settings"
            >
              <span>⚙️</span> {!isCollapsed && 'Settings'}
            </Link>
          </nav>

          {/* Desktop Logout Button at the bottom of the left sidebar */}
          <a
            href="#logout"
            onClick={handleLogout}
            className="sidebar-logout"
            title="Logout"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>{' '}
            {!isCollapsed && 'Logout'}
          </a>
        </aside>

        {/* Main Content Area - Expands cleanly when sidebar collapses or on mobile */}
        <main className={`dashboard-main ${isCollapsed ? 'collapsed' : ''}`}>
          <div className="dashboard-content-inner">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
