import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleViewSwitch = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const result = await response.json();
        if (response.ok) {
          onLoginSuccess(result.access_token);
        } else {
          setError(result.detail || 'Registration failed.');
        }
      } catch (error) {
        setError('An error occurred. Is the backend server running?');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(`${API_URL}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ username: email, password }),
        });
        const result = await response.json();
        if (response.ok) {
          onLoginSuccess(result.access_token);
        } else {
          setError(result.detail || 'Login failed.');
        }
      } catch (error) {
        setError('An error occurred during login.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">AI Study Buddy</h1>
          <p className="text-indigo-600 mt-2 font-semibold">Your personal AI-powered learning partner.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">{isLogin ? 'Log In' : 'Register'}</h2>
            
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
            </div>

            <div className="mb-4">
              <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" required />
              </div>
            )}

            {isLogin && (
                <div className="text-right mb-6">
                    <Link to="/forgot-password" className="text-sm font-semibold text-indigo-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
            )}
            
            {message && <p className="mb-4 text-center text-sm text-green-600 font-medium">{message}</p>}
            {error && (
              <div className="mb-4 text-center text-sm text-red-600 space-y-1 font-medium">
                <p>{error}</p>
                {isLogin && (
                    <p>
                        New user?{' '}
                        <button type="button" className="font-bold text-indigo-600 hover:underline" onClick={handleViewSwitch}>
                            Register here.
                        </button>
                    </p>
                )}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 rounded-lg text-white font-bold hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200">
                {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Register')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={handleViewSwitch} className="font-bold text-indigo-600 hover:underline ml-2">{isLogin ? 'Register' : 'Log In'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
