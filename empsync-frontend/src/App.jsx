// src/App.jsx
import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastProvider from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/layout/LoadingSpinner';
import './styles/App.css';

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
              onClick={() => window.location.href = user.role === 'EMPLOYEE' ? '/employee-dashboard' : '/dashboard'} 
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginRedirect, setLoginRedirect] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔍 App.jsx - Starting app, checking for existing session...');
      
      const savedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');
      
      // Auto-login if user data and token exist
      if (savedUser && token) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          console.log('✅ App.jsx - User auto-login:', userData.username);
        } catch (error) {
          console.error('❌ Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
        }
      } else {
        console.log('🎯 App.jsx - No saved session, showing landing page');
        // Clear any stale data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
      
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogin = (userData) => {
    console.log('✅ App.jsx - handleLogin called with:', userData.username);
    setUser(userData);
    // Store user data and token in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(userData));
    // The token should already be stored by the AuthForms component
    
    // Set redirect flag to trigger navigation
    setLoginRedirect(true);
  };

  const handleLogout = () => {
    console.log('🚪 App.jsx - Logging out user:', user?.username);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setUser(null);
    setLoginRedirect(false);
    // Close sidebar on logout
    setSidebarOpen(false);
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
                {/* Redirect to appropriate dashboard after login */}
                {loginRedirect && (
                  <Navigate to={user.role === 'EMPLOYEE' ? '/employee-dashboard' : '/dashboard'} replace />
                )}
                
                <Navbar 
                  onMenuToggle={toggleSidebar} 
                  user={user}
                  onLogout={handleLogout}
                  sidebarOpen={sidebarOpen}
                />
                <div className="empsync-container">
                  <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={closeSidebar}
                    userRole={user.role}
                    userName={user.name || user.username}
                  />
                  <main className={`empsync-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSpinner size="large" text="Loading page..." />}>
                        <Routes>
                          {/* Public routes - redirect to appropriate dashboard */}
                          <Route 
                            path="/" 
                            element={
                              user.role === 'EMPLOYEE' ? 
                                <Navigate to="/employee-dashboard" replace /> : 
                                <Navigate to="/dashboard" replace />
                            } 
                          />
                          <Route 
                            path="/login" 
                            element={
                              user.role === 'EMPLOYEE' ? 
                                <Navigate to="/employee-dashboard" replace /> : 
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
                          
                          {/* Employee routes */}
                          <Route 
                            path="/employee-dashboard" 
                            element={
                              <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                                <EmployeeDashboard />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Shared routes (both admin and employee can access) */}
                          <Route 
                            path="/profile" 
                            element={
                              <ProtectedRoute>
                                <Profile user={user} />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Redirect all unknown routes to appropriate dashboard */}
                          <Route 
                            path="*" 
                            element={
                              user.role === 'EMPLOYEE' ? 
                                <Navigate to="/employee-dashboard" replace /> : 
                                <Navigate to="/dashboard" replace />
                            } 
                          />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </main>
                </div>
              </>
            )}
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;