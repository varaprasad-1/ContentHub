import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  // Get saved theme
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme to entire application
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previousMode) => !previousMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LEFT SIDE */}
        <div className="navbar-left">

          {/* Theme Button */}
          <button
            className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-icon">
              {darkMode ? '🌙' : '☀️'}
            </span>
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            📊 ContentHub
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <ul className="navbar-links">

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>

              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <li>
                <button
                  className="navbar-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <button className="navbar-button">
                    Login
                  </button>
                </Link>
              </li>

              <li>
                <Link to="/register">
                  <button className="navbar-button">
                    Register
                  </button>
                </Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;