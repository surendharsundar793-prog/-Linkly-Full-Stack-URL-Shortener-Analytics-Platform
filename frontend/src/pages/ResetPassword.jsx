import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/resetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('❌ Missing or invalid password reset token in URL.');
        }
    }, [token]);

    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!token) {
            setError('❌ Missing or invalid password reset token.');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match. Please check again.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/reset-password', {
                token,
                newPassword
            });
            setMessage(response.data.message || '✅ Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(
                err.response?.data?.message || '❌ Could not reset password. The link may have expired.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page-container">
            {/* Top-Left Linkly Brand Header */}
            <Link to="/" className="reset-top-logo">
                <img src="/favicon.svg" alt="Linkly Icon" />
                <span className="reset-top-logo-text">Linkly</span>
            </Link>

            <div className="reset-card">
                <h1 className="reset-headline">Set new password</h1>
                <p className="reset-subheadline">
                    Please enter and confirm your new password below for your Linkly account.
                </p>

                {error && <div className="reset-error-alert">{error}</div>}
                {message && <div className="reset-success-alert">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="reset-input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="reset-password-wrapper">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                id="newPassword"
                                placeholder="Enter at least 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="reset-eye-icon"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                title={showNewPassword ? 'Hide password' : 'Show password'}
                            >
                                {showNewPassword ? (
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

                    <div className="reset-input-group">
                        <label htmlFor="confirmPassword">Retype Password</label>
                        <div className="reset-password-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="reset-eye-icon"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                        {confirmPassword.length > 0 && (
                            <div className={`password-match-status ${passwordsMatch ? 'match' : 'mismatch'}`}>
                                {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="reset-submit-btn"
                        disabled={loading || !passwordsMatch || !token}
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>

                <Link to="/login" className="reset-back-link">
                    &larr; Back to Log in
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
