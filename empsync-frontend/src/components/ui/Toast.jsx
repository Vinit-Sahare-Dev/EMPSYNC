// src/components/ui/Toast.jsx - DISABLED
// All notification popups have been removed to eliminate unwanted notifications
// This file is kept for reference but no longer used in the application

import React from 'react';

export const useToast = () => {
  return {
    showToast: (type, message) => {
      // No-op - all notifications disabled
    }
  };
};

export const ToastProvider = ({ children }) => {
  return children;
};

export default ToastProvider;