import React, { useState } from 'react';
import { empSyncAPI } from '../../services/apiService';

const QuickActions = ({ onDataChange }) => {
  const [loading, setLoading] = useState('');

  const handleQuickAction = async (action) => {
    setLoading(action);
    try {
      switch (action) {
        case 'refresh':
          await onDataChange();
          break;
        case 'clearAll':
          if (window.confirm('Are you sure you want to delete ALL employees? This cannot be undone.')) {
            await empSyncAPI.clearAllSync();
            await onDataChange();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('🔴 Quick action failed:', error);
      alert(`Failed to ${action}. Please try again.`);
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="quick-actions fade-in">
      <h3>Quick Actions</h3>
      <div className="actions-grid">
        <button 
          className="action-btn"
          onClick={() => handleQuickAction('refresh')}
          disabled={loading === 'refresh'}
        >
          <div className="action-icon">🔄</div>
          <div className="action-text">
            {loading === 'refresh' ? 'Refreshing...' : 'Refresh Data'}
          </div>
        </button>

        <button 
          className="action-btn"
          onClick={() => window.open('/employees', '_self')}
        >
          <div className="action-icon">👥</div>
          <div className="action-text">View All Employees</div>
        </button>

        <button 
          className="action-btn"
          onClick={() => handleQuickAction('clearAll')}
          disabled={loading === 'clearAll'}
          style={{borderColor: '#fecaca'}}
        >
          <div className="action-icon">🗑️</div>
          <div className="action-text">
            {loading === 'clearAll' ? 'Clearing...' : 'Clear All Data'}
          </div>
        </button>

        <button 
          className="action-btn"
          onClick={() => window.open('/analytics', '_self')}
        >
          <div className="action-icon">📊</div>
          <div className="action-text">View Analytics</div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;