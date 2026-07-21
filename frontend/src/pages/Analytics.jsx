import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import '../styles/dashboard.css';
import '../styles/analytics.css';

// Helper to format creation date globally
const formatDateTime = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper to extract domain name for title heading
const getDomainName = (url) => {
  if (!url) return 'destination';
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/https?:\/\//, '').split('/')[0] || 'destination';
  }
};

const Analytics = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Edit/Update Modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editUrlText, setEditUrlText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.three-dots-wrapper')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all URLs from Spring Boot backend
  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await api.get('/urls');
      if (response.data && response.data.data) {
        setUrls(response.data.data);
      } else {
        setUrls([]);
      }
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
      setError('Failed to load recent URLs. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Copy Short URL
  const handleCopy = (shortUrl, id) => {
    const cleanRedirectUrl = `http://localhost:8080/${shortUrl}`;
    navigator.clipboard.writeText(cleanRedirectUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Edit Modal
  const openEditModal = (urlItem) => {
    setEditingItem(urlItem);
    setEditUrlText(urlItem.originalUrl);
    setEditError('');
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setEditingItem(null);
    setEditUrlText('');
    setEditError('');
  };

  // Update URL
  const handleUpdateUrl = async (e) => {
    e.preventDefault();
    if (!editUrlText.trim()) {
      setEditError('URL cannot be empty');
      return;
    }

    setUpdating(true);
    setEditError('');
    try {
      const response = await api.put(`/urls/${editingItem.id}`, {
        originalUrl: editUrlText
      });
      if (response.data && response.data.data) {
        const updated = response.data.data;
        setUrls(urls.map((u) => (u.id === updated.id ? updated : u)));
        closeEditModal();
      }
    } catch (err) {
      console.error('Error updating URL:', err);
      const msg = err.response?.data?.message || 'Failed to update URL.';
      setEditError(msg);
    } finally {
      setUpdating(false);
    }
  };

  // Delete URL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this URL?')) return;

    try {
      await api.delete(`/urls/${id}`);
      setUrls(urls.filter((url) => url.id !== id));
    } catch (err) {
      console.error('Error deleting URL:', err);
      alert('Failed to delete link. Please try again.');
    }
  };

  // Filter URLs by search query
  const filteredUrls = urls.filter((url) => {
    const q = searchQuery.toLowerCase();
    return (
      (url.originalUrl && url.originalUrl.toLowerCase().includes(q)) ||
      (url.shortUrl && url.shortUrl.toLowerCase().includes(q))
    );
  });

  // --- Compute Analytics Metrics ---
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, item) => sum + (item.clickcount || 0), 0);
  const avgClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : 0;

  // Sort URLs descending by clickcount
  const sortedByClicks = [...filteredUrls].sort((a, b) => (b.clickcount || 0) - (a.clickcount || 0));
  const mostClickedUrl = sortedByClicks.length > 0 ? sortedByClicks[0] : null;
  const maxClicks = mostClickedUrl && mostClickedUrl.clickcount ? mostClickedUrl.clickcount : 1;

  return (
    <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Page Header Card */}
      <section className="bitly-create-card" style={{ padding: '24px' }}>
        <div className="bitly-card-header" style={{ marginBottom: 0 }}>
          <div>
            <h2 style={{ fontSize: '22px' }}>Analytics & Engagement</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Real-time click statistics, traffic distribution, and link popularity insights.
            </p>
          </div>
          <div className="domain-badge" style={{ marginBottom: 0 }}>
            Total Clicks: <span>{totalClicks} 🔥</span>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="table-card">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Calculating link analytics...</p>
          </div>
        </section>
      ) : error ? (
        <section className="table-card">
          <div className="empty-state">
            <h3>Error loading analytics</h3>
            <p>{error}</p>
            <button onClick={fetchUrls} className="create-bitly-btn" style={{ margin: '16px auto 0' }}>Retry</button>
          </div>
        </section>
      ) : urls.length === 0 ? (
        <section className="table-card">
          <div className="empty-state">
            <h3>No Analytics Available Yet</h3>
            <p>Create and share shortened URLs from the Dashboard to start tracking real-time click statistics and user engagement.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-title">Total Short Links</span>
                <span className="stat-icon">🔗</span>
              </div>
              <div className="stat-value">{totalUrls}</div>
              <div className="stat-subtitle">Links generated to date</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-title">Total Clicks</span>
                <span className="stat-icon">👆</span>
              </div>
              <div className="stat-value">{totalClicks}</div>
              <div className="stat-subtitle">All-time link redirections</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-title">Avg. Clicks / Link</span>
                <span className="stat-icon">📈</span>
              </div>
              <div className="stat-value">{avgClicks}</div>
              <div className="stat-subtitle">Average engagement rate</div>
            </div>

            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-title">Top Performing Link</span>
                <span className="stat-icon">🏆</span>
              </div>
              <div className="stat-value">
                {mostClickedUrl && mostClickedUrl.clickcount ? mostClickedUrl.clickcount : 0}
                <span style={{ fontSize: '14px', fontWeight: '400', color: '#64748b', marginLeft: '6px' }}>clicks</span>
              </div>
              <div className="stat-subtitle" title={mostClickedUrl ? `/${mostClickedUrl.shortUrl}` : 'N/A'}>
                {mostClickedUrl ? `localhost:8080/${mostClickedUrl.shortUrl}` : 'No clicks yet'}
              </div>
            </div>
          </section>

          {/* Top Performer Spotlight Card */}
          {mostClickedUrl && (mostClickedUrl.clickcount > 0) && (
            <section className="spotlight-card">
              <div className="spotlight-header">
                <span className="spotlight-badge">🔥 #1 Most Clicked Link</span>
                <span className="spotlight-title">Top Performer Spotlight</span>
              </div>
              <div className="spotlight-body">
                <div className="spotlight-info">
                  <a
                    href={`http://localhost:8080/${mostClickedUrl.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-url-link"
                    style={{ fontSize: '18px', fontWeight: '800' }}
                  >
                    localhost:8080/{mostClickedUrl.shortUrl}
                  </a>
                </div>
                <div className="spotlight-stats">
                  <div className="spotlight-clicks-count">
                    {mostClickedUrl.clickcount} Clicks
                  </div>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>
                    ({totalClicks > 0 ? Math.round((mostClickedUrl.clickcount / totalClicks) * 100) : 0}% of all traffic)
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Leaderboard Table Section */}
          <section className="table-card">
            <div className="table-header">
              <h2>{searchQuery ? `Matching Engagement (${sortedByClicks.length})` : 'URL Engagement Leaderboard'}</h2>
            </div>

            <div className="links-card-list">
              {sortedByClicks.map((urlItem) => {
                const percentage = Math.min(100, Math.round(((urlItem.clickcount || 0) / maxClicks) * 100));
                const isOpen = openDropdownId === urlItem.id;
                const domainName = getDomainName(urlItem.originalUrl);
                const creatorName = urlItem.user?.name || urlItem.userName || urlItem.creator || localStorage.getItem('userName') || 'Surendhar';

                return (
                  <div key={urlItem.id} className="link-item-card">
                    {/* Top Header Row: Checkbox + Domain Title & Three Dot Option */}
                    <div className="link-card-header">
                      <div className="link-card-title-section">
                        <input type="checkbox" className="link-card-checkbox" />
                        <h3 className="link-card-title" title={urlItem.originalUrl}>
                          {domainName}
                        </h3>
                      </div>
                      <div className="link-card-actions-top">
                        <button type="button" className="link-card-share-btn" title="Share link">
                          🔗
                        </button>
                        <div className="three-dots-wrapper">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(isOpen ? null : urlItem.id);
                            }}
                            className="link-card-three-dots"
                            title="More options"
                          >
                            •••
                          </button>
                          {isOpen && (
                            <div className="three-dots-dropdown">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  openEditModal(urlItem);
                                }}
                                className="three-dots-item"
                              >
                                <span>✏️</span> Edit URL
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  handleDelete(urlItem.id);
                                }}
                                className="three-dots-item delete-item"
                              >
                                <span>🗑️</span> Delete Link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Clean Short Link Row */}
                    <div className="link-card-short-row">
                      <a
                        href={`http://localhost:8080/${urlItem.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-card-short-url"
                      >
                        localhost:8080/{urlItem.shortUrl}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(urlItem.shortUrl, urlItem.id)}
                        className={`link-card-copy-icon ${copiedId === urlItem.id ? 'copied' : ''}`}
                        title="Copy short link"
                      >
                        {copiedId === urlItem.id ? '✓' : '📋'}
                      </button>
                    </div>

                    {/* Created By User Line */}
                    <div className="link-card-original-url" style={{ color: '#475569', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>👤 Created by:</span>
                      <span style={{ color: '#1e40af' }}>{creatorName}</span>
                    </div>

                    {/* Footer Row: Click Data & Date */}
                    <div className="link-card-footer">
                      <div className="link-card-click-badge">
                        🔒 Click data <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>🔥 {urlItem.clickcount || 0}</span>
                      </div>
                      <div className="link-card-date">
                        {formatDateTime(urlItem.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* Update/Edit URL Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Original URL</h3>
              <button onClick={closeEditModal} className="close-modal-btn">&times;</button>
            </div>
            <form onSubmit={handleUpdateUrl}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Clean Short Link: <strong>localhost:8080/{editingItem.shortUrl}</strong>
                </span>
              </div>
              <div>
                <label className="url-input-label" htmlFor="edit-input-analytics">Destination URL</label>
                <input
                  id="edit-input-analytics"
                  type="text"
                  value={editUrlText}
                  onChange={(e) => setEditUrlText(e.target.value)}
                  className="url-input"
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>
              {editError && <p className="form-error">❌ {editError}</p>}
              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="save-btn">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Analytics;