import React from 'react';

const EmployeeFilters = ({ filters, onChange }) => {
  const departments = ['IT', 'HR', 'Finance'];
  const genders = ['Male', 'Female', 'Other'];

  const handleFilterChange = (key, value) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onChange({
      department: '',
      gender: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.department || filters.gender;

  return (
    <div className="filters">
      <select
        className="filter-select"
        value={filters.department}
        onChange={(e) => handleFilterChange('department', e.target.value)}
      >
        <option value="">All Departments</option>
        {departments.map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.gender}
        onChange={(e) => handleFilterChange('gender', e.target.value)}
      >
        <option value="">All Genders</option>
        {genders.map(gender => (
          <option key={gender} value={gender}>{gender}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button 
          className="btn btn-outline btn-sm"
          onClick={clearFilters}
          style={{alignSelf: 'center'}}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmployeeFilters;