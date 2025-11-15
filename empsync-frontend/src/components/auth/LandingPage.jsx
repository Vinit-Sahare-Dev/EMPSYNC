import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import AuthForms from './AuthForms';
import './LandingPage.css';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showAuthForms, setShowAuthForms] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    showToast('info', 'Demo credentials filled!');
  };

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleLoginToggle = () => {
    setShowAuthForms(true);
  };

  const handleCTAClick = () => {
    setShowAuthForms(true);
  };

  const handleAuthSuccess = (user) => {
    if (onLogin) {
      onLogin(user);
    }

    setShowAuthForms(false);

    // Redirect based on role so employees land in their own section
    if (user?.role === 'EMPLOYEE') {
      navigate('/employee-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // Custom SVG Logo Component
  const EmpSyncLogo = ({ size = 48, className = '' }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby="logoTitle"
    >
      <title id="logoTitle">EmpSync Logo</title>
      <defs>
        <linearGradient id="empsyncGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
      </defs>

      {/* White background */}
      <rect width="32" height="32" rx="8" fill="#ffffff"/>

      {/* Sync arcs */}
      <path 
        d="M8 16 A8 8 0 0 1 16 8" 
        fill="none" 
        stroke="url(#empsyncGradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      <path 
        d="M24 16 A8 8 0 0 1 16 24" 
        fill="none" 
        stroke="url(#empsyncGradient)" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />

      {/* Central Bold "E" */}
      <g transform="translate(10, 8)">
        <rect 
          x="0" 
          y="0" 
          width="12" 
          height="3" 
          fill="url(#empsyncGradient)" 
          rx="1" 
        />
        <rect 
          x="0" 
          y="6" 
          width="9" 
          height="3" 
          fill="url(#empsyncGradient)" 
          rx="1" 
        />
        <rect 
          x="0" 
          y="12" 
          width="12" 
          height="3" 
          fill="url(#empsyncGradient)" 
          rx="1" 
        />
      </g>
    </svg>
  );

  // Small Logo for footer and compact spaces
  const SmallLogo = ({ size = 32 }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="smallLogoTitle"
    >
      <title id="smallLogoTitle">EmpSync Logo</title>
      <defs>
        <linearGradient id="smallGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="100%" stopColor="#2563eb"/>
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="6" fill="url(#smallGradient)"/>
      
      {/* White "E" in center */}
      <g transform="translate(8, 8)">
        <rect x="0" y="0" width="16" height="3" fill="white" rx="1"/>
        <rect x="0" y="6.5" width="12" height="3" fill="white" rx="1"/>
        <rect x="0" y="13" width="16" height="3" fill="white" rx="1"/>
      </g>
    </svg>
  );

  return (
    <div className={`landing-container ${isVisible ? 'loaded' : ''}`}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">
          <div className="logo-icon">
            <EmpSyncLogo size={32} />
          </div>
          <div className="nav-brand-text">
            <span className="project-name">EMPSYNC</span>
            <span className="project-tagline">Admin Portal</span>
          </div>
        </div>
		
        <div className="nav-actions">
          {!showLogin && (
            <button className="nav-features-btn" onClick={scrollToFeatures}>
              <span className="btn-text">Features</span>
            </button>
          )}
          <button 
            className="login-toggle-btn"
            onClick={handleLoginToggle}
          >
            <span className="btn-text">
              {showLogin ? 'Back to Home' : 'Employee/Admin Login'}
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {!showLogin ? (
        <>
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-text">
                <h1>
                  Streamline Your 
                  <span className="gradient-text"> Workforce</span> Management
                </h1>
                <p>
                  EMPSYNC provides powerful tools for administrators to manage employees, 
                  track attendance, monitor performance, and optimize your organization's workflow 
                  with cutting-edge technology.
                </p>
                <div className="hero-features">
                  <div className="feature">
                    <span className="feature-icon">
                      <SmallLogo size={20} />
                    </span>
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
                <div className="hero-actions">
                  <button 
                    className="cta-button primary"
                    onClick={handleCTAClick}
                  >
                    <span>Get Started</span>
                    <div className="btn-arrow">→</div>
                  </button>
                  <button 
                    className="cta-button secondary"
                    onClick={scrollToFeatures}
                  >
                    Explore Features
                  </button>
                </div>
                
                {/* Trust Indicators */}
                <div className="trust-indicators">
                  <div className="trust-item">
                    <strong>50+</strong>
                    <span>Happy Teams</span>
                  </div>
                  <div className="trust-item">
                    <strong>99.9%</strong>
                    <span>Uptime</span>
                  </div>
                  <div className="trust-item">
                    <strong>24/7</strong>
                    <span>Support</span>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <div className="floating-card card-1">
                  <div className="card-header">
                    <div className="card-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="stat">📈 95% Productivity</div>
                    <div className="stat">✅ 45 Employees</div>
                  </div>
                </div>
                
                <div className="floating-card card-2">
                  <div className="card-header">
                    <div className="card-title">Live Activity</div>
                  </div>
                  <div className="activity-list">
                    <div className="activity-item">Sarah checked in</div>
                    <div className="activity-item">Mike completed task</div>
                    <div className="activity-item">Team meeting started</div>
                  </div>
                </div>

                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-title">Dashboard Overview</div>
                    <div className="preview-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="preview-content">
                    <div className="preview-card stats-card">
                      <div className="metric">45</div>
                      <div className="label">Team Members</div>
                    </div>
                    <div className="preview-card stats-card">
                      <div className="metric">98%</div>
                      <div className="label">On Time</div>
                    </div>
                    <div className="preview-card stats-card">
                      <div className="metric">12</div>
                      <div className="label">Projects</div>
                    </div>
                    <div className="preview-card stats-card">
                      <div className="metric">A+</div>
                      <div className="label">Security</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="scroll-indicator" onClick={scrollToFeatures}>
              <div className="scroll-arrow"></div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="features-section">
            <div className="container">
              <div className="section-header">
                <h2>Everything You Need to Manage Your Team</h2>
                <p>Powerful features designed for modern workforce management</p>
              </div>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">
                      <SmallLogo size={24} />
                    </div>
                  </div>
                  <h3>Dashboard Analytics</h3>
                  <p>Real-time insights into employee performance and attendance metrics with beautiful visualizations</p>
                  <div className="feature-badge">Live Data</div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">👨‍💼</div>
                  </div>
                  <h3>Employee Management</h3>
                  <p>Complete control over employee profiles, roles, permissions, and organizational structure</p>
                  <div className="feature-badge">Centralized</div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">⏰</div>
                  </div>
                  <h3>Attendance System</h3>
                  <p>Track and manage employee attendance, leaves, schedules, and time-off requests efficiently</p>
                  <div className="feature-badge">Automated</div>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">🔐</div>
                  </div>
                  <h3>Secure Access</h3>
                  <p>Role-based access control with encryption ensuring maximum data security and privacy</p>
                  <div className="feature-badge">Enterprise</div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="landing-footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-brand">
                  <div className="logo">
                    <div className="logo-icon">
                      <SmallLogo size={28} />
                    </div>
                    <div className="brand-text">
                      <h3>EMPSYNC</h3>
                      <span>Admin Portal</span>
                    </div>
                  </div>
                  <p className="footer-description">
                    Streamlining workforce management for modern enterprises with cutting-edge technology and security.
                  </p>
                  <div className="social-links">
                    <a href="https://github.com/Vinit-Sahare-Dev" target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="social-text">GitHub</span>
                    </a>
                    
                    <a href="https://www.linkedin.com/in/vinit-sahare" target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="social-text">LinkedIn</span>
                    </a>
                    
                    <a href="mailto:vinit.sahare.dev@gmail.com" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z"/>
                      </svg>
                      <span className="social-text">Email</span>
                    </a>
                    
                    <a href="https://instagram.com/vinit.yk" target="_blank" rel="noopener noreferrer" className="social-link">
                      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="social-text">Instagram</span>
                    </a>
                  </div>
                </div>
                
                <div className="footer-links">
                  <div className="footer-column">
                    <h4>Product</h4>
                    <a href="#">Features</a>
                    <a href="#">Pricing</a>
                    <a href="#">Security</a>
                    <a href="#">Updates</a>
                  </div>
                  
                  <div className="footer-column">
                    <h4>Company</h4>
                    <a href="#">About</a>
                    <a href="#">Careers</a>
                    <a href="#">Contact</a>
                    <a href="#">Partners</a>
                  </div>
                  
                  <div className="footer-column">
                    <h4>Resources</h4>
                    <a href="#">Documentation</a>
                    <a href="#">Help Center</a>
                    <a href="#">Community</a>
                    <a href="#">API</a>
                  </div>
                  
                  <div className="footer-column">
                    <h4>Legal</h4>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Cookies</a>
                    <a href="#">Compliance</a>
                  </div>
                </div>
              </div>
              
              <div className="footer-bottom">
                <div className="footer-bottom-content">
                  <p>&copy; 2024 EMPSYNC. All rights reserved.</p>
                  <div className="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Cookie Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </>
      ) : (
        /* Login Section */
        <section className="login-section">
          <div className="login-container">
            <div className="login-card">
              <div className="login-header">
                <div className="login-icon">
                  <EmpSyncLogo size={48} />
                </div>
                <h2>Admin Portal Access</h2>
                <p>Secure login for authorized personnel only</p>
              </div>

              <form onSubmit={handleAdminLogin} className="login-form">
                <div className="form-group">
                  <label>Username</label>
                  <div className="input-container">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      name="username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      placeholder="Enter admin username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-container">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      placeholder="Enter admin password"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    'Sign In as Admin'
                  )}
                </button>
              </form>

              <div className="demo-credentials">
                <div className="demo-header">
                  <h3> Quick Demo Access</h3>
                 
                </div>
                <button 
                  className="demo-btn"
                  onClick={fillDemoCredentials}
                >
                  <span>Use Demo Credentials</span>
                
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Auth Forms Modal */}
      {showAuthForms && (
        <div className="auth-modal-overlay">
          <AuthForms 
            onLogin={handleAuthSuccess}
            onClose={() => setShowAuthForms(false)}
          />
        </div>
      )}
    </div>
  );
};

export default LandingPage;