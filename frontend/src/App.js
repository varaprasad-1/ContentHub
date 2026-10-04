import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import MainDashboard from './pages/MainDashboard';

import Dashboard from './components/Dashboard';

import Profile from './pages/Profile';
import Posts from './pages/Posts';

import ContentCalendar from './components/ContentCalendar';
import Analytics from './components/Analytics';
import ScheduleManager from './components/ScheduleManager';

import Navbar from './components/Navbar';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <Router>

      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Home />
            )
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <Register
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* =========================
            DASHBOARD LAYOUT
        ========================== */}

        <Route
          element={
            isAuthenticated ? (
              <MainDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* POSTS */}
          <Route
            path="/posts"
            element={<Posts />}
          />

          {/* CALENDAR */}
          <Route
            path="/calendar"
            element={<ContentCalendar />}
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* SCHEDULES */}
          <Route
            path="/schedules"
            element={<ScheduleManager />}
          />

        </Route>

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </Router>
  );
}

export default App;