// src/components/employees/EmployeeGrid.jsx
import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeCard from './EmployeeCard';
import './EmployeeModern.css';
import { empSyncAPI } from '../../services/apiService';
import { useToast } from '../ui/Toast';

// Safe toast fallback
const useToastFallback = () => {
  return {
    showToast: (type, message) => {
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.top = '20px';
      notification.style.right = '20px';
      notification.style.background = `${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'}`;
      notification.style.color = 'white';
      notification.style.padding = '12px 24px';
      notification.style.borderRadius = '12px';
      notification.style.zIndex = '10000';
      notification.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      notification.innerHTML = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };
};

const EmployeeGrid = ({ view = "grid" }) => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');

  const toast = useToast();

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      setBackendStatus('checking');
      const health = await empSyncAPI.healthCheck();

      if (health.connected) {
        setBackendStatus('connected');
        await loadEmployeesFromBackend();
      } else {
        throw new Error(health.message || 'Backend not available');
      }
    } catch (error) {
      setBackendStatus('disconnected');
      toast.showToast('error', `Connection failed: ${error.message}`);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeesFromBackend = async () => {
    try {
      setLoading(true);
      const response = await empSyncAPI.getAllEmployees();
      if (response.success) {
        setEmployees(response.employees || []);
        localStorage.removeItem('employees');
      } else {
        throw new Error(response.message || 'Failed to load employees');
      }
    } catch (error) {
      setEmployees([]);
      toast.showToast('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      const response = await empSyncAPI.createEmployee(employeeData);
      if (response.success) {
        await loadEmployeesFromBackend();
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.showToast('error', 'Failed to add employee');
    }
  };

  const handleEditEmployee = async (employeeData) => {
    try {
      const response = await empSyncAPI.updateEmployee(editingEmployee.id, employeeData);
      if (response.success) {
        toast.showToast('success', 'Employee updated successfully!');
        setIsModalOpen(false);
        setEditingEmployee(null);
        await loadEmployeesFromBackend();
      }
    } catch (error) {
      toast.showToast('error', 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Delete this employee?')) {
      try {
        const response = await empSyncAPI.deleteEmployee(employeeId);
        if (response.success) {
          toast.showToast('success', 'Deleted successfully!');
          await loadEmployeesFromBackend();
        }
      } catch (error) {
        toast.showToast('error', 'Failed to delete');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) return;
    if (window.confirm(`Delete ${selectedEmployees.length} employees?`)) {
      try {
        for (const id of selectedEmployees) {
          await empSyncAPI.deleteEmployee(id);
        }
        toast.showToast('success', 'Bulk delete successful');
        setSelectedEmployees([]);
        await loadEmployeesFromBackend();
      } catch (error) {
        toast.showToast('error', 'Bulk delete failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="employee-grid-container">
        <div className="loading-container">
          <div>🔄 Syncing with database...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-grid-container">
      <div className="employee-header">
        <div>
          <h1>Employee Navigator</h1>
          <p>Real-time workforce management</p>
          <div className={`backend-badge ${backendStatus}`}>
            {backendStatus === 'connected' ? '● Connected' : '● Disconnected'}
          </div>
        </div>
        <div className="employee-actions">
          <button className="btn btn-primary" onClick={() => { setEditingEmployee(null); setIsModalOpen(true); }} disabled={backendStatus !== 'connected'}>
            + Add Employee
          </button>
          <div className="search-bar">
            <input type="text" placeholder="Search employees..." className="search-input" />
          </div>
        </div>
      </div>

      {backendStatus !== 'connected' && (
        <div className="connection-error">
          ⚠️ Connection Required: Database sync is currently offline.
        </div>
      )}

      {selectedEmployees.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedEmployees.length} rows selected</span>
          <button className="btn btn-danger" onClick={handleBulkDelete}>Delete Selected</button>
        </div>
      )}

      <div className="employee-content">
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👥</div>
            <h3>No records found</h3>
            <p>Ready to add your first team member?</p>
          </div>
        ) : (
          <div className={`employee-view ${view}`}>
            <EmployeeCard
              employees={employees}
              onView={(e) => { setEditingEmployee(e); setIsModalOpen(true); }}
              onEdit={(e) => { setEditingEmployee(e); setIsModalOpen(true); }}
              onDelete={handleDeleteEmployee}
              selectedEmployees={selectedEmployees}
              onSelectionChange={setSelectedEmployees}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingEmployee(null); }}
          onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
          employee={editingEmployee}
          mode={editingEmployee ? (editingEmployee.id ? 'edit' : 'view') : 'add'}
        />
      )}
    </div>
  );
};

export default EmployeeGrid;