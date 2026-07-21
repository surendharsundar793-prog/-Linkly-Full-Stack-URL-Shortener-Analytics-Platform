import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/forgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [resetUrl, setResetUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetUrl('');

        if (!email) {
            setError('Please enter your registered email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data.message || '✅ Password reset link has been sent to your email.');
            if (response.data.resetToken) {
                setResetUrl(`${window.location.origin}/reset-password?token=${response.data.resetToken}`);
            } else if (response.data.resetUrl) {
                const cleanUrl = response.data.resetUrl.replace(/http:\/\/localhost:5173|http:\/\/127\.0\.0\.1:5173/g, window.location.origin);
                setResetUrl(cleanUrl);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || '❌ Could not connect to server or send email right now.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page-container">
            {/* Top-Left Linkly Brand Header */}
            <Link to="/" className="forgot-top-logo">
                <img src="/favicon.svg  " alt="Linkly Icon" />
                <span className="forgot-top-logo-text">Linkly</span>
            </Link>

            <div className="forgot-card">
                <h1 className="forgot-headline">Reset your password</h1>
                <p className="forgot-subheadline">
                    Enter your email address and we'll send you a link to reset your Linkly account password.
                </p>

                {error && <div className="forgot-error-alert">{error}</div>}
                {message && (
                    <div className="forgot-success-alert" style={{ wordBreak: 'break-word', textAlign: 'left' }}>
                        <div style={{ marginBottom: resetUrl ? '14px' : '0', fontSize: '14px', lineHeight: '1.5' }}>{message}</div>
                        {resetUrl && (
                            <div style={{ textAlign: 'center', marginTop: '6px' }}>
                                <a
                                    href={resetUrl}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#2563eb',
                                        color: '#ffffff',
                                        padding: '10px 22px',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                                    }}
                                >
                                    Proceed to Reset Password &rarr;
                                </a>
                            </div>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="forgot-input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="forgot-submit-btn" disabled={loading}>
                        {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <Link to="/login" className="forgot-back-link">
                    &larr; Back to Log in
                </Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
