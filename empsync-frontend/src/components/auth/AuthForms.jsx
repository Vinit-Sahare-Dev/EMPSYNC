import React, { useState } from 'react';
import { useToast } from '../ui/Toast';
import './AuthForms.css';

const AuthForms = ({ onLogin, onClose, defaultForm = 'employee-login' }) => {
  const [activeForm, setActiveForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
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

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔄 Employee login attempt:', employeeLogin.username);
      
      // Test backend first
      const isBackendConnected = await testBackendConnection();
      
      if (!isBackendConnected) {
        // Fallback to demo login
        console.log('🔄 Using demo employee login');
        quickDemoLogin('employee');
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
      // Fallback to demo login
      console.log('🔄 Falling back to demo employee login');
      quickDemoLogin('employee');
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
        // Fallback to demo login
        console.log('🔄 Using demo admin login');
        quickDemoLogin('admin');
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
      // Fallback to demo login
      console.log('🔄 Falling back to demo admin login');
      quickDemoLogin('admin');
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
        localStorage.setItem('token', data.token);
        const userData = {
          username: data.username,
          name: data.name,
          role: data.role,
          userType: data.userType
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Employee registration successful:', userData);
        showToast('success', `Account created successfully! Welcome ${data.name}!`);
        onLogin(userData);
        onClose();
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
        localStorage.setItem('token', data.token);
        const userData = {
          username: data.username,
          name: data.name,
          role: data.role,
          userType: data.userType
        };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Admin registration successful:', userData);
        showToast('success', `Account created successfully! Welcome ${data.name}!`);
        onLogin(userData);
        onClose();
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

  const fillDemoCredentials = (type) => {
    if (type === 'employee') {
      setEmployeeLogin({
        username: 'john_employee',
        password: 'password123'
      });
      showToast('info', 'Demo employee credentials filled!');
    } else {
      setAdminLogin({
        username: 'admin_manager',
        password: 'admin123'
      });
      showToast('info', 'Demo admin credentials filled!');
    }
  };

  // Quick demo login function for testing
  const quickDemoLogin = (type) => {
    if (type === 'employee') {
      // Simulate employee login for demo
      const demoEmployee = {
        username: 'john_employee',
        name: 'John Employee',
        role: 'EMPLOYEE',
        userType: 'employee'
      };
      localStorage.setItem('token', 'demo-token-employee');
      localStorage.setItem('currentUser', JSON.stringify(demoEmployee));
      onLogin(demoEmployee);
      onClose();
      showToast('success', 'Demo employee login successful!');
    } else {
      // Simulate admin login for demo
      const demoAdmin = {
        username: 'admin_manager',
        name: 'Admin Manager',
        role: 'ADMIN',
        userType: 'admin'
      };
      localStorage.setItem('token', 'demo-token-admin');
      localStorage.setItem('currentUser', JSON.stringify(demoAdmin));
      onLogin(demoAdmin);
      onClose();
      showToast('success', 'Demo admin login successful!');
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
          onClick={() => setActiveForm('employee-login')}
        >
          Employee
        </button>
        <button 
          className={`tab-btn ${activeForm.startsWith('admin') ? 'active' : ''}`}
          onClick={() => setActiveForm('admin-login')}
        >
          Admin/Manager
        </button>
      </div>

      <div className="auth-forms">
        {/* Employee Login */}
        {activeForm === 'employee-login' && (
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
              />
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

            <div className="demo-section">
              <button 
                type="button" 
                className="demo-btn fill"
                onClick={() => fillDemoCredentials('employee')}
              >
                Fill Demo Credentials
              </button>
              <div className="demo-info">
                <p><strong>Demo:</strong> john_employee / password123</p>
              </div>
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
        {activeForm === 'admin-login' && (
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
              />
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

            <div className="demo-section">
              <button 
                type="button" 
                className="demo-btn fill"
                onClick={() => fillDemoCredentials('admin')}
              >
                Fill Demo Credentials
              </button>
              <div className="demo-info">
                <p><strong>Demo:</strong> admin_manager / admin123</p>
              </div>
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
                  <option value="ADMIN">Admin</option>
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