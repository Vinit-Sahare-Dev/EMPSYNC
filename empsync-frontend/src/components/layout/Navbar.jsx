import React from 'react';

const Navbar = ({ onMenuToggle }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <button className="menu-toggle" onClick={onMenuToggle}>
          ☰
        </button>
        <div>
          <div className="brand-logo">EmpSync</div>
          <div className="brand-tagline">Workforce Synchronization</div>
        </div>
      </div>
      
      <div className="navbar-actions">
        <div style={{color: 'var(--text-light)', fontSize: '0.875rem'}}>
          Real-time Employee Management
        </div>
      </div>
    </nav>
  );
};

export default Navbar;