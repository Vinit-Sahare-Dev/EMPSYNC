// src/components/employees/EmployeeGrid.jsx
import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeCard from './EmployeeCard';
import { empSyncAPI } from '../../services/apiService';

// Safe toast fallback
const useToastFallback = () => {
  return {
    showToast: (type, message) => {
      // Disabled - no notifications
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.top = '50%';
      notification.style.left = '50%';
      notification.style.transform = 'translate(-50%, -50%)';
      notification.style.background = `${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'}`;
      notification.style.color = 'white';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '10000';
      notification.style.maxWidth = '300px';
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
  
  // Try to use the actual toast, fallback if not available
  let toast;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useToast } = require('../ui/Toast');
    toast = useToast();
  } catch (error) {
    console.warn('Toast context not available, using fallback');
    toast = useToastFallback();
  }

  // ✅ BACKEND CONNECTION CHECK - UPDATED
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🔍 Initializing backend connection...');
        setLoading(true);
        setBackendStatus('checking');

        // Direct backend test first
        console.log('🔄 Testing backend connection...');
        const health = await empSyncAPI.healthCheck();
        console.log('Health check result:', health);

        if (health.connected) {
          console.log('✅ Backend connected successfully');
          setBackendStatus('connected');
          await loadEmployeesFromBackend(); // Load from backend
        } else {
          throw new Error(health.message || 'Backend not available');
        }
      } catch (error) {
        console.error('❌ Backend initialization failed:', error);
        setBackendStatus('disconnected');
        toast.showToast('error', `Backend connection failed: ${error.message}`);
        // Don't fallback to local data - show empty state
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load employees from BACKEND API ONLY - NO LOCAL FALLBACK
  const loadEmployeesFromBackend = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading employees from backend...');

      const response = await empSyncAPI.getAllEmployees();
      console.log('Backend response:', response);

      if (response.success) {
        const backendEmployees = response.employees || [];
        setEmployees(backendEmployees);
        console.log(`✅ Loaded ${backendEmployees.length} employees from backend database`);
        toast.showToast('success', `Loaded ${backendEmployees.length} employees from database`);

        // Clear any local storage to avoid confusion
        localStorage.removeItem('employees');
      } else {
        throw new Error(response.message || 'Failed to load employees from backend');
      }
    } catch (error) {
      console.error('❌ Error loading from backend:', error);
      setEmployees([]);
      toast.showToast('error', `Failed to load employees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new employee - BACKEND ONLY
  const handleAddEmployee = async (employeeData) => {
    try {
      // Employee created successfully - no notifications
      const response = await empSyncAPI.createEmployee(employeeData);
      
      if (response.success) {
        // Reload fresh data from backend
        await loadEmployeesFromBackend();
      } else {
        // Handle error silently
      }
    } catch (error) {
      // Handle error silently
    }
  };

  // Handle editing employee - BACKEND ONLY
  const handleEditEmployee = async (employeeData) => {
    try {
      console.log('📨 Updating employee via backend API:', editingEmployee.id, employeeData);

      const response = await empSyncAPI.updateEmployee(editingEmployee.id, employeeData);
      console.log('Backend update response:', response);

      if (response.success) {
        toast.showToast('success', response.message || 'Employee updated successfully in database!');
        setIsModalOpen(false);
        setEditingEmployee(null);

        // Reload fresh data from backend
        await loadEmployeesFromBackend();
      } else {
        throw new Error(response.message || 'Failed to update employee in database');
      }
    } catch (error) {
      console.error('❌ Error updating employee in backend:', error);
      toast.showToast('error', `Failed to update employee: ${error.message}`);
      // Don't fallback to local storage - keep modal open for retry
    }
  };

  // Handle deleting employee - BACKEND ONLY
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee from the database?')) {
      try {
        console.log('📨 Deleting employee via backend API:', employeeId);

        const response = await empSyncAPI.deleteEmployee(employeeId);

        if (response.success) {
          toast.showToast('success', response.message || 'Employee deleted successfully from database!');

          // Reload fresh data from backend
          await loadEmployeesFromBackend();
        } else {
          throw new Error(response.message || 'Failed to delete employee from database');
        }
      } catch (error) {
        console.error('❌ Error deleting employee from backend:', error);
        toast.showToast('error', `Failed to delete employee: ${error.message}`);
      }
    }
  };

  // Handle viewing employee
  const handleViewEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  // Open modal for adding new employee
  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  // Open modal for editing employee
  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  // Bulk delete - BACKEND ONLY
  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedEmployees.length} employees from the database?`)) {
      try {
        let successCount = 0;
        let errorCount = 0;

        // Delete each employee from backend
        for (const employeeId of selectedEmployees) {
          try {
            const response = await empSyncAPI.deleteEmployee(employeeId);
            if (response.success) {
              successCount++;
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
            console.error(`Error deleting employee ${employeeId}:`, error);
          }
        }

        if (errorCount === 0) {
          toast.showToast('success', `${successCount} employees deleted successfully from database!`);
        } else {
          toast.showToast('warning', `${successCount} deleted, ${errorCount} failed. Reloading data...`);
        }

        setSelectedEmployees([]);

        // Reload fresh data from backend
        await loadEmployeesFromBackend();

      } catch (error) {
        console.error('❌ Error in bulk delete:', error);
        toast.showToast('error', `Bulk delete failed: ${error.message}`);
      }
    }
  };

  // Retry backend connection
  const retryBackendConnection = async () => {
    setBackendStatus('checking');
    setLoading(true);
    try {
      await loadEmployeesFromBackend();
      setBackendStatus('connected');
    } catch (error) {
      setBackendStatus('disconnected');
      toast.showToast('error', 'Still cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="employee-grid-container">
        <div className="loading-container">
          <div>🔄 Loading employees from database...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-grid-container">
      {/* Header with Backend Status */}
      <div className="employee-header">
        <div>
          <h1>Employee Navigator</h1>
          <p>Manage your workforce efficiently</p>
          {/* ✅ BACKEND STATUS INDICATOR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '10px'
          }}>
            <div style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor:
                backendStatus === 'connected' ? '#d4edda' :
                backendStatus === 'checking' ? '#fff3cd' : '#f8d7da',
              color:
                backendStatus === 'connected' ? '#155724' :
                backendStatus === 'checking' ? '#856404' : '#721c24',
              border: `1px solid ${
                backendStatus === 'connected' ? '#c3e6cb' :
                backendStatus === 'checking' ? '#ffeaa7' : '#f5c6cb'
              }`
            }}>
              Status: {
                backendStatus === 'connected' ? '✅ Connected to Backend Database' :
                backendStatus === 'checking' ? '🔄 Checking Connection...' :
                '❌ Backend Connection Failed'
              }
            </div>

            {backendStatus !== 'connected' && (
              <button
                className="btn btn-outline"
                onClick={retryBackendConnection}
                style={{ fontSize: '12px', padding: '4px 8px' }}
                disabled={loading}
              >
                🔄 Retry Connection
              </button>
            )}
          </div>
        </div>
        <div className="employee-actions">
          <button
            className="btn btn-primary"
            onClick={openAddModal}
            disabled={backendStatus !== 'connected'}
          >
            + Add Employee to Database
          </button>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search employees..."
              className="search-input"
            />
          </div>
          <button className="btn btn-outline">
            Export Data
          </button>
        </div>
      </div>

      {/* Connection Error Message */}
      {backendStatus !== 'connected' && (
        <div className="connection-error" style={{
          padding: '15px',
          margin: '20px 0',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          color: '#856404'
        }}>
          <strong>⚠️ Backend Connection Required</strong>
          <p style={{ margin: '5px 0 0 0' }}>
            Cannot connect to the server. Please make sure your backend is running on port 8888.
            Employee data will not be saved or loaded until the connection is restored.
          </p>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && backendStatus === 'connected' && (
        <div className="bulk-actions">
          <div className="bulk-selection">
            {selectedEmployees.length} employees selected
          </div>
          <div className="bulk-buttons">
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected from Database
            </button>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div style={{ marginTop: '20px' }}>
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👥</div>
            <h3>
              {backendStatus === 'connected' ? 'No employees in database' : 'Cannot load employees'}
            </h3>
            <p>
              {backendStatus === 'connected'
                ? 'Add your first employee to get started!'
                : 'Please check your backend connection and retry.'
              }
            </p>
            <button
              className="btn btn-primary"
              onClick={openAddModal}
              disabled={backendStatus !== 'connected'}
            >
              {backendStatus === 'connected' ? 'Add First Employee' : 'Backend Connection Required'}
            </button>
          </div>
        ) : (
          <div className={`employee-view ${view}`}>
            {view === "grid" ? (
              <EmployeeCard
                employees={employees}
                onView={handleViewEmployee}
                onEdit={openEditModal}
                onDelete={handleDeleteEmployee}
                selectedEmployees={selectedEmployees}
                onSelectionChange={setSelectedEmployees}
                backendConnected={backendStatus === 'connected'}
              />
            ) : (
              <EmployeeTable
                employees={employees}
                onView={handleViewEmployee}
                onEdit={openEditModal}
                onDelete={handleDeleteEmployee}
                selectedEmployees={selectedEmployees}
                onSelectionChange={setSelectedEmployees}
                backendConnected={backendStatus === 'connected'}
              />
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Employee Modal */}
      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEmployee(null);
          }}
          onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
          employee={editingEmployee}
          mode={editingEmployee ? (editingEmployee.id ? 'edit' : 'view') : 'add'}
          backendConnected={backendStatus === 'connected'}
        />
      )}
    </div>
  );
};

export default EmployeeGrid;