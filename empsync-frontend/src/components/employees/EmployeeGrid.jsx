// src/components/employees/EmployeeGrid.jsx
import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeCard from './EmployeeCard';
import EmployeeTable from './EmployeeTable';
import { empSyncAPI } from '../../services/apiService';

// Safe toast fallback
const useToastFallback = () => {
  return {
    showToast: (type, message) => {
      console.log(`${type}: ${message}`);
      // Simple notification fallback
      const notification = document.createElement('div');
      notification.className = `temp-toast temp-toast-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        max-width: 300px;
      `;
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

  // ✅ BACKEND CONNECTION CHECK
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        console.log('🔍 Checking backend connection...');
        const health = await empSyncAPI.healthCheck();
        
        if (health.success) {
          console.log('✅ Backend connected, using real data');
          setBackendStatus('connected');
          loadEmployees(); // Load real data from backend
        } else {
          console.log('❌ Backend not available:', health.message);
          setBackendStatus('disconnected');
          loadLocalData(); // Fallback to local data
        }
      } catch (error) {
        console.log('❌ Backend check failed:', error);
        setBackendStatus('error');
        loadLocalData(); // Fallback to local data
      }
    };

    checkBackendConnection();
  }, []);

  // Load employees from BACKEND API
  const loadEmployees = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading employees from backend...');
      
      const response = await empSyncAPI.getAllEmployees();
      console.log('Backend response:', response);
      
      if (response.success) {
        setEmployees(response.employees || []);
        console.log(`✅ Loaded ${response.employees?.length || 0} employees from backend`);
        toast.showToast('success', `Loaded ${response.employees?.length || 0} employees from server`);
      } else {
        throw new Error(response.message || 'Failed to load employees');
      }
    } catch (error) {
      console.error('❌ Error loading from backend:', error);
      loadLocalData(); // Fallback to local data
    } finally {
      setLoading(false);
    }
  };

  // Load data from localStorage as fallback
  const loadLocalData = () => {
    try {
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        const localData = JSON.parse(savedEmployees);
        setEmployees(localData);
        console.log('🔄 Using localStorage fallback');
        toast.showToast('warning', 'Using local data (backend unavailable)');
      } else {
        setEmployees([]);
        console.log('📝 No local data found, starting with empty list');
      }
    } catch (localError) {
      console.error('Local storage fallback failed:', localError);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new employee - CALL BACKEND API
  const handleAddEmployee = async (employeeData) => {
    try {
      console.log('📨 Creating employee via API:', employeeData);
      
      const response = await empSyncAPI.createEmployee(employeeData);
      console.log('Create response:', response);
      
      if (response.success) {
        toast.showToast('success', 'Employee added successfully to server!');
        setIsModalOpen(false);
        await loadEmployees(); // Reload from backend to get the new data
        
        // Also update localStorage as backup
        try {
          const updatedEmployees = [...employees, response.employee];
          localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        } catch (localError) {
          console.warn('Could not update localStorage:', localError);
        }
      } else {
        throw new Error(response.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.showToast('error', `Failed to add employee: ${error.message}`);
      
      // Fallback to localStorage
      try {
        const newEmployee = {
          id: Date.now().toString(),
          ...employeeData,
          createdAt: new Date().toISOString(),
        };
        const updatedEmployees = [...employees, newEmployee];
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        setEmployees(updatedEmployees);
        toast.showToast('warning', 'Employee added locally (backend unavailable)');
        setIsModalOpen(false);
      } catch (localError) {
        console.error('Local fallback failed:', localError);
      }
    }
  };

  // Handle editing employee - CALL BACKEND API
  const handleEditEmployee = async (employeeData) => {
    try {
      console.log('📨 Updating employee via API:', editingEmployee.id, employeeData);
      
      const response = await empSyncAPI.updateEmployee(editingEmployee.id, employeeData);
      console.log('Update response:', response);
      
      if (response.success) {
        toast.showToast('success', 'Employee updated successfully on server!');
        setIsModalOpen(false);
        setEditingEmployee(null);
        await loadEmployees(); // Reload from backend
      } else {
        throw new Error(response.message || 'Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.showToast('error', `Failed to update employee: ${error.message}`);
      
      // Fallback to localStorage
      try {
        const updatedEmployees = employees.map(emp =>
          emp.id === editingEmployee.id ? { ...emp, ...employeeData, updatedAt: new Date().toISOString() } : emp
        );
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        setEmployees(updatedEmployees);
        toast.showToast('warning', 'Employee updated locally (backend unavailable)');
        setIsModalOpen(false);
        setEditingEmployee(null);
      } catch (localError) {
        console.error('Local fallback failed:', localError);
      }
    }
  };

  // Handle deleting employee - CALL BACKEND API
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        console.log('📨 Deleting employee via API:', employeeId);
        
        await empSyncAPI.deleteEmployee(employeeId);
        toast.showToast('success', 'Employee deleted successfully from server!');
        await loadEmployees(); // Reload from backend
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.showToast('error', `Failed to delete employee: ${error.message}`);
        
        // Fallback to localStorage
        try {
          const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
          localStorage.setItem('employees', JSON.stringify(updatedEmployees));
          setEmployees(updatedEmployees);
          toast.showToast('warning', 'Employee deleted locally (backend unavailable)');
        } catch (localError) {
          console.error('Local fallback failed:', localError);
        }
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

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedEmployees.length} employees?`)) {
      try {
        // Delete each employee from backend
        for (const employeeId of selectedEmployees) {
          await empSyncAPI.deleteEmployee(employeeId);
        }
        
        toast.showToast('success', `${selectedEmployees.length} employees deleted successfully from server!`);
        setSelectedEmployees([]);
        await loadEmployees(); // Reload from backend
      } catch (error) {
        console.error('Error in bulk delete:', error);
        toast.showToast('error', `Failed to delete employees: ${error.message}`);
        
        // Fallback to localStorage
        try {
          const updatedEmployees = employees.filter(
            emp => !selectedEmployees.includes(emp.id)
          );
          localStorage.setItem('employees', JSON.stringify(updatedEmployees));
          setEmployees(updatedEmployees);
          setSelectedEmployees([]);
          toast.showToast('warning', 'Employees deleted locally (backend unavailable)');
        } catch (localError) {
          console.error('Local fallback failed:', localError);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="employee-grid-container">
        <div className="loading-container">
          <div>Loading employees from server...</div>
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
            display: 'inline-block',
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
              backendStatus === 'connected' ? '✅ Connected to Backend' :
              backendStatus === 'checking' ? '🔄 Checking Connection...' :
              backendStatus === 'disconnected' ? '⚠️ Using Local Data' :
              '❌ Connection Error'
            }
          </div>
        </div>
        <div className="employee-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add Employee
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

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-selection">
            {selectedEmployees.length} employees selected
          </div>
          <div className="bulk-buttons">
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div style={{ marginTop: '20px' }}>
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">👥</div>
            <h3>No employees found</h3>
            <p>Add your first employee to get started!</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add First Employee
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
              />
            ) : (
              <EmployeeTable 
                employees={employees}
                onView={handleViewEmployee}
                onEdit={openEditModal}
                onDelete={handleDeleteEmployee}
                selectedEmployees={selectedEmployees}
                onSelectionChange={setSelectedEmployees}
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
        />
      )}
    </div>
  );
};

export default EmployeeGrid;