import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';

// Helper to check for token
function hasToken() {
  return !!localStorage.getItem('token');
}

function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      {/* Default route logic */}
      <Route
        path="/"
        element={
          hasToken() ? (
            <Navigate to="/dashboard" replace state={{ from: location }} />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
}

export default App;
