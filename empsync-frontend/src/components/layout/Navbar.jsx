// src/components/layout/Navbar.jsx
import React from 'react';

const Navbar = ({ onMenuToggle }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button onClick={onMenuToggle} className="btn btn-outline">
          ☰
        </button>
        <h1>Employee Management</h1>
      </div>
      <div className="navbar-actions">
        <button className="btn btn-outline">Profile</button>
      </div>
    </nav>
  );
};

export default Navbar;