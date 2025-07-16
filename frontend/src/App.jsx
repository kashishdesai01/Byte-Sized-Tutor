
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            token 
              ? <Navigate to="/app" /> 
              : <AuthPage onLoginSuccess={handleLoginSuccess} />
          } 
        />
        <Route 
          path="/app/*" // The /* is important for nested routes if you add them later
          element={
            token 
              ? <MainApp token={token} onLogout={handleLogout} /> 
              : <Navigate to="/" />
          } 
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;