// src/components/ui/Toast.jsx (if it doesn't exist or is broken)
import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if ToastProvider is not available
    return {
      showToast: (type, message) => {
        console.log(`Toast (${type}): ${message}`);
        // You can use browser notifications or alerts as fallback
        if (type === 'error') {
          alert(`Error: ${message}`);
        } else {
          alert(message);
        }
      }
    };
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (type, message, duration = 3000) => {
    const id = Date.now();
    const newToast = { id, type, message };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;