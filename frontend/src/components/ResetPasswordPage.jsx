import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../api';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: password }),
            });
            const result = await response.json();
            if (response.ok) {
                setMessage(result.message + ' You will be redirected to login shortly.');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(result.detail || 'Failed to reset password.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8"><h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Reset Your Password</h1></div>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                    {message ? (
                        <p className="text-center text-green-600 font-medium">{message}</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="password">New Password</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
                            </div>
                            <div className="mb-6">
                                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm New Password</label>
                                <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
                            </div>
                            {error && <p className="mb-4 text-center text-sm text-red-600 font-medium">{error}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-700 disabled:bg-slate-400 transition-colors">
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                     <p className="text-center text-sm text-slate-500 mt-6">
                        <Link to="/" className="font-bold text-indigo-600 hover:underline">Back to Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordPage;
