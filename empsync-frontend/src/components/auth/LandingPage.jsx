import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import AuthForms from './AuthForms';
import './LandingPage.css';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleVisibility = () => {
      setIsVisible(true);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleVisibility);
    handleVisibility();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleVisibility);
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
                className="cta-button cta-primary"
                onClick={handleLoginToggle}
              >
                <span>Get Started</span>
                <div className="btn-arrow">→</div>
              </button>
              <button 
                className="cta-button cta-secondary"
                onClick={scrollToFeatures}
              >
                Explore Features
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
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">🏢</span>
              </div>
              <h3>Department Management</h3>
              <p className="feature-description">
                Organize teams by departments, assign managers, and streamline communication channels.
              </p>
              <span className="feature-badge">Organization</span>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <span className="feature-icon-large">📈</span>
              </div>
              <h3>Performance Monitoring</h3>
              <p className="feature-description">
                Track employee performance, set goals, conduct reviews, and identify top performers across the organization.
              </p>
              <span className="feature-badge">HR Tools</span>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {!showLogin && (
        <footer className="landing-footer">
          <div className="footer-content">
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
              <div className="social-links">
                <a href="#" className="social-link">
                  <span className="social-icon">📧</span>
                  <span className="social-text">Contact</span>
                </a>
                <a href="#" className="social-link">
                  <span className="social-icon">💼</span>
                  <span className="social-text">LinkedIn</span>
                </a>
                <a href="#" className="social-link">
                  <span className="social-icon">🐦</span>
                  <span className="social-text">Twitter</span>
                </a>
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
