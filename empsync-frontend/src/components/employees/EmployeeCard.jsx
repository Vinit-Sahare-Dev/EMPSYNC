import React from 'react';
import { formatCurrency, calculateNetSalary, getDepartmentColor } from '../../utils/helpers';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const netSalary = calculateNetSalary(employee);
  
  const departmentStyle = {
    background: getDepartmentColor(employee.department) + '20',
    color: getDepartmentColor(employee.department),
    border: `1px solid ${getDepartmentColor(employee.department)}30`
  };

  return (
    <div className="employee-card fade-in">
      <div className="employee-header">
        <div>
          <h3 className="employee-name">{employee.name}</h3>
          <div className="employee-id">ID: {employee.id}</div>
        </div>
        <span className="employee-department" style={departmentStyle}>
          {employee.department}
        </span>
      </div>

      <div className="employee-details">
        <div className="detail-item">
          <span className="detail-label">Gender</span>
          <span className="detail-value">{employee.gender}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Base Salary</span>
          <span className="detail-value salary-amount">
            {formatCurrency(employee.salary)}
          </span>
        </div>

        {employee.bonus > 0 && (
          <div className="detail-item">
            <span className="detail-label">Bonus</span>
            <span className="detail-value" style={{color: '#10b981'}}>
              +{formatCurrency(employee.bonus)}
            </span>
          </div>
        )}

        {employee.pf > 0 && (
          <div className="detail-item">
            <span className="detail-label">PF</span>
            <span className="detail-value" style={{color: '#ef4444'}}>
              -{formatCurrency(employee.pf)}
            </span>
          </div>
        )}

        {employee.tax > 0 && (
          <div className="detail-item">
            <span className="detail-label">Tax</span>
            <span className="detail-value" style={{color: '#ef4444'}}>
              -{formatCurrency(employee.tax)}
            </span>
          </div>
        )}

        <div className="detail-item" style={{borderBottom: 'none', paddingTop: '1rem'}}>
          <span className="detail-label" style={{fontWeight: '700', color: '#1e293b'}}>
            Net Salary
          </span>
          <span className="detail-value" style={{fontSize: '1.25rem', fontWeight: '700', color: '#6366f1'}}>
            {formatCurrency(netSalary)}
          </span>
        </div>
      </div>

      <div className="employee-actions">
        <button 
          className="btn btn-outline btn-sm" 
          onClick={() => onEdit(employee)}
          style={{flex: 1}}
        >
          Edit
        </button>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={onDelete}
          style={{flex: 1}}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;