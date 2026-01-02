import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import AuthForms from './AuthForms';
import './LandingPage.css';
import './PickEffect.css';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Start as visible for instant loading

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Remove load event listener for instant visibility
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!credentials.email || !credentials.password) {
        showToast('error', 'Please enter both email and password');
        setLoading(false);
        return;
      }

      // Admin-only authentication
      let user = null;

      if (credentials.email === 'admin@empsync.com' && credentials.password === 'admin123') {
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
    setCredentials({ email: 'admin@empsync.com', password: 'admin123' });
    showToast('info', 'Demo credentials filled!');
  };

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleLoginToggle = () => {
    setShowLogin(true);
  };

  const handleBackToHome = () => {
    setShowLogin(false);
  };

  const handleAuthSuccess = (user) => {
    if (onLogin) {
      onLogin(user);
    }

    setShowLogin(false);

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
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* White background */}
      <rect width="32" height="32" rx="8" fill="#ffffff" />

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
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="6" fill="url(#smallGradient)" />

      {/* White "E" in center */}
      <g transform="translate(8, 8)">
        <rect x="0" y="0" width="16" height="3" fill="white" rx="1" />
        <rect x="0" y="6.5" width="12" height="3" fill="white" rx="1" />
        <rect x="0" y="13" width="16" height="3" fill="white" rx="1" />
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
            <span className="project-name" style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.05em', textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', position: 'relative', display: 'inline-block', marginBottom: '2px' }}>EMPSYNC</span>
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
            onClick={showLogin ? handleBackToHome : handleLoginToggle}
          >
            <span className="btn-text">
              {showLogin ? 'Back to Home' : 'Sign In'}
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      {!showLogin ? (
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Streamline Your <span className="workforce">workforce</span> Management
            </h1>
            <p className="hero-subtitle">
              EMPSYNC provides powerful tools for administrators to manage employees,
              track attendance, monitor performance, and optimize your organization's workflow
              with cutting-edge technology.
            </p>

            <div className="hero-buttons">
              <button
                className="cta-button cta-primary pick-effect"
                onClick={handleLoginToggle}
              >
                <span>Get Started</span>
                <div className="ripple-effect"></div>
              </button>
              <button
                className="cta-button cta-secondary pick-effect"
                onClick={scrollToFeatures}
              >
                Explore Features
                <div className="ripple-effect"></div>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Login Section with Integrated Forms */
        <section className="login-section">
          <div className="login-container">
            <div className="integrated-auth-container">
              <AuthForms
                onLogin={handleAuthSuccess}
                onClose={() => setShowLogin(false)}
                defaultForm="admin-login"
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!showLogin && (
        <section id="features" className="features-section">
          <div className="section-header">
            <h2>Powerful Features for Modern Workforce Management</h2>
            <p>Everything you need to efficiently manage your team and streamline operations</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">👥</span>
              </div>
              <h3>Employee Management</h3>
              <p className="feature-description">
                Comprehensive employee database with detailed profiles, roles, and organizational hierarchy management.
              </p>
              <span className="feature-badge">Core Feature</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">📊</span>
              </div>
              <h3>Advanced Analytics</h3>
              <p className="feature-description">
                Real-time insights and comprehensive reports on workforce performance, attendance, and productivity.
              </p>
              <span className="feature-badge">Analytics</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">⏱️</span>
              </div>
              <h3>Attendance Tracking</h3>
              <p className="feature-description">
                Automated time tracking, leave management, and attendance monitoring with detailed reporting.
              </p>
              <span className="feature-badge">Automation</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">🔒</span>
              </div>
              <h3>Secure Access</h3>
              <p className="feature-description">
                Multi-factor authentication, role-based permissions, and enterprise-grade security protocols.
              </p>
              <span className="feature-badge">Security</span>
            </div>
          </div>
        </section>
      )}

      {/* About Us Section */}
      {!showLogin && (
        <section className="about-section">
          <div className="about-container">
            <div className="about-header">
              <h2>About EMPSYNC</h2>
              <p>Transforming workforce management with innovative technology</p>
            </div>
            <div className="about-content">
              <div className="about-text">
                <h3>Our Mission</h3>
                <p>
                  EMPSYNC is dedicated to revolutionizing how organizations manage their most valuable asset - their people.
                  We combine cutting-edge technology with user-friendly design to create solutions that streamline operations,
                  boost productivity, and foster growth.
                </p>
                <h3>Why Choose Us?</h3>
                <p>
                  Built by developers who understand the challenges of modern workforce management, EMPSYNC offers
                  comprehensive tools that scale with your organization. From startups to enterprises, we provide the
                  flexibility and power you need to succeed.
                </p>
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Organizations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">1000+</span>
                  <span className="stat-label">Employees</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {!showLogin && (
        <footer className="landing-footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-links-horizontal">
                <div className="footer-contacts">
                  <div className="footer-brand">
                    <div className="logo">
                      <SmallLogo size={40} />
                      <div className="brand-text">
                        <h3>EMPSYNC</h3>
                        <span>Workforce Management Solution</span>
                      </div>
                    </div>
                    <p className="footer-description">
                      Empowering organizations with modern workforce management tools.
                      Streamline operations, boost productivity, and foster growth with our comprehensive platform.
                    </p>
                  </div>
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <span className="social-icon">📧</span>
                      <span className="social-text">Contact</span>
                    </a>
                    <a href="#" className="social-link">
                      <span className="social-icon">💼</span>
                      <span className="social-text">LinkedIn</span>
                    </a>
                  </div>
                </div>

                <div className="footer-column">
                  <h4>Product</h4>
                  <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#demo">Request Demo</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Company</h4>
                  <ul>
                    <li><a href="#team">Our Team</a></li>
                    <li><a href="#careers">Careers</a></li>
                    <li><a href="#blog">Blog</a></li>
                    <li><a href="#press">Press Kit</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Resources</h4>
                  <ul>
                    <li><a href="#docs">Documentation</a></li>
                    <li><a href="#api">API Reference</a></li>
                    <li><a href="#support">Support Center</a></li>
                    <li><a href="#community">Community</a></li>
                  </ul>
                </div>

                <div className="footer-column">
                  <h4>Legal</h4>
                  <ul>
                    <li><a href="#privacy">Privacy Policy</a></li>
                    <li><a href="#terms">Terms of Service</a></li>
                    <li><a href="#security">Security</a></li>
                    <li><a href="#compliance">Compliance</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 EMPSYNC. All rights reserved. Built with ❤️ by <a href="https://github.com/Vinit-Sahare-Dev" target="_blank" rel="noopener noreferrer" className="creator-link">Vinit Sahare</a> for modern teams.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LandingPage;
