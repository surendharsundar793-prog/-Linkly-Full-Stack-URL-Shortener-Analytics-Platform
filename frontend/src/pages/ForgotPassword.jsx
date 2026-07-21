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
            if (response.data.resetUrl) {
                setResetUrl(response.data.resetUrl);
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
                        <div style={{ marginBottom: resetUrl ? '12px' : '0' }}>{message}</div>
                        {resetUrl && (
                            <div style={{ padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e3a8a', marginBottom: '6px', textTransform: 'uppercase' }}>
                                    ⚡ Instant Cloud Reset Link (Dev Fallback):
                                </div>
                                <a
                                    href={resetUrl}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#2563eb',
                                        color: '#ffffff',
                                        padding: '10px 18px',
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
