// src/components/dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, theme = 'primary', trend, trendValue }) => {
  return (
    <div className={`stats-card ${theme}`}>
      <div className="stats-header">
        <div className="stats-title">{title}</div>
        <div className="stats-icon">{icon}</div>
      </div>
      <div className="stats-value">{value}</div>
      <div className="stats-trend">
        {trend && (
          <span className={`trend ${trend}`}>
            {trend === 'up' ? '↗' : '↘'} {trendValue}
          </span>
        )}
        <span>Active</span>
      </div>
    </div>
  );
};

export default StatsCard;