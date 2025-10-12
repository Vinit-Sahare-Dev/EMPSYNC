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
                👁️
              </button>
              <button className="btn-icon" onClick={() => onEdit(employee)} title="Edit">
                ✏️
              </button>
              <button className="btn-icon" onClick={() => onDelete(employee.id)} title="Delete">
                🗑️
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