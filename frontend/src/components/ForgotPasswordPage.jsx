import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Forgot Password</h1>
                    <p className="text-slate-500 mt-2">Enter your email to receive a reset link.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    {message ? (
                        <p className="text-center text-green-600 font-medium">{message}</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        Remember your password? <Link to="/" className="font-bold text-indigo-600 hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
