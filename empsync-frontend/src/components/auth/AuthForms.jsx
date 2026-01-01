import React, { useState } from 'react';
import { useToast } from '../ui/Toast';
import './AuthForms.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api';

const AuthForms = ({ onLogin, onClose, defaultForm = 'admin-login' }) => {
  const [activeForm, setActiveForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Admin Login State
  const [adminLogin, setAdminLogin] = useState({
    username: '',
    password: ''
  });

  // Admin Register State
  const [adminRegister, setAdminRegister] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    adminLevel: 'MANAGER',
    departmentAccess: ''
  });

  // Forgot Password State
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Reset Password State
  const [resetPassword, setResetPassword] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Toast notification function
  const showToast = (type, message) => {
    if (typeof Toast === 'function') {
      Toast[type](message);
    } else {
      // Fallback if Toast is not available
    }
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Password reset instructions sent to your email!');
        setForgotPasswordEmail('');
        setShowForgotPassword(false);
      } else {
        console.error('❌ Forgot password failed:', data.message);
        showToast('error', data.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('🚨 Forgot password error:', error);
      showToast('error', 'Failed to send reset instructions. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      showToast('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetPassword)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Password reset successfully! Please login with your new password.');
        setResetPassword({ token: '', newPassword: '', confirmPassword: '' });
        setActiveForm('admin-login');
      } else {
        console.error('❌ Reset password failed:', data.message);
        showToast('error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('🚨 Reset password error:', error);
      showToast('error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Test backend connection first
      const isBackendConnected = await testBackendConnection();

      if (!isBackendConnected) {
        showToast('error', 'Backend connection failed. Please try again later.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...adminLogin,
          userType: 'admin'
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        const userData = {
          username: data.username,
          name: data.name,
          role: data.role,
          userType: data.userType
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        showToast('success', `Welcome ${data.name}!`);
        onLogin(userData);
        onClose();
      } else {
        console.error('❌ Login failed:', data.message);
        showToast('error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('🚨 Login error:', error);
      showToast('error', 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (adminRegister.password !== adminRegister.confirmPassword) {
      showToast('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminRegister)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Account created successfully! Please login with your credentials.');

        // Reset form and redirect to login
        setAdminRegister({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          adminLevel: 'MANAGER',
          departmentAccess: ''
        });

        // Redirect to login
        setActiveForm('admin-login');
      } else {
        console.error('❌ Registration failed:', data.message);
        showToast('error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('🚨 Registration error:', error);
      showToast('error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="integrated-auth-container">
        <div className="auth-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="auth-forms-container">
          <div className="auth-header">
            <div className="auth-icon">
              <span>🔐</span>
            </div>
            <h2>EMPSYNC Portal</h2>
            <p>Secure authentication system</p>
          </div>

          <div className="auth-tabs">
            <button
              className={`tab-btn ${activeForm.startsWith('admin') ? 'active' : ''}`}
              onClick={() => {
                setActiveForm('admin-login');
                setShowForgotPassword(false);
              }}
            >
              Access
            </button>
          </div>

          <div className="auth-forms">
            {/* Forgot Password Form */}
            {showForgotPassword && (
              <form onSubmit={handleForgotPassword} className="auth-form">
                <h3>Reset Your Password</h3>
                <p className="forgot-password-description">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    className="login-input"
                  />
                </div>

                <button type="submit" className="auth-btn primary" disabled={forgotPasswordLoading}>
                  {forgotPasswordLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>

                <div className="auth-links">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail('');
                    }}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Reset Password Form */}
            {activeForm === 'reset-password' && (
              <form onSubmit={handleResetPassword} className="auth-form">
                <h3>Create New Password</h3>

                <div className="form-group">
                  <label>Reset Token</label>
                  <input
                    type="text"
                    value={resetPassword.token}
                    onChange={(e) => setResetPassword({ ...resetPassword, token: e.target.value })}
                    placeholder="Enter token from your email"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={resetPassword.newPassword}
                      onChange={(e) => setResetPassword({ ...resetPassword, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={resetPassword.confirmPassword}
                      onChange={(e) => setResetPassword({ ...resetPassword, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <div className="auth-links">
                  <button
                    type="button"
                    onClick={() => setActiveForm('admin-login')}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Admin Login */}
            {activeForm === 'admin-login' && !showForgotPassword && (
              <form onSubmit={handleAdminLogin} className="auth-form">
                <h3>Login</h3>

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={adminLogin.username}
                    onChange={(e) => setAdminLogin({ ...adminLogin, username: e.target.value })}
                    placeholder="Enter username"
                    required
                    className="login-input"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={adminLogin.password}
                    onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    className="login-input"
                  />
                </div>

                <div className="forgot-password-link">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="forgot-password-btn"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="auth-links">
                  <span>Need access? </span>
                  <button type="button" onClick={() => setActiveForm('admin-register')}>
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* Admin Register */}
            {activeForm === 'admin-register' && (
              <form onSubmit={handleAdminRegister} className="auth-form">
                <h3>Create Account</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={adminRegister.username}
                      onChange={(e) => setAdminRegister({ ...adminRegister, username: e.target.value })}
                      placeholder="Choose username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Level *</label>
                    <select
                      value={adminRegister.adminLevel}
                      onChange={(e) => setAdminRegister({ ...adminRegister, adminLevel: e.target.value })}
                      required
                    >
                      <option value="MANAGER">Manager</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={adminRegister.name}
                    onChange={(e) => setAdminRegister({ ...adminRegister, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={adminRegister.email}
                    onChange={(e) => setAdminRegister({ ...adminRegister, email: e.target.value })}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department Access</label>
                  <select
                    value={adminRegister.departmentAccess}
                    onChange={(e) => setAdminRegister({ ...adminRegister, departmentAccess: e.target.value })}
                  >
                    <option value="">All Departments</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={adminRegister.password}
                      onChange={(e) => setAdminRegister({ ...adminRegister, password: e.target.value })}
                      placeholder="Create password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password *</label>
                    <input
                      type="password"
                      value={adminRegister.confirmPassword}
                      onChange={(e) => setAdminRegister({ ...adminRegister, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-btn primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="btn-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="auth-links">
                  <span>Already have access? </span>
                  <button type="button" onClick={() => setActiveForm('admin-login')}>
                    Access
                  </button>
                </div>
              </form>
            )}
          </div>

          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthForms;