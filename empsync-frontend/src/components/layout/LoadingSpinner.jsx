// src/components/layout/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'loading-spinner--small',
    medium: 'loading-spinner--medium',
    large: 'loading-spinner--large'
  };

  const colorClasses = {
    primary: 'loading-spinner--primary',
    secondary: 'loading-spinner--secondary',
    white: 'loading-spinner--white'
  };

  const spinnerClass = `loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`;

  if (fullScreen) {
    return (
      <div className="loading-spinner-fullscreen">
        <div className={spinnerClass}>
          <div className="loading-spinner__circle"></div>
          {text && <div className="loading-spinner__text">{text}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={spinnerClass}>
      <div className="loading-spinner__circle"></div>
      {text && <div className="loading-spinner__text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;