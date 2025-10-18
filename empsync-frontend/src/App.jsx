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
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Please check the console for errors</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load components
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const EmployeeGrid = lazy(() => import('./components/employees/EmployeeGrid'));
const Analytics = lazy(() => import('./components/dashboard/Analytics'));
const Settings = lazy(() => import('./components/settings/Settings'));
const LandingPage = lazy(() => import('./components/auth/LandingPage')); // Changed from Login to LandingPage

// Coming Soon Component for Departments (since it's not implemented yet)
const ComingSoon = ({ feature }) => (
  <div className="coming-soon">
    <div className="coming-soon-content">
      <h2>{feature} Coming Soon</h2>
      <div className="rocket">🚀</div>
      <p>We're working hard to bring you this feature!</p>
    </div>
  </div>
);

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
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  console.log('🔒 ProtectedRoute - User:', user.username, 'Role:', user.role, 'Allowed:', allowedRoles);
  
  if (!user.username) {
    console.log('❌ No user, redirecting to login');
    return <Navigate to="/" replace />; // Changed to redirect to "/" instead of "/login"
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('❌ Role not allowed');
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  console.log('✅ Access granted');
  return children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    console.log('🔍 App.jsx - Checking saved user:', savedUser);
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        console.log('✅ App.jsx - User loaded from localStorage:', userData);
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogin = (userData) => {
    console.log('✅ App.jsx - handleLogin called with:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('🚪 App.jsx - Logging out');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <div className="empsync-app">
            <LoadingSpinner size="large" text="Checking authentication..." />
          </div>
        </ToastProvider>
      </ThemeProvider>
    );
  }

  console.log('🎯 App.jsx - Current user state:', user);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="empsync-app">
            {/* Always render the same Router structure */}
            {!user ? (
              // Show landing page when no user
              <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner size="large" text="Loading..." />}>
                  <Routes>
                    {/* Landing page routes - both root and /login show the same component */}
                    <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
                    <Route path="/login" element={<LandingPage onLogin={handleLogin} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            ) : (
              // Show main app when user is logged in
              <>
                <Navbar 
                  onMenuToggle={toggleSidebar} 
                  user={user}
                  onLogout={handleLogout}
                />
                <div className="empsync-container">
                  <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={closeSidebar}
                    userRole={user.role}
                  />
                  <main className={`empsync-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    <ErrorBoundary>
                      <Suspense fallback={<LoadingSpinner size="large" text="Loading page..." />}>
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                          
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
                          
                          {/* Shared routes */}
                          <Route 
                            path="/departments" 
                            element={
                              <ProtectedRoute>
                                <ComingSoon feature="Department Management" />
                              </ProtectedRoute>
                            } 
                          />
                          
                          {/* Redirect based on role */}
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