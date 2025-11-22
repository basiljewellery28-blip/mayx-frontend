import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

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
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100 min-h-screen flex flex-col justify-between">
            <main className="flex items-center justify-center flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="mx-auto flex items-center justify-center">
                            <img
                                src="https://cdn.shopify.com/s/files/1/0930/2291/2886/files/Logo_1_200x60@2x.png?v=1760613984.webp"
                                alt="Browns The Diamond Store"
                                className="h-16 object-contain custom-logo"
                            />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 shadow-lg rounded-lg">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {step === 1 ? 'Sign in' : 'Welcome back'}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {step === 1 ? "Choose how you'd like to sign in" : `Signing in as ${email}`}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {step === 1 && (
                                <>
                                    <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" type="button">
                                        Sign in with shop
                                    </button>
                                    <div className="flex items-center">
                                        <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                                        <span className="flex-shrink mx-4 text-xs text-gray-500 dark:text-gray-400">or</span>
                                        <div className="flex-grow border-t border-gray-200 dark:border-gray-600"></div>
                                    </div>
                                </>
                            )}

                            {error && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={step === 1 ? handleContinue : handleSubmit}>
                                {step === 1 ? (
                                    <div>
                                        <label className="sr-only" htmlFor="email">Email</label>
                                        <input
                                            autoComplete="email"
                                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            id="email"
                                            name="email"
                                            placeholder="Email"
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="sr-only" htmlFor="password">Password</label>
                                        <input
                                            autoComplete="current-password"
                                            className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            required
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="text-right mt-2">
                                            <button type="button" onClick={handleBack} className="text-sm text-primary hover:text-primary-dark focus:outline-none">
                                                Change email
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <button
                                        className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'LOADING...' : (step === 1 ? 'CONTINUE' : 'SIGN IN')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                    <a className="hover:text-gray-700 dark:hover:text-gray-200" href="#">Privacy policy</a>
                    <a className="hover:text-gray-700 dark:hover:text-gray-200" href="#">Terms of service</a>
                </div>
            </footer>
        </div>
    );
};

export default Login;
