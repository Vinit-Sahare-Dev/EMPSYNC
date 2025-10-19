// src/components/employees/EmployeeModal.jsx
import React, { useState, useEffect } from 'react';

const EmployeeModal = ({ isOpen, onClose, onSave, employee, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    gender: '',
    joinDate: '',
    address: '',
    status: 'Active'
  });

  const departments = ['IT', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Support'];
  const positions = ['Software Engineer', 'Senior Developer', 'Team Lead', 'Manager', 'Director', 'Analyst', 'Specialist', 'Coordinator'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || '',
        gender: employee.gender || '',
        joinDate: employee.joinDate || '',
        address: employee.address || '',
        status: employee.status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        gender: '',
        joinDate: '',
        address: '',
        status: 'Active'
      });
    }
  }, [employee, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }

    // Validation
    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee. Please try again.');
    }
  };

  const handleChange = (e) => {
    if (mode === 'view') return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>
            {isViewMode && 'View Employee Details'}
            {isEditMode && 'Edit Employee'}
            {isAddMode && 'Add New Employee'}
          </h2>
          <button className="btn btn-outline" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name {!isViewMode && '*'}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required={!isViewMode}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                />
              </div>

              <div className="form-group">
                <label>Email Address {!isViewMode && '*'}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required={!isViewMode}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                />
              </div>

              <div className="form-group">
                <label>Department {!isViewMode && '*'}</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required={!isViewMode}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Position {!isViewMode && '*'}</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required={!isViewMode}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                >
                  <option value="">Select Position</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Salary ($)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  min="0"
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                >
                  <option value="">Select Gender</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Join Date</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="3"
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className={isViewMode ? 'view-mode' : ''}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </button>
            {!isViewMode && (
              <button type="submit" className="btn btn-primary">
                {isEditMode ? 'Update Employee' : 'Add Employee'}
              </button>
            )}
            {isViewMode && (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  // Switch to edit mode
                  const event = new Event('change', { bubbles: true });
                  Object.defineProperty(event, 'target', {
                    value: { name: 'mode', value: 'edit' },
                    enumerable: true
                  });
                  handleChange(event);
                }}
              >
                Edit Employee
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;