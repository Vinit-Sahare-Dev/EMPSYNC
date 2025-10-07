import React, { useState, useEffect } from 'react';

const EmployeeModal = ({ employee, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    department: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);

  const departments = ['IT', 'HR', 'Finance'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        salary: employee.salary || '',
        department: employee.department || '',
        gender: employee.gender || ''
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData = {
        ...formData,
        salary: parseFloat(formData.salary)
      };
      await onSave(employeeData);
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary (₹) *</label>
              <input
                type="number"
                name="salary"
                className="form-input"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary amount"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department *</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                {genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-header" style={{borderTop: '1px solid #e2e8f0'}}>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'Saving...' : (employee ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;