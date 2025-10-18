// src/components/dashboard/QuickActions.jsx
import React from 'react';

const QuickActions = ({ onActionClick }) => {
  const actions = [
    {
      id: 'add_employee',
      title: 'Add Employee',
      description: 'Add new team member',
      icon: '👤',
      color: 'primary'
    },
    {
      id: 'export_data',
      title: 'Export Data',
      description: 'Export employee data',
      icon: '📤',
      color: 'success'
    },
    {
      id: 'generate_report',
      title: 'Generate Report',
      description: 'Create workforce report',
      icon: '📊',
      color: 'info'
    },
    {
      id: 'team_overview',
      title: 'Team Overview',
      description: 'View team structure',
      icon: '👨‍💼',
      color: 'warning'
    }
  ];

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>
      <div className="actions-grid">
        {actions.map(action => (
          <div
            key={action.id}
            className={`action-card ${action.color}`}
            onClick={() => onActionClick(action.id)}
          >
            <div className="action-icon">{action.icon}</div>
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;