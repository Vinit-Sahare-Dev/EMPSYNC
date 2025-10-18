// src/components/employees/EmployeeTable.jsx
import React from 'react';

const EmployeeTable = ({ employees, onView, onEdit, onDelete, selectedEmployees, onSelectionChange }) => {
  const toggleSelection = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      onSelectionChange(selectedEmployees.filter(id => id !== employeeId));
    } else {
      onSelectionChange([...selectedEmployees, employeeId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(employees.map(emp => emp.id));
    }
  };

  return (
    <div className="employee-table">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={employees.length > 0 && selectedEmployees.length === employees.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id} className={selectedEmployees.includes(employee.id) ? 'selected' : ''}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.id)}
                  onChange={() => toggleSelection(employee.id)}
                />
              </td>
              <td>
                <div className="employee-name">
                  <div className="avatar-sm">{employee.name.charAt(0).toUpperCase()}</div>
                  {employee.name}
                </div>
              </td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.position}</td>
              <td>
                <span className={`status-badge ${employee.status.toLowerCase().replace(' ', '-')}`}>
                  {employee.status}
                </span>
              </td>
              <td>
                <div className="action-buttons">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;