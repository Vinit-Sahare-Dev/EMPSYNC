import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <div>{message}</div>
    </div>
  );
};

export default LoadingSpinner;