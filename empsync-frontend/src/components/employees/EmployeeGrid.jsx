// src/components/employees/EmployeeGrid.jsx
import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeCard from './EmployeeCard';
import EmployeeTable from './EmployeeTable';
import { useToast } from '../ui/Toast';

const EmployeeGrid = ({ view = "grid" }) => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const { showToast } = useToast();

  // Load employees from localStorage
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    try {
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const saveEmployees = (updatedEmployees) => {
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
  };

  // Handle adding new employee
  const handleAddEmployee = (employeeData) => {
    const newEmployee = {
      id: Date.now(),
      ...employeeData,
      createdAt: new Date().toISOString(),
    };

    const updatedEmployees = [...employees, newEmployee];
    saveEmployees(updatedEmployees);
    showToast('success', 'Employee added successfully!');
    setIsModalOpen(false);
  };

  // Handle editing employee
  const handleEditEmployee = (employeeData) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === editingEmployee.id ? { ...emp, ...employeeData, updatedAt: new Date().toISOString() } : emp
    );
    saveEmployees(updatedEmployees);
    showToast('success', 'Employee updated successfully!');
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  // Handle deleting employee
  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      saveEmployees(updatedEmployees);
      showToast('success', 'Employee deleted successfully!');
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
      const updatedEmployees = employees.filter(
        emp => !selectedEmployees.includes(emp.id)
      );
      saveEmployees(updatedEmployees);
      setSelectedEmployees([]);
      showToast('success', `${selectedEmployees.length} employees deleted successfully`);
    }
  };

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
    </div>
  );
};

export default EmployeeGrid;