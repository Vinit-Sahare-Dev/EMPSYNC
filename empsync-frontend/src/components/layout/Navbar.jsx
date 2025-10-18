// src/components/layout/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';

const Navbar = ({ onMenuToggle, user, onLogout }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout
      localStorage.removeItem('currentUser');
      window.location.reload();
    }
    showToast('success', 'Logged out successfully');
    navigate('/login');
  };

  const handleProfile = () => {
    showToast('info', 'Profile feature coming soon!');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button onClick={onMenuToggle} className="menu-toggle">
          ☰
        </button>
        <div className="navbar-brand">
          <h1>EMPSYNC</h1>
          {user && (
            <span className="user-role-badge">
              {user.role === 'ADMIN' ? 'Administrator' : 'Employee'}
            </span>
          )}
        </div>
      </div>
      
      <div className="navbar-right">
        {user ? (
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">Welcome, {user.name || user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <div className="navbar-actions">
              <button 
                onClick={handleProfile} 
                className="btn btn-outline profile-btn"
                title="Profile Settings"
              >
                👤 Profile
              </button>
              <button 
                onClick={handleLogout} 
                className="btn btn-danger logout-btn"
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-actions">
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;