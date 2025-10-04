import React from 'react';

const StatsCard = ({ title, value, icon, theme = 'primary' }) => {
  const themeClasses = {
    primary: 'primary',
    secondary: 'secondary', 
    warning: 'warning',
    info: 'info'
  };

  return (
    <div className={`stats-card ${themeClasses[theme]}`}>
      <div className="stats-header">
        <div className="stats-title">{title}</div>
        <div className="stats-icon">{icon}</div>
      </div>
      <div className="stats-value">{value}</div>
      <div className="stats-trend">
        <span>Active</span>
      </div>
    </div>
  );
};

export default StatsCard;