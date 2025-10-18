// src/components/employees/EmployeeCard.jsx
import React from 'react';

const EmployeeCard = ({ employees, onView, onEdit, onDelete, selectedEmployees, onSelectionChange }) => {
  const toggleSelection = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      onSelectionChange(selectedEmployees.filter(id => id !== employeeId));
    } else {
      onSelectionChange([...selectedEmployees, employeeId]);
    }
  };

  return (
    <div className="employee-cards">
      {employees.map(employee => (
        <div key={employee.id} className={`employee-card ${selectedEmployees.includes(employee.id) ? 'selected' : ''}`}>
          <div className="employee-card-header">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedEmployees.includes(employee.id)}
                onChange={() => toggleSelection(employee.id)}
              />
            </div>
            <div className="employee-avatar">
              {employee.name.charAt(0).toUpperCase()}
            </div>
			<div className="employee-actions">
			  <button className="btn-icon" onClick={() => onView(employee)} title="View">
			    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
			      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
			    </svg>
			  </button>
			  <button className="btn-icon" onClick={() => onEdit(employee)} title="Edit">
			    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
			      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
			    </svg>
			  </button>
			  <button className="btn-icon" onClick={() => onDelete(employee.id)} title="Delete">
			    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
			      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
			    </svg>
			  </button>
			</div>
          </div>
          
          <div className="employee-info">
            <h3>{employee.name}</h3>
            <p className="employee-email">{employee.email}</p>
            <p className="employee-position">{employee.position}</p>
            <p className="employee-department">{employee.department}</p>
            
            <div className="employee-details">
              {employee.phone && <span>📞 {employee.phone}</span>}
              {employee.salary && <span>💰 ${employee.salary}</span>}
              {employee.gender && <span>👤 {employee.gender}</span>}
            </div>
            
            <div className="employee-footer">
              <span className={`status-badge ${employee.status.toLowerCase().replace(' ', '-')}`}>
                {employee.status}
              </span>
              {employee.joinDate && (
                <span className="join-date">
                  Joined: {new Date(employee.joinDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeCard;