import React, { useState } from 'react';
import './NavbarModern.css';
import { NavLink } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const NavbarModern = ({ user, onLogout }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: user?.role === 'EMPLOYEE' ? '/employee-dashboard' : '/dashboard', icon: HomeIcon, roles: ['ADMIN', 'EMPLOYEE'] },
    { name: 'Employees', href: '/employees', icon: UserGroupIcon, roles: ['ADMIN'] },
    { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon, roles: ['ADMIN', 'EMPLOYEE'] },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, roles: ['ADMIN'] },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['ADMIN'] },
    { name: 'Profile', href: '/profile', icon: UserIcon, roles: ['ADMIN', 'EMPLOYEE'] },
  ];

  const filteredNavigation = navigation.filter(item => user && item.roles.includes(user.role));

  return (
    <nav className="navbar-modern">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            {user && (
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn">
                {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            )}

            <div className="navbar-logo" onClick={() => window.location.href = '/'}>
              <img src="/empSync-logo.svg" alt="Logo" className="logo-icon" />
              <h1 className="logo-title">EMPSYNC</h1>
            </div>

            {user && (
              <nav className="desktop-nav">
                {filteredNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <div className="nav-link-content">
                      <item.icon className="nav-icon" />
                      <span>{item.name}</span>
                    </div>
                  </NavLink>
                ))}
              </nav>
            )}
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                <div className="user-role-badge">
                  <span className="badge-primary">{user.role}</span>
                </div>

                <div className="profile-dropdown">
                  <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="profile-btn">
                    <div className="navbar-profile-avatar">
                      {user.avatar ? <img src={user.avatar} alt="P" className="avatar-img" /> : <UserIcon className="h-5 w-5 text-white" />}
                    </div>
                    <div className="profile-info">
                      <p className="profile-name">{user.name || user.username}</p>
                      <p className="profile-role">{user.role}</p>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <p className="dropdown-name">{user.name || user.username}</p>
                        <p className="dropdown-email">{user.email || 'No email'}</p>
                      </div>

                      <button onClick={() => { window.location.href = '/profile'; setProfileDropdownOpen(false); }} className="dropdown-item">
                        <UserIcon className="dropdown-icon" />
                        <span>Profile</span>
                      </button>

                      <button onClick={() => { onLogout(); setProfileDropdownOpen(false); }} className="dropdown-item dropdown-logout">
                        <ArrowRightOnRectangleIcon className="dropdown-icon" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                <button onClick={onLogout} className="mobile-logout-btn"><ArrowRightOnRectangleIcon className="h-5 w-5" /></button>
              </>
            ) : (
              <button onClick={() => window.location.href = '/login'} className="login-btn">Login</button>
            )}
          </div>
        </div>
      </div>

      {profileDropdownOpen && <div className="dropdown-overlay" onClick={() => setProfileDropdownOpen(false)} />}

      {mobileMenuOpen && user && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu">
            <nav className="mobile-nav">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`}
                >
                  <div className="mobile-nav-content">
                    <item.icon className="mobile-nav-icon" />
                    <span>{item.name}</span>
                  </div>
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavbarModern;
