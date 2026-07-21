import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CreateUrl from './pages/CreateUrl';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root / Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Authentication Routes (Public) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Main Application Routes (Protected by JWT) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/createurl"
        element={
          <ProtectedRoute>
            <CreateUrl />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;