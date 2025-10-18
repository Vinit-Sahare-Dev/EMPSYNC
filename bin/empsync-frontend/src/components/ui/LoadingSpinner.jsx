// src/components/ui/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // Optional CSS file

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;