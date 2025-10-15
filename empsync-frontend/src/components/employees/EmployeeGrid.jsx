// src/components/employees/EmployeeGrid.jsx
import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeCard from './EmployeeCard';
import EmployeeTable from './EmployeeTable';

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

  // Load employees from localStorage
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    try {
      setLoading(true);
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.showToast('error', 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const saveEmployees = (updatedEmployees) => {
    try {
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      setEmployees(updatedEmployees);
    } catch (error) {
      console.error('Error saving employees:', error);
      toast.showToast('error', 'Failed to save employee data');
    }
  };

  // Handle adding new employee
  const handleAddEmployee = (employeeData) => {
    try {
      const newEmployee = {
        id: Date.now().toString(),
        ...employeeData,
        createdAt: new Date().toISOString(),
      };

      const updatedEmployees = [...employees, newEmployee];
      saveEmployees(updatedEmployees);
      toast.showToast('success', 'Employee added successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.showToast('error', 'Failed to add employee');
    }
  };

  // Handle editing employee
  const handleEditEmployee = (employeeData) => {
    try {
      const updatedEmployees = employees.map(emp =>
        emp.id === editingEmployee.id ? { ...emp, ...employeeData, updatedAt: new Date().toISOString() } : emp
      );
      saveEmployees(updatedEmployees);
      toast.showToast('success', 'Employee updated successfully!');
      setIsModalOpen(false);
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.showToast('error', 'Failed to update employee');
    }
  };

  // Handle deleting employee
  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
        saveEmployees(updatedEmployees);
        toast.showToast('success', 'Employee deleted successfully!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.showToast('error', 'Failed to delete employee');
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
  const handleBulkDelete = () => {
    if (selectedEmployees.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedEmployees.length} employees?`)) {
      try {
        const updatedEmployees = employees.filter(
          emp => !selectedEmployees.includes(emp.id)
        );
        saveEmployees(updatedEmployees);
        setSelectedEmployees([]);
        toast.showToast('success', `${selectedEmployees.length} employees deleted successfully`);
      } catch (error) {
        console.error('Error in bulk delete:', error);
        toast.showToast('error', 'Failed to delete employees');
      }
    }
  };

  if (loading) {
    return (
      <div className="employee-grid-container">
        <div className="loading-container">
          <div>Loading employees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-grid-container">
      {/* Header with Add Button */}
      <div className="employee-header">
        <div>
          <h1>Employee Management</h1>
          <p>Manage your workforce efficiently</p>
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