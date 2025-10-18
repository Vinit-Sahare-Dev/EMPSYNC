// src/App.jsx
import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="empsync-app">
            <Navbar onMenuToggle={toggleSidebar} />
            <div className="empsync-container">
              <Sidebar 
                isOpen={sidebarOpen} 
                onClose={closeSidebar} 
              />
              <main className={`empsync-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <ErrorBoundary>
                  <Suspense fallback={<LoadingSpinner size="large" text="Loading page..." />}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/employees" element={<EmployeeGrid />} />
                      <Route path="/employees-table" element={<EmployeeGrid view="table" />} />
                      <Route path="/employees-grid" element={<EmployeeGrid view="grid" />} />
                      <Route 
                        path="/departments" 
                        element={<ComingSoon feature="Department Management" />} 
                      />
                      <Route 
                        path="/analytics" 
                        element={<Analytics />} 
                      />
                      <Route 
                        path="/settings" 
                        element={<Settings />} 
                      />
                      <Route 
                        path="*" 
                        element={
                          <div className="not-found">
                            <h2>Page Not Found - 404</h2>
                            <p>The page you're looking for doesn't exist.</p>
                          </div>
                        } 
                      />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </main>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;