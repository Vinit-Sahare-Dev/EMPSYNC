import React, { useState } from 'react';
import { useToast } from '../ui/Toast';
import './AuthForms.css';

const AuthForms = ({ onLogin, onClose, defaultForm = 'employee-login' }) => {
  const [activeForm, setActiveForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const { showToast } = useToast();

  // Employee Login State
  const [employeeLogin, setEmployeeLogin] = useState({
    username: '',
    password: ''
  });

  // Admin Login State
  const [adminLogin, setAdminLogin] = useState({
    username: '',
    password: ''
  });

  // Employee Register State
  const [employeeRegister, setEmployeeRegister] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    employeeId: '',
    department: '',
    position: '',
    phoneNumber: '',
    address: ''
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

  // Reset Password State
  const [resetPassword, setResetPassword] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('🧪 Testing backend connection...');
      const response = await fetch('http://localhost:8888/api/employees');
      const data = await response.json();
      console.log('✅ Backend connected:', data);
      return true;
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return false;
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);

    try {
      console.log('🔄 Forgot password request:', forgotPasswordEmail);
      
      const isBackendConnected = await testBackendConnection();
      
      if (!isBackendConnected) {
        showToast('error', 'Backend connection failed. Please try again later.');
        return;
      }

      const response = await fetch('http://localhost:8888/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          userType: activeForm.startsWith('employee') ? 'employee' : 'admin'
        })
      });

      const data = await response.json();
      console.log('📨 Forgot password response:', data);

      if (response.ok) {
        showToast('success', 'Password reset instructions sent to your email!');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        showToast('error', data.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('🚨 Forgot password error:', error);
      showToast('error', 'Failed to process request. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      showToast('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Reset password attempt');
      
      const response = await fetch('http://localhost:8888/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetPassword.token,
          newPassword: resetPassword.newPassword
        })
      });

      const data = await response.json();
      console.log('📨 Reset password response:', data);

      if (response.ok) {
        showToast('success', 'Password reset successfully! Please login with your new password.');
        setResetPassword({
          token: '',
          newPassword: '',
          confirmPassword: ''
        });
        setActiveForm(activeForm.startsWith('employee') ? 'employee-login' : 'admin-login');
      } else {
        showToast('error', data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('🚨 Reset password error:', error);
      showToast('error', 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Employee login attempt:', employeeLogin.username);
      
      // Test backend first
      const isBackendConnected = await testBackendConnection();
      
      if (!isBackendConnected) {
        showToast('error', 'Backend connection failed. Please try again later.');
        return;
      }

      const response = await fetch('http://localhost:8888/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...employeeLogin,
          userType: 'employee'
        })
      });

      const data = await response.json();
      console.log('📨 Employee login response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        const userData = {
          username: data.username,
          name: data.name,
          role: data.role,
          userType: data.userType
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Employee login successful:', userData);
        showToast('success', `Welcome ${data.name}!`);
        onLogin(userData);
        onClose();
      } else {
        console.error('❌ Employee login failed:', data.message);
        showToast('error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('🚨 Employee login error:', error);
      showToast('error', 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Admin login attempt:', adminLogin.username);
      
      // Test backend first
      const isBackendConnected = await testBackendConnection();
      
      if (!isBackendConnected) {
        showToast('error', 'Backend connection failed. Please try again later.');
        return;
      }

      const response = await fetch('http://localhost:8888/api/auth/login', {
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
      console.log('📨 Admin login response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        const userData = {
          username: data.username,
          name: data.name,
          role: data.role,
          userType: data.userType
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Admin login successful:', userData);
        showToast('success', `Welcome ${data.name}!`);
        onLogin(userData);
        onClose();
      } else {
        console.error('❌ Admin login failed:', data.message);
        showToast('error', data.message || 'Login failed');
      }
    } catch (error) {
      console.error('🚨 Admin login error:', error);
      showToast('error', 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (employeeRegister.password !== employeeRegister.confirmPassword) {
      showToast('error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Employee registration attempt:', employeeRegister.username);
      
      const response = await fetch('http://localhost:8888/api/auth/register/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeRegister)
      });

      const data = await response.json();
      console.log('📨 Employee registration response:', data);

      if (response.ok) {
        console.log('✅ Employee registration successful');
        showToast('success', 'Account created successfully! Please login with your credentials.');
        
        // Reset form and redirect to login
        setEmployeeRegister({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          employeeId: '',
          department: '',
          position: '',
          phoneNumber: '',
          address: ''
        });
        
        // Redirect to employee login
        setActiveForm('employee-login');
      } else {
        console.error('❌ Employee registration failed:', data.message);
        showToast('error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('🚨 Employee registration error:', error);
      showToast('error', 'Registration failed. Please try again.');
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
      console.log('🔄 Admin registration attempt:', adminRegister.username);
      
      const response = await fetch('http://localhost:8888/api/auth/register/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminRegister)
      });

      const data = await response.json();
      console.log('📨 Admin registration response:', data);

      if (response.ok) {
        console.log('✅ Admin registration successful');
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
        
        // Redirect to admin login
        setActiveForm('admin-login');
      } else {
        console.error('❌ Admin registration failed:', data.message);
        showToast('error', data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('🚨 Admin registration error:', error);
      showToast('error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-forms-container">
      <div className="auth-header">
        <h2>EMPSYNC Portal</h2>
        <p>Choose your login method</p>
      </div>

      <div className="auth-tabs">
        <button 
          className={`tab-btn ${activeForm.startsWith('employee') ? 'active' : ''}`}
          onClick={() => {
            setActiveForm('employee-login');
            setShowForgotPassword(false);
          }}
        >
          Employee
        </button>
        <button 
          className={`tab-btn ${activeForm.startsWith('admin') ? 'active' : ''}`}
          onClick={() => {
            setActiveForm('admin-login');
            setShowForgotPassword(false);
          }}
        >
          Admin/Manager
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
                Back to Login
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
                onChange={(e) => setResetPassword({...resetPassword, token: e.target.value})}
                placeholder="Enter the token from your email"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={resetPassword.newPassword}
                  onChange={(e) => setResetPassword({...resetPassword, newPassword: e.target.value})}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={resetPassword.confirmPassword}
                  onChange={(e) => setResetPassword({...resetPassword, confirmPassword: e.target.value})}
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
                onClick={() => setActiveForm(activeForm.startsWith('employee') ? 'employee-login' : 'admin-login')}
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Employee Login */}
        {activeForm === 'employee-login' && !showForgotPassword && (
          <form onSubmit={handleEmployeeLogin} className="auth-form">
            <h3>Employee Login</h3>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={employeeLogin.username}
                onChange={(e) => setEmployeeLogin({...employeeLogin, username: e.target.value})}
                placeholder="Enter your username"
                required
                className="login-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={employeeLogin.password}
                onChange={(e) => setEmployeeLogin({...employeeLogin, password: e.target.value})}
                placeholder="Enter your password"
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
                'Sign In as Employee'
              )}
            </button>

            <div className="auth-links">
              <span>Don't have an account? </span>
              <button type="button" onClick={() => setActiveForm('employee-register')}>
                Register as Employee
              </button>
            </div>
          </form>
        )}

        {/* Employee Register */}
        {activeForm === 'employee-register' && (
          <form onSubmit={handleEmployeeRegister} className="auth-form">
            <h3>Employee Registration</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={employeeRegister.username}
                  onChange={(e) => setEmployeeRegister({...employeeRegister, username: e.target.value})}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Employee ID *</label>
                <input
                  type="text"
                  value={employeeRegister.employeeId}
                  onChange={(e) => setEmployeeRegister({...employeeRegister, employeeId: e.target.value})}
                  placeholder="EMP001"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={employeeRegister.name}
                onChange={(e) => setEmployeeRegister({...employeeRegister, name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={employeeRegister.email}
                onChange={(e) => setEmployeeRegister({...employeeRegister, email: e.target.value})}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department *</label>
                <select
                  value={employeeRegister.department}
                  onChange={(e) => setEmployeeRegister({...employeeRegister, department: e.target.value})}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div className="form-group">
                <label>Position *</label>
                <input
                  type="text"
                  value={employeeRegister.position}
                  onChange={(e) => setEmployeeRegister({...employeeRegister, position: e.target.value})}
                  placeholder="Your position"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={employeeRegister.password}
                  onChange={(e) => setEmployeeRegister({...employeeRegister, password: e.target.value})}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={employeeRegister.confirmPassword}
                  onChange={(e) => setEmployeeRegister({...employeeRegister, confirmPassword: e.target.value})}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={employeeRegister.phoneNumber}
                onChange={(e) => setEmployeeRegister({...employeeRegister, phoneNumber: e.target.value})}
                placeholder="Your phone number"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                value={employeeRegister.address}
                onChange={(e) => setEmployeeRegister({...employeeRegister, address: e.target.value})}
                placeholder="Your address"
                rows="3"
              />
            </div>

            <button type="submit" className="auth-btn primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Creating Account...
                </>
              ) : (
                'Register as Employee'
              )}
            </button>

            <div className="auth-links">
              <span>Already have an account? </span>
              <button type="button" onClick={() => setActiveForm('employee-login')}>
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Admin Login */}
        {activeForm === 'admin-login' && !showForgotPassword && (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <h3>Admin Login</h3>
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={adminLogin.username}
                onChange={(e) => setAdminLogin({...adminLogin, username: e.target.value})}
                placeholder="Enter admin username"
                required
                className="login-input"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={adminLogin.password}
                onChange={(e) => setAdminLogin({...adminLogin, password: e.target.value})}
                placeholder="Enter admin password"
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
                'Sign In as Admin'
              )}
            </button>

            <div className="auth-links">
              <span>Need admin access? </span>
              <button type="button" onClick={() => setActiveForm('admin-register')}>
                Register as Admin
              </button>
            </div>
          </form>
        )}

        {/* Admin Register */}
        {activeForm === 'admin-register' && (
          <form onSubmit={handleAdminRegister} className="auth-form">
            <h3>Admin Registration</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  value={adminRegister.username}
                  onChange={(e) => setAdminRegister({...adminRegister, username: e.target.value})}
                  placeholder="Choose admin username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Admin Level *</label>
                <select
                  value={adminRegister.adminLevel}
                  onChange={(e) => setAdminRegister({...adminRegister, adminLevel: e.target.value})}
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
                onChange={(e) => setAdminRegister({...adminRegister, name: e.target.value})}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={adminRegister.email}
                onChange={(e) => setAdminRegister({...adminRegister, email: e.target.value})}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>Department Access</label>
              <select
                value={adminRegister.departmentAccess}
                onChange={(e) => setAdminRegister({...adminRegister, departmentAccess: e.target.value})}
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
                  onChange={(e) => setAdminRegister({...adminRegister, password: e.target.value})}
                  placeholder="Create password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={adminRegister.confirmPassword}
                  onChange={(e) => setAdminRegister({...adminRegister, confirmPassword: e.target.value})}
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
                'Register as Admin'
              )}
            </button>

            <div className="auth-links">
              <span>Already have an account? </span>
              <button type="button" onClick={() => setActiveForm('admin-login')}>
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>

      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default AuthForms;