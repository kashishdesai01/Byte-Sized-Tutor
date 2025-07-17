import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

// Eye icons for password visibility toggle
const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);


function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // --- Logic for Registration ---
    if (!isLogin) {
      // ✅ UPDATED: Sequential validation for a better user experience
      
      // Rule 1: Check if passwords match
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      // Rule 2: Check for password strength
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          <div key="strength-error">
            <p className="font-bold">Password is not strong enough.</p>
            <ul className="list-disc list-inside text-left text-xs mt-2">
                <li>At least 8 characters</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (@$!%*?&)</li>
            </ul>
          </div>
        );
        setIsLoading(false);
        return;
      }
      
      // If all validation passes, proceed with API call
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
    } 
    // --- Logic for Login ---
    else {
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
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Byte Sized Tutor</h1>
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full p-3 pr-10 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="block text-slate-600 text-sm font-bold mb-2" htmlFor="confirm-password">Confirm Password</label>
                <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full p-3 pr-10 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5" />}
                    </button>
                </div>
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
              <div className="mb-4 text-center text-sm text-red-600 space-y-1 font-medium bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
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


