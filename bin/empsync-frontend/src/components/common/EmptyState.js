import React from 'react';

const EmptyState = ({ message = 'No employees found', subtitle = '' }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <h3>{message}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default EmptyState;