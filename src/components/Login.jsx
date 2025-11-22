import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Email, 2: Password
    const navigate = useNavigate();

    const handleContinue = (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login({ email, password });
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setError('');
        setPassword('');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-logo-container">
                        <img
                            src="https://cdn.shopify.com/s/files/1/0930/2291/2886/files/Logo_1_200x60@2x.png?v=1760613984.webp"
                            alt="Browns The Diamond Store"
                            className="login-logo"
                        />
                    </div>
                    <h1 className="login-title">{step === 1 ? 'Sign in' : 'Welcome back'}</h1>
                    <p className="login-subtitle">
                        {step === 1 ? "Choose how you'd like to sign in" : `Signing in as ${email}`}
                    </p>
                </div>

                {step === 1 && (
                    <>
                        <button className="btn-shop-login">
                            Sign in with shop
                        </button>

                        <div className="login-divider">
                            <span>or</span>
                        </div>
                    </>
                )}

                <form onSubmit={step === 1 ? handleContinue : handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    {step === 1 ? (
                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email"
                                className="login-input"
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="login-input"
                                autoFocus
                            />
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <button type="button" onClick={handleBack} className="btn-link-back">
                                    Change email
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'LOADING...' : (step === 1 ? 'CONTINUE' : 'SIGN IN')}
                    </button>
                </form>

                <div className="login-footer-links">
                    <a href="#">Privacy policy</a>
                    <a href="#">Terms of service</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
