import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  UserPlusIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import './AuthForms.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api';

const AuthForms = ({ onLogin, defaultForm = 'admin-login' }) => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // Register State
  const [registerData, setRegisterData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'EMPLOYEE',
    department: '' 
  });

  // Forgot Password State
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Toast helper
  const showToast = (type, message) => {
    if (typeof Toast === 'function') {
      Toast[type](message);
    } else {
      console.log(type, message);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Login successful!');
        localStorage.setItem('currentUser', JSON.stringify(data.user || data));
        if (data.token) localStorage.setItem('token', data.token);
        
        if (onLogin) {
          onLogin(data);
        } else {
          navigate('/dashboard');
        }
      } else {
        showToast('error', data.message || 'Login failed');
      }
    } catch (error) {
      showToast('error', 'Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.fullName,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role,
          department: registerData.department
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Registration successful! Please log in.');
        setActiveForm('admin-login');
      } else {
        showToast('error', data.message || 'Registration failed');
      }
    } catch (error) {
      showToast('error', 'Registration failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Password reset instructions sent!');
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      } else {
        showToast('error', data.message || 'Failed to send instructions');
      }
    } catch (error) {
      showToast('error', 'Failed to send instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="integrated-auth-container">
      {/* Animated Background Shapes */}
      <div className="auth-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="auth-forms-container">
        {!showForgotPassword ? (
          <>
            <div className="auth-header">
              <div className="auth-icon">
                {activeForm === 'admin-login' ? <UserIcon className="h-6 w-6 text-white" /> : <UserPlusIcon className="h-6 w-6 text-white" />}
              </div>
              <h2>{activeForm === 'admin-login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{activeForm === 'admin-login' ? 'Sign in to your EMPSYNC account' : 'Join EMPSYNC today'}</p>
            </div>

            <div className="auth-tabs">
              <button 
                className={`tab-btn ${activeForm === 'admin-login' ? 'active' : ''}`}
                onClick={() => setActiveForm('admin-login')}
              >
                Sign In
              </button>
              <button 
                className={`tab-btn ${activeForm === 'admin-register' ? 'active' : ''}`}
                onClick={() => setActiveForm('admin-register')}
              >
                Sign Up
              </button>
            </div>
            
            <div className="auth-forms">
              {activeForm === 'admin-login' ? (
                <form className="auth-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        required
                        className="login-input"
                        placeholder="name@company.com"
                        value={loginData.email}
                        onChange={handleLoginChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type="password"
                        required
                        className="login-input"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10 border-white/20"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <button type="button" onClick={() => setShowForgotPassword(true)} className="font-medium text-blue-400 hover:text-blue-300">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      name="fullName"
                      type="text"
                      required
                      className="login-input"
                      placeholder="John Doe"
                      value={registerData.fullName}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="login-input"
                      placeholder="name@company.com"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group mb-0">
                      <label>Password</label>
                      <input
                        name="password"
                        type="password"
                        required
                        className="login-input"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label>Confirm</label>
                      <input
                        name="confirmPassword"
                        type="password"
                        required
                        className="login-input"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      className="login-input"
                      value={registerData.role}
                      onChange={handleRegisterChange}
                    >
                      <option value="EMPLOYEE" className="text-gray-900">Employee</option>
                      <option value="ADMIN" className="text-gray-900">Admin</option>
                      <option value="HR" className="text-gray-900">HR</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="auth-btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg transform transition-all duration-200 hover:scale-[1.02] mt-4"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="auth-form">
            <div className="auth-header">
              <div className="auth-icon">
                <LockClosedIcon className="h-6 w-6 text-white" />
              </div>
              <h2>Reset Password</h2>
              <p>Enter your email to receive instructions</p>
            </div>
            
            <form onSubmit={handleForgotPassword} className="mt-6">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  className="login-input"
                  placeholder="name@company.com"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="auth-btn bg-white/10 hover:bg-white/20 text-white border border-white/10"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg"
                >
                  {loading ? 'Sending...' : 'Send Link'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForms;
