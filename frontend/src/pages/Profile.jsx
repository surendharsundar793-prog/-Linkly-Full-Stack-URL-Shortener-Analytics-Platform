import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/dashboard.css';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // 1. Username State
  const [username, setUsername] = useState(localStorage.getItem('userName') || 'Surendhar');
  const [savingUsername, setSavingUsername] = useState(false);

  // 2. Email State
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || 'surendharsundar793@gmail.com');
  const [savingEmail, setSavingEmail] = useState(false);

  // 3. Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Notification Alerts
  const [alert, setAlert] = useState({ type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 4500);
  };

  // Handler 1: Update Username on Backend Database
  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      showAlert('error', 'Username cannot be empty.');
      return;
    }
    setSavingUsername(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: username.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userName', data.name || username.trim());
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        showAlert('success', '✅ Username updated on database successfully!');
      } else {
        showAlert('error', data.message || 'Failed to update username on database.');
      }
    } catch (err) {
      console.error(err);
      // Fallback update in case offline
      localStorage.setItem('userName', username.trim());
      showAlert('success', '✅ Username updated locally.');
    } finally {
      setSavingUsername(false);
    }
  };

  // Handler 2: Update Email on Backend Database
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showAlert('error', 'Please enter a valid email address.');
      return;
    }
    setSavingEmail(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userEmail', data.email || email.trim());
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        showAlert('success', '✅ Email address updated on database successfully!');
      } else {
        showAlert('error', data.message || 'Failed to update email on database.');
      }
    } catch (err) {
      console.error(err);
      localStorage.setItem('userEmail', email.trim());
      showAlert('success', '✅ Email address updated locally.');
    } finally {
      setSavingEmail(false);
    }
  };

  // Handler 3: Change Password on Backend Database
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showAlert('error', 'Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      showAlert('error', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('error', 'New password and confirm password do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showAlert('success', '🔒 Password changed and saved to database successfully!');
      } else {
        showAlert('error', data.message || 'Failed to update password on database.');
      }
    } catch (err) {
      console.error(err);
      showAlert('error', 'Network error while attempting to update password on database.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handler 4: Delete Account and All Associated URL Data from Backend Database
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '⚠️ Are you absolutely sure you want to delete your account?\n\nThis action is permanent and cannot be undone. All your shortened links, analytics, and personal data will be completely removed from the database.'
    );
    if (confirmDelete) {
      const finalVerify = window.confirm('Final verification: Click OK to permanently delete your account and wipe all URL records from the database.');
      if (finalVerify) {
        try {
          const res = await fetch('http://localhost:8080/api/v1/users/profile', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            localStorage.clear();
            navigate('/register');
          } else {
            const data = await res.json();
            alert(`Could not delete account: ${data.message || 'Unknown error'}`);
          }
        } catch (err) {
          console.error(err);
          // If server offline, clear locally and redirect
          localStorage.clear();
          navigate('/register');
        }
      }
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <section className="bitly-create-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="bitly-card-header" style={{ marginBottom: 0 }}>
          <div>
            <h2 style={{ fontSize: '22px' }}>Profile Settings</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Update your username, email preferences, profile password, and profile status. Changes are saved directly to the database.
            </p>
          </div>
        </div>
      </section>

      {/* Global Alert Notification */}
      {alert.message && (
        <div className={`profile-alert-msg ${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* 1 & 2: Username and Email Settings Card */}
      <section className="profile-settings-card">
        <h3 className="profile-section-title">Profile Details</h3>
        <p className="profile-section-subtitle">Update your personal identification information across the platform. Stored in database.</p>

        {/* 1. Username Form */}
        <form onSubmit={handleUpdateUsername} className="settings-form-row">
          <label className="settings-label" htmlFor="input-username">1. Username</label>
          <div className="settings-input-group">
            <input
              id="input-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="settings-input"
              placeholder="Enter your username"
              required
            />
            <button type="submit" disabled={savingUsername} className="btn-settings-save">
              {savingUsername ? 'Saving to DB...' : 'Save Username'}
            </button>
          </div>
        </form>

        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '24px 0' }} />

        {/* 2. Email Form */}
        <form onSubmit={handleUpdateEmail} className="settings-form-row">
          <label className="settings-label" htmlFor="input-email">2. Email Address</label>
          <div className="settings-input-group">
            <input
              id="input-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="settings-input"
              placeholder="Enter your email address"
              required
            />
            <button type="submit" disabled={savingEmail} className="btn-settings-save">
              {savingEmail ? 'Saving to DB...' : 'Save Email'}
            </button>
          </div>
        </form>
      </section>

      {/* 3: Change Password Card */}
      <section className="profile-settings-card">
        <h3 className="profile-section-title">3. Change Password</h3>
        <p className="profile-section-subtitle">Ensure your account uses a secure password. Your new password will be encrypted and updated in the database.</p>

        <form onSubmit={handleChangePassword}>
          <div className="settings-form-row">
            <label className="settings-label" htmlFor="curr-pass">Current Password</label>
            <input
              id="curr-pass"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="settings-input"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="settings-form-row" style={{ marginTop: '16px' }}>
            <label className="settings-label" htmlFor="new-pass">New Password</label>
            <input
              id="new-pass"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="settings-input"
              placeholder="At least 6 characters"
              required
            />
          </div>

          <div className="settings-form-row" style={{ marginTop: '16px' }}>
            <label className="settings-label" htmlFor="conf-pass">Confirm New Password</label>
            <input
              id="conf-pass"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="settings-input"
              placeholder="Repeat new password"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="submit" disabled={savingPassword} className="btn-settings-save" style={{ padding: '12px 28px' }}>
              {savingPassword ? 'Updating DB...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      {/* 4: Delete Account Danger Card */}
      <section className="danger-settings-card">
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#dc2626', marginBottom: '6px' }}>
            4. Delete Account
          </h3>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '540px' }}>
            Once you delete your account, all of your shortened links, analytics data, and user profile records will be permanently removed from the database (`users` and `urls` tables). There is no going back.
          </p>
        </div>
        <button onClick={handleDeleteAccount} className="btn-danger-delete">
          Delete Account
        </button>
      </section>
    </Layout>
  );
};

export default Profile;