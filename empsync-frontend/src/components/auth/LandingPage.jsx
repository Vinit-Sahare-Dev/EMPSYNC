// src/components/landing/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import './LandingPage.css';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!credentials.username || !credentials.password) {
        showToast('error', 'Please enter both username and password');
        setLoading(false);
        return;
      }

      // Admin-only authentication
      let user = null;
      
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        user = { 
          username: 'admin', 
          role: 'ADMIN', 
          name: 'System Administrator',
          email: 'admin@company.com'
        };
      }

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (onLogin) {
          onLogin(user);
        }
        
        showToast('success', `Welcome ${user.name}!`);
        navigate('/dashboard');
      } else {
        showToast('error', 'Invalid admin credentials');
      }

    } catch (error) {
      console.error('Login error:', error);
      showToast('error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setCredentials({ username: 'admin', password: 'admin123' });
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <h1>EMPSYNC</h1>
          <span>Admin Portal</span>
        </div>
        <div className="nav-actions">
          <button 
            className="login-toggle-btn"
            onClick={() => setShowLogin(!showLogin)}
          >
            {showLogin ? 'Back to Home' : 'Admin Login'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {!showLogin ? (
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Streamline Your Workforce Management</h1>
              <p>
                EMPSYNC provides powerful tools for administrators to manage employees, 
                track attendance, monitor performance, and optimize your organization's workflow.
              </p>
              <div className="hero-features">
                <div className="feature">
                  <span className="feature-icon">👥</span>
                  <span>Employee Management</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span>Advanced Analytics</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⏱️</span>
                  <span>Attendance Tracking</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>Secure Access</span>
                </div>
              </div>
              <button 
                className="cta-button"
                onClick={() => setShowLogin(true)}
              >
                Access Admin Dashboard
              </button>
            </div>
            <div className="hero-visual">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="preview-content">
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Login Section */
        <section className="login-section">
          <div className="login-card">
            <div className="login-header">
              <h2>Admin Login</h2>
              <p>Access the employee management dashboard</p>
            </div>

            <form onSubmit={handleAdminLogin} className="login-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleInputChange}
                  placeholder="Enter admin username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In as Admin'}
              </button>
            </form>

            <div className="demo-credentials">
              <h3>Demo Admin Access:</h3>
              <button 
                className="demo-btn"
                onClick={fillDemoCredentials}
              >
                Use Demo Credentials
              </button>
              <div className="credential-info">
                <strong>Username:</strong> admin
                <br />
                <strong>Password:</strong> admin123
              </div>
            </div>

            <div className="back-link">
              <button onClick={() => setShowLogin(false)}>
                ← Back to Home
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!showLogin && (
        <section className="features-section">
          <div className="container">
            <h2>Powerful Admin Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📈</div>
                <h3>Dashboard Analytics</h3>
                <p>Real-time insights into employee performance and attendance metrics</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👨‍💼</div>
                <h3>Employee Management</h3>
                <p>Complete control over employee profiles, roles, and permissions</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <h3>Attendance System</h3>
                <p>Track and manage employee attendance, leaves, and schedules</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h3>Secure Access</h3>
                <p>Role-based access control ensuring data security and privacy</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;