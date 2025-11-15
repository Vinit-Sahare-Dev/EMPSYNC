// src/components/layout/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = ({ onMenuToggle, user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <span className="menu-icon">☰</span>
          <span className="menu-text">Menu</span>
        </button>

        <div className="navbar-brand">
          <div className="brand-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              width="32"
              height="32"
              role="img"
              aria-labelledby="titleDesc"
              className="logo-svg"
            >
              <title id="titleDesc">EMPSYNC Bold Logo Symbol</title>
              <defs>
                <linearGradient id="empsyncGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9"/>
                  <stop offset="100%" stopColor="#2563eb"/>
                </linearGradient>
              </defs>

              {/* Rounded square background */}
              <rect x="8" y="8" width="184" height="184" rx="40" fill="#ffffff"/>

              {/* Sync circle (thicker & bolder arcs) */}
              <path
                className="ring"
                d="M100 32 A68 68 0 0 1 168 100"
                fill="none"
                stroke="url(#empsyncGradient)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                className="ring"
                d="M100 168 A68 68 0 0 1 32 100"
                fill="none"
                stroke="url(#empsyncGradient)"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Central Bold "E" */}
              <g transform="translate(60,58)">
                <rect
                  className="bar"
                  x="0"
                  y="0"
                  width="72"
                  height="16"
                  fill="url(#empsyncGradient)"
                  rx="6"
                />
                <rect
                  className="bar"
                  x="0"
                  y="32"
                  width="54"
                  height="16"
                  fill="url(#empsyncGradient)"
                  rx="6"
                />
                <rect
                  className="bar"
                  x="0"
                  y="64"
                  width="72"
                  height="16"
                  fill="url(#empsyncGradient)"
                  rx="6"
                />
              </g>
            </svg>
          </div>
          <div className="brand-text">
            <h1>
              <span className="brand-highlight">Emp</span>Sync
            </h1>
            <span className="brand-tagline">Employee Management System</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="navbar-actions">
            <button
              className="btn btn-profile"
              onClick={() => window.location.href = '/profile'}
            >
              <span className="btn-icon profile-icon">👤</span>
              <span className="btn-text">Profile</span>
            </button>
            <button
              className="btn btn-logout"
              onClick={onLogout}
            >
              <span className="btn-icon logout-icon">🚪</span>
              <span className="btn-text">Logout</span>
            </button>
          </div>
        ) : (
          <div className="navbar-actions">
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/login'}
            >
              <span className="btn-icon">🔐</span>
              <span className="btn-text">Login</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;