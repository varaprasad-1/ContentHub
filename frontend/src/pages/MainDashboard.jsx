import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function MainDashboard() {
  const location = useLocation();

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <ul>

          <li>
            <Link
              to="/dashboard"
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              📈 Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/calendar"
              className={location.pathname === '/calendar' ? 'active' : ''}
            >
              🗓️ Content Calendar
            </Link>
          </li>

          <li>
            <Link
              to="/posts"
              className={location.pathname === '/posts' ? 'active' : ''}
            >
              📝 Posts
            </Link>
          </li>

          <li>
            <Link
              to="/analytics"
              className={location.pathname === '/analytics' ? 'active' : ''}
            >
              📊 Analytics
            </Link>
          </li>

          <li>
            <Link
              to="/schedules"
              className={location.pathname === '/schedules' ? 'active' : ''}
            >
              ⏰ Schedules
            </Link>
          </li>

        </ul>
      </aside>

      {/* PAGE CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default MainDashboard;