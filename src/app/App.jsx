import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';

// Helper to check for token
function hasToken() {
  return !!localStorage.getItem('token');
}

function App() {


  return (
    <>
      {hasToken() ? <Dashboard /> :
        <Routes>
          <Route path="*" element={<Navigate to={'/login'} />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>}
      <Toaster position="top-right" richColors />
    </>

  );
}

export default App;
