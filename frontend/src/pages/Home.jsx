import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1>One Dashboard for All Your Content</h1>
          <p>Manage, schedule, and analyze content across all platforms from a single place</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-light">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-light">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose ContentHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-icon">📊</div>
            <h3>Unified Dashboard</h3>
            <p>View all your content analytics and performance metrics in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📅</div>
            <h3>Smart Scheduling</h3>
            <p>Schedule posts across multiple platforms at the optimal times</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">📈</div>
            <h3>Advanced Analytics</h3>
            <p>Track engagement, revenue, and performance across all platforms</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🔄</div>
            <h3>Multi-Platform Support</h3>
            <p>YouTube, TikTok, Instagram, Twitch, Patreon, Twitter, LinkedIn</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">⏱️</div>
            <h3>Time Management</h3>
            <p>Save hours every week on content management tasks</p>
          </div>
          <div className="feature-card">
            <div className="feature-card-icon">🎯</div>
            <h3>Better Insights</h3>
            <p>Make data-driven decisions to grow your audience and revenue</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2>Ready to Transform Your Content Strategy?</h2>
          <p>Join thousands of content creators already using ContentHub</p>
          <Link to="/register" className="btn" style={{ background: 'white', color: '#6366f1' }}>
            Start Free Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
