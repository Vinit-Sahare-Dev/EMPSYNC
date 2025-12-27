// src/components/layout/ProfessionalNavbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Using simple SVG icons instead of Heroicons to avoid dependency issues
import './ProfessionalNavbar.css';

const ProfessionalNavbar = ({ user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Simple SVG icon components
const HomeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const UserGroupIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const BuildingOfficeIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const ChartBarIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const CogIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ArrowRightOnRectangleIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const BellIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: location.pathname === '/dashboard' },
    { name: 'Employees', href: '/employees', icon: UserGroupIcon, current: location.pathname.includes('/employees') },
    { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon, current: location.pathname === '/departments' },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, current: location.pathname === '/analytics' },
    { name: 'Settings', href: '/settings', icon: CogIcon, current: location.pathname === '/settings' },
  ];

  const notifications = [
    { id: 1, title: 'New employee onboarded', description: 'John Doe joined IT department', time: '2 hours ago', read: false },
    { id: 2, title: 'Performance review due', description: 'Sarah Wilson\'s review is pending', time: '5 hours ago', read: false },
    { id: 3, title: 'System update completed', description: 'Employee database updated successfully', time: '1 day ago', read: true },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleNavigation = (href) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
      if (notificationsOpen && !event.target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [profileDropdownOpen, notificationsOpen]);

  return (
    <nav className="professional-navbar">
      {/* Top Bar */}
      <div className="navbar-top">
        <div className="navbar-container">
          {/* Logo and Brand */}
          <div className="navbar-brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 40 40" className="w-8 h-8">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                  </defs>
                  <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
                  <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">E</text>
                </svg>
              </div>
              <div className="brand-text">
                <h1 className="brand-name">
                  <span className="brand-highlight">Emp</span>Sync
                </h1>
                <p className="brand-tagline">Employee Management System</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="navbar-search">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <SearchIcon className="search-icon" />
                <input
                  type="text"
                  placeholder="Search employees, departments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Notifications */}
            <div className="notifications-dropdown">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="action-button notifications-button"
              >
                <BellIcon className="action-icon" />
                <span className="notification-badge">2</span>
              </button>

              {notificationsOpen && (
                <div className="notifications-panel">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read">Mark all as read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`}>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.description}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="profile-dropdown">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="profile-button"
              >
                <div className="profile-avatar">
                  <UserIcon className="avatar-icon" />
                </div>
                <div className="profile-info">
                  <span className="profile-name">{user?.name || user?.username}</span>
                  <span className="profile-role">{user?.role}</span>
                </div>
                <svg className="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="profile-panel">
                  <div className="profile-header">
                    <div className="profile-avatar-large">
                      <UserIcon className="avatar-icon-large" />
                    </div>
                    <div className="profile-details">
                      <h3>{user?.name || user?.username}</h3>
                      <p>{user?.email || 'No email'}</p>
                      <span className="role-badge">{user?.role}</span>
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="profile-action-item"
                    >
                      <UserIcon className="action-icon" />
                      <span>View Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setProfileDropdownOpen(false);
                      }}
                      className="profile-action-item"
                    >
                      <CogIcon className="action-icon" />
                      <span>Settings</span>
                    </button>
                    
                    <div className="profile-divider"></div>
                    
                    <button
                      onClick={onLogout}
                      className="profile-action-item logout"
                    >
                      <ArrowRightOnRectangleIcon className="action-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="navbar-container">
          <div className="nav-menu">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`nav-item ${item.current ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span className="nav-text">{item.name}</span>
                {item.current && <div className="nav-indicator"></div>}
              </button>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="nav-stats">
            <div className="stat-item">
              <span className="stat-value">247</span>
              <span className="stat-label">Employees</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">Departments</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">95%</span>
              <span className="stat-label">Productivity</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;
