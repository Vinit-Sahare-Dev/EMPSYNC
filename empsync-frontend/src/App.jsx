import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import NavbarModern from './components/layout/NavbarModern';
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/auth/LandingPage';
import AuthForms from './components/auth/AuthForms';
import EmployeeGrid from './components/employees/EmployeeGrid';
import DepartmentGrid from './components/departments/DepartmentGrid';
import Analytics from './components/dashboard/Analytics';
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';
import AttendanceTracker from './components/attendance/AttendanceTracker';
import AttendanceHistory from './components/attendance/AttendanceHistory';
import PerformanceDashboard from './components/performance/PerformanceDashboard';

import './styles/App.css';
import { ToastProvider } from './contexts/ToastContext';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('currentUser');
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// App Content with Navbar conditional logic
const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);
    const [user, setUser] = useState(null);

    // Initialize user from local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('currentUser');
            }
        }
    }, [location.pathname]); // Re-check on route change (e.g. after login redirect)

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="app-container">
            {/* Show Navbar only on non-auth pages */}
            {!isAuthPage && <NavbarModern user={user} onLogout={handleLogout} />}

            <div className={!isAuthPage ? "main-content" : "auth-content"}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<AuthForms defaultForm="admin-login" />} />
                    <Route path="/register" element={<AuthForms defaultForm="admin-register" />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/employees" element={
                        <ProtectedRoute>
                            <EmployeeGrid />
                        </ProtectedRoute>
                    } />
                    <Route path="/departments" element={
                        <ProtectedRoute>
                            <DepartmentGrid />
                        </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    } />
                    <Route path="/attendance" element={
                        <ProtectedRoute>
                            <AttendanceTracker />
                        </ProtectedRoute>
                    } />
                    <Route path="/attendance-history" element={
                        <ProtectedRoute>
                            <AttendanceHistory />
                        </ProtectedRoute>
                    } />
                    <Route path="/performance" element={
                        <ProtectedRoute>
                            <PerformanceDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <ToastProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContent />
            </Router>
        </ToastProvider>
    );
};

export default App;
