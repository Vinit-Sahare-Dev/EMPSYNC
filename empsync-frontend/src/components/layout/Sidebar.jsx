// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.role === 'ADMIN';
  const isEmployee = currentUser.role === 'EMPLOYEE';

  // Admin menu items
  const adminMenuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: '📊'
    },
    { 
      path: '/employees', 
      label: 'Employees', 
      icon: '👥'
    },
    { 
      path: '/departments', 
      label: 'Departments', 
      icon: '🏢'
    },
    { 
      path: '/analytics', 
      label: 'Analytics', 
      icon: '📈'
    },
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: '⚙️'
    },
  ];

  // Employee menu items
  const employeeMenuItems = [
    { 
      path: '/employee-dashboard', 
      label: 'My Dashboard', 
      icon: '📊'
    },
    { 
      path: '/departments', 
      label: 'Departments', 
      icon: '🏢'
    },
    { 
      path: '/profile', 
      label: 'My Profile', 
      icon: '👤'
    },
  ];

  // Use appropriate menu based on user role
  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-user-info">
            <div className="user-avatar">
              {isAdmin ? '👑' : '👤'}
            </div>
            <div className="user-details">
              <div className="user-name">
                {currentUser.name || currentUser.username || 'User'}
              </div>
              <div className="user-role">
                {isAdmin ? 'Administrator' : 'Employee'}
              </div>
            </div>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-menu">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={onClose}
            >
              <div className="link-content">
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;