import React, { useState, useEffect } from 'react';
import { empSyncAPI } from '../../services/apiService';
import EmployeeCard from './EmployeeCard';
import EmployeeModal from './EmployeeModal';
import EmployeeFilters from './EmployeeFilters';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../layout/LoadingSpinner';

const EmployeeGrid = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    gender: '',
    search: ''
  });

  useEffect(() => {
    syncEmployeeData();
  }, []);

  const syncEmployeeData = async () => {
    try {
      setLoading(true);
      const data = await empSyncAPI.syncEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('🔴 Employee sync failed:', error);
    } finally {
      setLoading(false);
    }
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
      if (editingEmployee) {
        await empSyncAPI.updateSync(editingEmployee.id, employeeData);
      } else {
        await empSyncAPI.createSync(employeeData);
      }
      setShowModal(false);
      syncEmployeeData(); // Refresh data
    } catch (error) {
      console.error('🔴 Save failed:', error);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = !filters.department || emp.department === filters.department;
    const matchesGender = !filters.gender || emp.gender === filters.gender;
    const matchesSearch = !filters.search || 
      emp.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesDept && matchesGender && matchesSearch;
  });

  if (loading) return <LoadingSpinner message="Syncing employee data..." />;

  return (
    <div className="employee-grid-page">
      <div className="page-header">
        <div>
          <h1>Employee Sync</h1>
          <p>Manage and synchronize your workforce</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          + New Employee
        </button>
      </div>

      <div className="controls">
        <SearchBar 
          value={filters.search}
          onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
        />
        <EmployeeFilters 
          filters={filters}
          onChange={setFilters}
        />
      </div>

      <div className="employee-grid">
        {filteredEmployees.map(employee => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onEdit={handleEdit}
            onDelete={syncEmployeeData}
          />
        ))}
      </div>

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