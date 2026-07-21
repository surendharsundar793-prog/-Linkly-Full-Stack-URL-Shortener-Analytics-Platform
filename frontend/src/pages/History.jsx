import React, { useState, useEffect, useRef } from 'react';
import api, { BACKEND_ROOT_URL } from '../services/api';
import Layout from '../components/Layout';
import '../styles/dashboard.css';
import '../styles/history.css';

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

const History = () => {
  const [urls, setUrls] = useState([]);
  const shortDomainDisplay = BACKEND_ROOT_URL.replace(/^https?:\/\//, '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Status Filter state (Replacing sort option with Show: Active / Hidden)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active'); // 'Active' | 'Hidden'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hidden Link IDs saved inside localStorage
  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hiddenLinkIds');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Visual feedback & dropdown state
  const [copiedId, setCopiedId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [shownUrlId, setShownUrlId] = useState(null);

  // Edit/Update Modal state
  const [editingItem, setEditingItem] = useState(null);
  const [editUrlText, setEditUrlText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
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
      console.error('Failed to fetch history URLs:', err);
      setError('Could not load history. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Toggle Hide / Unhide state for a link ID
  const toggleHideStatus = (id) => {
    let updatedHiddenIds;
    if (hiddenIds.includes(id)) {
      updatedHiddenIds = hiddenIds.filter((itemId) => itemId !== id);
    } else {
      updatedHiddenIds = [...hiddenIds, id];
    }
    setHiddenIds(updatedHiddenIds);
    localStorage.setItem('hiddenLinkIds', JSON.stringify(updatedHiddenIds));
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

  // Copy Short URL to Clipboard
  const handleCopy = (shortUrl, id) => {
    const fullRedirectUrl = `${BACKEND_ROOT_URL}/${shortUrl}`;
    navigator.clipboard.writeText(fullRedirectUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete URL
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this URL?')) return;

    try {
      await api.delete(`/urls/${id}`);
      setUrls(urls.filter((url) => url.id !== id));
      if (hiddenIds.includes(id)) {
        const remainingHidden = hiddenIds.filter((itemId) => itemId !== id);
        setHiddenIds(remainingHidden);
        localStorage.setItem('hiddenLinkIds', JSON.stringify(remainingHidden));
      }
    } catch (err) {
      console.error('Error deleting URL:', err);
      alert('Failed to delete URL. Please try again.');
    }
  };

  // Helper to format creation date
  // Filter URLs based on Search Query AND Active/Hidden Status
  const filteredUrls = urls.filter((url) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      (url.originalUrl && url.originalUrl.toLowerCase().includes(q)) ||
      (url.shortUrl && url.shortUrl.toLowerCase().includes(q));

    const isItemHidden = hiddenIds.includes(url.id);
    const matchesStatus = filterStatus === 'Active' ? !isItemHidden : isItemHidden;

    return matchesQuery && matchesStatus;
  });

  // Sort by newest first
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUrls.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUrls.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  return (
    <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {/* Title & Stats Card */}
      <section className="bitly-create-card" style={{ padding: '24px' }}>
        <div className="bitly-card-header" style={{ marginBottom: 0 }}>
          <div>
            <h2 style={{ fontSize: '22px' }}>Link History</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Browse, manage, and filter your active and hidden short links in one directory.
            </p>
          </div>
          <div className="domain-badge" style={{ marginBottom: 0 }}>
            Total {filterStatus} Links: <span>{sortedUrls.length}</span>
          </div>
        </div>
      </section>

      {/* Table Card with Custom Status Dropdown Box */}
      <section className="table-card">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{searchQuery ? `Matching ${filterStatus} Links (${sortedUrls.length})` : `${filterStatus} Links (${sortedUrls.length})`}</h2>
          
          {/* Exact Show: Active / Hidden Dropdown from Screenshot */}
          <div className="filter-dropdown-container" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="filter-dropdown-btn"
              title="Filter by link status"
            >
              <span>Show: {filterStatus}</span>
              <span style={{ fontSize: '10px', marginLeft: '4px' }}>{isDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {isDropdownOpen && (
              <div className="filter-dropdown-menu">
                <div
                  onClick={() => {
                    setFilterStatus('Active');
                    setIsDropdownOpen(false);
                  }}
                  className={`filter-dropdown-item ${filterStatus === 'Active' ? 'selected' : ''}`}
                >
                  <span>Active</span>
                  {filterStatus === 'Active' && <span className="filter-checkmark">✓</span>}
                </div>
                <div
                  onClick={() => {
                    setFilterStatus('Hidden');
                    setIsDropdownOpen(false);
                  }}
                  className={`filter-dropdown-item ${filterStatus === 'Hidden' ? 'selected' : ''}`}
                >
                  <span>Hidden</span>
                  {filterStatus === 'Hidden' && <span className="filter-checkmark">✓</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <p className="form-error" style={{ marginBottom: '16px' }}>❌ {error}</p>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your link history...</p>
          </div>
        ) : sortedUrls.length === 0 ? (
          <div className="empty-state">
            <h3>No {filterStatus.toLowerCase()} links found</h3>
            <p>
              {searchQuery
                ? `No ${filterStatus.toLowerCase()} URLs matched "${searchQuery}".`
                : filterStatus === 'Active'
                ? 'You have no active links right now. Head to Home to shorten a new URL!'
                : 'You have not hidden any links yet. Clicking Hide on an active link will move it here.'}
            </p>
          </div>
        ) : (
          <>
            <div className="links-card-list">
              {currentItems.map((urlItem) => {
                const isHidden = hiddenIds.includes(urlItem.id);
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
                                  toggleHideStatus(urlItem.id);
                                }}
                                className="three-dots-item"
                              >
                                <span>👁️</span> {isHidden ? 'Unhide Link' : 'Hide Link'}
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
                        href={`${BACKEND_ROOT_URL}/${urlItem.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-card-short-url"
                      >
                        {shortDomainDisplay}/{urlItem.shortUrl}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '13px', color: '#64748b' }}>
                  Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sortedUrls.length)} of {sortedUrls.length} {filterStatus.toLowerCase()} links
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="copy-btn"
                    style={{ padding: '6px 14px' }}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: currentPage === number ? '#1a56db' : '#cbd5e1',
                        backgroundColor: currentPage === number ? '#1a56db' : '#ffffff',
                        color: currentPage === number ? '#ffffff' : '#0f172a',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="copy-btn"
                    style={{ padding: '6px 14px' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

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
                  Clean Short Link: <strong>{shortDomainDisplay}/{editingItem.shortUrl}</strong>
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

export default History;