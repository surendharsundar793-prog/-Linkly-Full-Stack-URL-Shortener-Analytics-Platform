import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import '../styles/dashboard.css';

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

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [shownUrlId, setShownUrlId] = useState(null);

  // Edit/Update Modal State
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

  // Fetch URLs from Spring Boot backend on component mount
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

  // Handle new short URL creation
  const handleCreateUrl = async (e) => {
    e.preventDefault();
    setError('');

    if (!originalUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/urls', { originalUrl });
      if (response.data && response.data.data) {
        setUrls([response.data.data, ...urls]);
        setOriginalUrl('');
      }
    } catch (err) {
      console.error('Error creating URL:', err);
      const backendMessage = err.response?.data?.message || 'Failed to shorten URL. Ensure URL includes http:// or https://';
      setError(backendMessage);
    } finally {
      setSubmitting(false);
    }
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

  // Handle Update URL (PUT /api/v1/urls/{id})
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
      const msg = err.response?.data?.message || 'Failed to update URL. Ensure valid URL format.';
      setEditError(msg);
    } finally {
      setUpdating(false);
    }
  };

  // Copy Clean Bitly-style Short URL to Clipboard
  const handleCopy = (shortUrl, id) => {
    const cleanRedirectUrl = `http://localhost:8080/${shortUrl}`;
    navigator.clipboard.writeText(cleanRedirectUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete URL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this short URL?')) return;

    try {
      await api.delete(`/urls/${id}`);
      setUrls(urls.filter((url) => url.id !== id));
    } catch (err) {
      console.error('Error deleting URL:', err);
      alert('Failed to delete URL. Please try again.');
    }
  };

  // Filter URLs by search query
  const filteredUrls = urls.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.originalUrl && u.originalUrl.toLowerCase().includes(q)) ||
      (u.shortUrl && u.shortUrl.toLowerCase().includes(q))
    );
  });

  return (
    <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Bitly Quick Create Card */}
      <section className="bitly-create-card">
        <div className="bitly-card-header">
          <h2>Linkly : Short link</h2>
          <span className="quota-info">You can create your own custom links anytime. ❔</span>
        </div>

        <div className="domain-badge">
          Domain: <span>localhost:8080 🔒</span>
        </div>

        <form onSubmit={handleCreateUrl}>
          <label htmlFor="url-input-field" className="url-input-label">
            Enter your long URL
          </label>
          <div className="url-create-form">
            <input
              id="url-input-field"
              type="text"
              placeholder="https://example.com/my-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="url-input"
              required
            />
            <button type="submit" disabled={submitting} className="create-bitly-btn">
              {submitting ? 'Shortening...' : 'Create your short link'}
            </button>
          </div>
          {error && <p className="form-error">❌ {error}</p>}
        </form>

        <div className="bitly-promo-banner">
          👑 Get custom links and a complimentary domain. Upgrade now
        </div>
      </section>

      {/* Recent Links Section */}
      <section className="table-card">
        <div className="table-header">
          <h2>{searchQuery ? `Search results (${filteredUrls.length})` : 'Recent Links'}</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your shortened URLs...</p>
          </div>
        ) : filteredUrls.length === 0 ? (
          <div className="empty-state">
            <h3>{searchQuery ? 'No matching links found' : 'No URLs created yet'}</h3>
            <p>
              {searchQuery
                ? 'Try searching for a different keyword or URL path.'
                : 'Paste your destination URL above to generate your first clean short link!'}
            </p>
          </div>
        ) : (
          <div className="links-card-list">
            {filteredUrls.map((urlItem) => {
              const isOpen = openDropdownId === urlItem.id;
              const domainName = getDomainName(urlItem.originalUrl);
              const isUrlShown = shownUrlId === urlItem.id;

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
                                setShownUrlId(isUrlShown ? null : urlItem.id);
                              }}
                              className="three-dots-item"
                            >
                              <span>🔍</span> {isUrlShown ? 'Hide URL' : 'Show URL'}
                            </button>
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

                  {/* Original URL Line (Shown only when toggled via three dots Show URL option) */}
                  {isUrlShown && (
                    <div className="link-card-original-url" title={urlItem.originalUrl} style={{ padding: '8px 12px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', marginTop: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '2px' }}>Destination URL:</div>
                      <div style={{ wordBreak: 'break-all', color: '#0f172a', fontSize: '13px' }}>{urlItem.originalUrl}</div>
                    </div>
                  )}

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
        )}
      </section>

      {/* Update/Edit URL Modal */}
      {editingItem && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Edit Destination URL</h3>
              <button onClick={closeEditModal} className="close-modal-btn">&times;</button>
            </div>
            <form onSubmit={handleUpdateUrl}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Clean Short Link: <strong>localhost:8080/{editingItem.shortUrl}</strong>
                </span>
              </div>
              <div>
                <label className="url-input-label" htmlFor="edit-input">Destination URL</label>
                <input
                  id="edit-input"
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

export default Dashboard;