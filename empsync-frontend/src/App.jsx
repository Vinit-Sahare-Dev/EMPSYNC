// src/App.jsx
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastProvider from './components/ui/Toast';
import NavbarModern from './components/layout/NavbarModern';
import LoadingSpinner from './components/layout/LoadingSpinner';
import './styles/App.css';
import './styles/SPATransitions.css';

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>Something went wrong</h2>
            <p>We encountered an unexpected error. Please try refreshing the page.</p>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Reload Page
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })} 
                className="btn btn-outline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load components with better error handling
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.error('Lazy loading failed:', error);
      // Retry once
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await componentImport();
    }
  });

const Dashboard = lazyWithRetry(() => import('./components/dashboard/Dashboard'));
const EmployeeGrid = lazyWithRetry(() => import('./components/employees/EmployeeGrid'));
const Analytics = lazyWithRetry(() => import('./components/dashboard/Analytics'));
const Settings = lazyWithRetry(() => import('./components/settings/Settings'));
const LandingPage = lazyWithRetry(() => import('./components/auth/LandingPage'));
const DepartmentGrid = lazyWithRetry(() => import('./components/departments/DepartmentGrid'));
const Profile = lazyWithRetry(() => import('./components/profile/Profile'));

// Employee Dashboard (Limited Access)
const EmployeeDashboard = () => (
  <div className="employee-dashboard">
    <div className="dashboard-header">
      <h1>Employee Dashboard</h1>
      <p>Welcome to your employee portal</p>
    </div>
    <div className="employee-welcome">
      <div className="welcome-card">
        <h3>👋 Welcome, Employee!</h3>
        <p>This is your personalized dashboard with limited access.</p>
        <div className="employee-features">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>View Basic Analytics</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👥</span>
            <span>View Employee Directory</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👤</span>
            <span>Access Your Profile</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner size="medium" text="Checking access..." />;
  }

  if (!user?.username) {
    console.log('❌ No user, redirecting to landing page');
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('❌ Role not allowed:', user.role, 'Allowed:', allowedRoles);
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <p className="role-info">
            Your role: <strong>{user.role}</strong>
          </p>
          <div className="access-actions">
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-primary"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              className="btn btn-outline"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Access granted for:', user.username);
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔍 App.jsx - Starting app, checking for existing session...');

      // Check for existing user session in localStorage
      const savedUser = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('token');
      
      if (savedUser && savedToken) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('✅ App.jsx - Found existing user session:', userData.username);
          setUser(userData);
        } catch (error) {
          console.error('❌ App.jsx - Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
        }
      } else {
        console.log('ℹ️ App.jsx - No existing session found');
      }

      // Small delay for smoother loading experience
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    initializeApp();
  }, []);


  const handleLogin = (userData) => {
    console.log('✅ App.jsx - handleLogin called with:', userData.username);
    setUser(userData);
    // Store user data and token in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(userData));
    // The token should already be stored by the AuthForms component
  };

  const handleLogout = () => {
    console.log('🚪 App.jsx - Logging out user:', user?.username);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <div className="empsync-app loading">
            <LoadingSpinner size="large" text="Loading EmpSync..." />
          </div>
        </ToastProvider>
      </ThemeProvider>
    );
  }

  console.log('🎯 App.jsx - Current user state:', user ? user.username : 'No user');

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="empsync-app">
            {/* Always start with landing page, then conditionally show app after login */}
            {!user ? (
              // Show landing page when no user is logged in
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner size="large" text="Loading application..." />}>
                  <Routes>
                    <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
                    <Route path="/login" element={<LandingPage onLogin={handleLogin} />} />
                    <Route path="/signup" element={<LandingPage onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            ) : (
              // Show main app when user is logged in
              <>
                <NavbarModern 
                  user={user}
                  onLogout={handleLogout}
                />
                  <main className="empsync-main">
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSpinner size="large" text="Loading page..." />}>
                        <Routes>
                          {/* Public routes - redirect to dashboard */}
                          <Route 
                            path="/" 
                            element={
                              <Navigate to="/dashboard" replace />
                            } 
                          />
                          <Route 
                            path="/login" 
                            element={
                              <Navigate to="/dashboard" replace />
                            } 
                          />
                          
                          {/* Admin-only routes */}
                          <Route 
                            path="/dashboard" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <Dashboard />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/employees" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <EmployeeGrid />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/employees-table" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <EmployeeGrid view="table" />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/employees-grid" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <EmployeeGrid view="grid" />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/departments" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <DepartmentGrid />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/analytics" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <Analytics />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/settings" 
                            element={
                              <ProtectedRoute allowedRoles={['ADMIN']}>
                                <Settings />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Shared routes (admin can access) */}
                          <Route 
                            path="/profile" 
                            element={
                              <ProtectedRoute>
                                <Profile user={user} />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Redirect all unknown routes to dashboard */}
                          <Route 
                            path="*" 
                            element={
                              <Navigate to="/dashboard" replace />
                            } 
                          />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </main>
              </>
            )}
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;