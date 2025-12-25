// src/components/auth/LandingPageModern.jsx
import React, { useState } from 'react';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const LandingPageModern = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EMPLOYEE'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!isLogin && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login/registration
      const userData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        name: formData.username
      };
      
      // Store mock token
      localStorage.setItem('token', 'mock-jwt-token-' + Date.now());
      
      onLogin(userData);
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: UserGroupIcon,
      title: 'Employee Management',
      description: 'Comprehensive employee lifecycle management with advanced features.',
      color: 'primary'
    },
    {
      icon: BuildingOfficeIcon,
      title: 'Department Organization',
      description: 'Organize teams and departments efficiently.',
      color: 'success'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Real-time insights and comprehensive reporting.',
      color: 'warning'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime.',
      color: 'danger'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Hero Section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-lg mx-auto">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold">E</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">EmpSync</h1>
                  <p className="text-primary-200">Employee Management System</p>
                </div>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Modern Employee
                <span className="text-primary-200"> Management</span>
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Streamline your workforce with our comprehensive, modern, and intuitive employee management platform.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 border border-white border-opacity-20 hover-lift">
                  <feature.icon className="h-8 w-8 text-primary-200 mb-3" />
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-primary-200 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Auth Form Card */}
            <div className="bg-white rounded-2xl shadow-large p-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Sign in to access your dashboard' 
                    : 'Sign up to get started with EmpSync'
                  }
                </p>
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                  <p className="text-danger-800 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`input ${errors.username ? 'input-error' : ''}`}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-danger-600">{errors.username}</p>
                  )}
                </div>

                {/* Email Field (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
                    )}
                  </div>
                )}

                {/* Role Selection (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-danger-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full btn-lg flex items-center justify-center"
                >
                  {loading ? (
                    <div className="loading-spinner loading-spinner--small loading-spinner--white mr-2"></div>
                  ) : (
                    <ArrowRightIcon className="h-5 w-5" />
                  )}
                  {loading 
                    ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                    : (isLogin ? 'Sign In' : 'Create Account')
                  }
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData({
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        role: 'EMPLOYEE'
                      });
                    }}
                    className="ml-1 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Employee:</strong> employee / emp123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageModern;
