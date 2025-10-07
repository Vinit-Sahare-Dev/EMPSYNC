import React, { useState, useEffect } from 'react';
import EmployeeCard from './EmployeeCard';
import EmployeeModal from './EmployeeModal';
import EmployeeFilters from './EmployeeFilters';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../layout/LoadingSpinner';
import EmptyState from '../common/EmptyState';

// Local storage functions
const employeeStorage = {
  // Get all employees from localStorage
  getEmployees: () => {
    try {
      const stored = localStorage.getItem('employees');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading employees from storage:', error);
      return [];
    }
  },

  // Save employees to localStorage
  saveEmployees: (employees) => {
    try {
      localStorage.setItem('employees', JSON.stringify(employees));
      return true;
    } catch (error) {
      console.error('Error saving employees to storage:', error);
      return false;
    }
  },

  // Generate unique ID
  generateId: () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
};

const EmployeeGrid = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false); // No loading for local storage
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    gender: '',
    search: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  // Load employees from localStorage
  const loadEmployees = () => {
    const data = employeeStorage.getEmployees();
    setEmployees(data);
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleSave = async (employeeData) => {
    try {
      let updatedEmployees;
      
      if (editingEmployee) {
        // Update existing employee
        updatedEmployees = employees.map(emp =>
          emp.id === editingEmployee.id 
            ? { ...employeeData, id: editingEmployee.id }
            : emp
        );
      } else {
        // Create new employee
        const newEmployee = {
          ...employeeData,
          id: employeeStorage.generateId(),
          bonus: employeeData.salary * 0.10,
          pf: employeeData.salary * 0.12,
          tax: calculateTax(employeeData.salary)
        };
        updatedEmployees = [...employees, newEmployee];
      }

      // Save to localStorage
      const success = employeeStorage.saveEmployees(updatedEmployees);
      
      if (success) {
        setEmployees(updatedEmployees);
        setShowModal(false);
        alert(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
      } else {
        throw new Error('Failed to save to storage');
      }
    } catch (error) {
      console.error('🔴 Save failed:', error);
      alert('Failed to save employee. Please try again.');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const updatedEmployees = employees.filter(emp => emp.id !== id);
        const success = employeeStorage.saveEmployees(updatedEmployees);
        
        if (success) {
          setEmployees(updatedEmployees);
          alert('Employee deleted successfully!');
        } else {
          throw new Error('Failed to delete from storage');
        }
      } catch (error) {
        console.error('🔴 Delete failed:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Tax calculation function
  const calculateTax = (salary) => {
    if (salary <= 250000) {
      return 0.0;
    } else if (salary <= 500000) {
      return (salary - 250000) * 0.05;
    } else if (salary <= 1000000) {
      return 12500 + (salary - 500000) * 0.20;
    } else {
      return 112500 + (salary - 1000000) * 0.30;
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = !filters.department || emp.department === filters.department;
    const matchesGender = !filters.gender || emp.gender === filters.gender;
    const matchesSearch = !filters.search || 
      emp.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesDept && matchesGender && matchesSearch;
  });

  return (
    <div className="employee-grid-page fade-in">
      <div className="page-header">
        <div>
          <h1>Employee Sync</h1>
          <p>Manage and synchronize your workforce</p>
          <small style={{color: '#666', fontStyle: 'italic'}}>
            Data saved locally in browser storage
          </small>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Employee
        </button>
      </div>

      <div className="controls">
        <SearchBar 
          value={filters.search}
          onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
          placeholder="Search employees..."
        />
        <EmployeeFilters 
          filters={filters}
          onChange={handleFilterChange}
        />
      </div>

      <div className="employee-grid">
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={() => handleEdit(employee)}
            onDelete={() => handleDelete(employee.id)}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <EmptyState 
          message="No employees found"
          subtitle={employees.length === 0 ? "Get started by adding your first employee" : "Try adjusting your filters"}
        />
      )}

      {showModal && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EmployeeGrid;