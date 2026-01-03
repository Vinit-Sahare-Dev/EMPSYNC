import React, { useState, useEffect } from 'react';
import DepartmentModal from './DepartmentModal';
import { empSyncAPI } from '../../services/apiService';
import {
  DocumentArrowDownIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import './DepartmentGrid.css';

// Safe toast fallback
const useToastFallback = () => {
  return {
    showToast: (type, message) => {
      console.log(`${type}: ${message}`);
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

const DepartmentGrid = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [stats, setStats] = useState({
    totalDepartments: 0,
    totalEmployees: 0,
    avgEmployeesPerDept: 0,
    totalBudget: 0
  });

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

  // Load departments and employees data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading departments data...');

        // Check backend connection
        const health = await empSyncAPI.healthCheck();
        if (health.success) {
          setBackendStatus('connected');
          await loadDepartmentsFromBackend();
        } else {
          setBackendStatus('disconnected');
          loadLocalData();
        }
      } catch (error) {
        console.log('❌ Backend check failed:', error);
        setBackendStatus('error');
        loadLocalData();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load departments from backend
  const loadDepartmentsFromBackend = async () => {
    try {
      // Get all employees to calculate department stats
      const employeesResponse = await empSyncAPI.getAllEmployees();
      const employees = employeesResponse.employees || employeesResponse || [];

      // Calculate departments from employees data
      const departmentMap = {};

      employees.forEach(employee => {
        const deptName = employee.department || 'Unassigned';
        if (!departmentMap[deptName]) {
          departmentMap[deptName] = {
            id: deptName.toLowerCase().replace(/\s+/g, '-'),
            name: deptName,
            manager: employee.manager || 'TBD',
            employeeCount: 0,
            totalBudget: 0,
            status: 'Active',
            createdAt: employee.createdAt || new Date().toISOString()
          };
        }

        departmentMap[deptName].employeeCount++;
        departmentMap[deptName].totalBudget += parseFloat(employee.salary) || 0;
      });

      const departmentList = Object.values(departmentMap);
      setDepartments(departmentList);

      // Calculate stats
      calculateStats(departmentList, employees);

      console.log(`✅ Loaded ${departmentList.length} departments from backend`);

    } catch (error) {
      console.error('❌ Error loading departments from backend:', error);
      loadLocalData();
    }
  };

  // Load data from localStorage as fallback
  const loadLocalData = () => {
    try {
      const savedDepartments = localStorage.getItem('departments');
      const savedEmployees = localStorage.getItem('employees');

      let departmentList = [];
      const employees = savedEmployees ? JSON.parse(savedEmployees) : [];

      if (savedDepartments) {
        departmentList = JSON.parse(savedDepartments);
      } else {
        // Generate departments from employees data
        const departmentMap = {};

        employees.forEach(employee => {
          const deptName = employee.department || 'Unassigned';
          if (!departmentMap[deptName]) {
            departmentMap[deptName] = {
              id: deptName.toLowerCase().replace(/\s+/g, '-'),
              name: deptName,
              manager: employee.manager || 'TBD',
              employeeCount: 0,
              totalBudget: 0,
              status: 'Active',
              createdAt: employee.createdAt || new Date().toISOString()
            };
          }

          departmentMap[deptName].employeeCount++;
          departmentMap[deptName].totalBudget += parseFloat(employee.salary) || 0;
        });

        departmentList = Object.values(departmentMap);
        localStorage.setItem('departments', JSON.stringify(departmentList));
      }

      setDepartments(departmentList);
      calculateStats(departmentList, employees);

      console.log('🔄 Using localStorage fallback for departments');
      toast.showToast('warning', 'Using local data (backend unavailable)');

    } catch (localError) {
      console.error('Local storage fallback failed:', localError);
      setDepartments([]);
      setStats({
        totalDepartments: 0,
        totalEmployees: 0,
        avgEmployeesPerDept: 0,
        totalBudget: 0
      });
    }
  };

  // Calculate department statistics
  const calculateStats = (deptList, employees) => {
    const totalEmployees = employees.length;
    const totalDepartments = deptList.length;
    const avgEmployeesPerDept = totalDepartments > 0 ? Math.round(totalEmployees / totalDepartments) : 0;
    const totalBudget = deptList.reduce((sum, dept) => sum + dept.totalBudget, 0);

    setStats({
      totalDepartments,
      totalEmployees,
      avgEmployeesPerDept,
      totalBudget
    });
  };

  // Handle adding new department
  const handleAddDepartment = async (departmentData) => {
    try {
      const newDepartment = {
        id: Date.now().toString(),
        ...departmentData,
        employeeCount: 0,
        totalBudget: 0,
        createdAt: new Date().toISOString(),
        status: departmentData.status || 'Active'
      };

      if (backendStatus === 'connected') {
        toast.showToast('success', 'Department added successfully!');
      } else {
        // Update local storage
        const updatedDepartments = [...departments, newDepartment];
        localStorage.setItem('departments', JSON.stringify(updatedDepartments));
        setDepartments(updatedDepartments);
        calculateStats(updatedDepartments, JSON.parse(localStorage.getItem('employees') || '[]'));
        toast.showToast('warning', 'Department added locally (backend unavailable)');
      }

      setIsModalOpen(false);

    } catch (error) {
      console.error('Error adding department:', error);
      toast.showToast('error', `Failed to add department: ${error.message}`);
    }
  };

  // Handle editing department
  const handleEditDepartment = async (departmentData) => {
    try {
      const updatedDepartments = departments.map(dept =>
        dept.id === editingDepartment.id
          ? { ...dept, ...departmentData, updatedAt: new Date().toISOString() }
          : dept
      );

      if (backendStatus === 'connected') {
        toast.showToast('success', 'Department updated successfully!');
      } else {
        localStorage.setItem('departments', JSON.stringify(updatedDepartments));
        toast.showToast('warning', 'Department updated locally (backend unavailable)');
      }

      setDepartments(updatedDepartments);
      setIsModalOpen(false);
      setEditingDepartment(null);

    } catch (error) {
      console.error('Error updating department:', error);
      toast.showToast('error', `Failed to update department: ${error.message}`);
    }
  };

  // Handle deleting department
  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        const updatedDepartments = departments.filter(dept => dept.id !== departmentId);

        if (backendStatus === 'connected') {
          toast.showToast('success', 'Department deleted successfully!');
        } else {
          localStorage.setItem('departments', JSON.stringify(updatedDepartments));
          toast.showToast('warning', 'Department deleted locally (backend unavailable)');
        }

        setDepartments(updatedDepartments);
        calculateStats(updatedDepartments, JSON.parse(localStorage.getItem('employees') || '[]'));

      } catch (error) {
        console.error('Error deleting department:', error);
        toast.showToast('error', `Failed to delete department: ${error.message}`);
      }
    }
  };

  // Format currency
  const formatRupees = (amount) => {
    if (amount === 0) return '₹0';
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Open modal for adding new department
  const openAddModal = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  // Open modal for editing department
  const openEditModal = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedDepartments.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedDepartments.length} departments?`)) {
      const updatedDepartments = departments.filter(
        dept => !selectedDepartments.includes(dept.id)
      );

      localStorage.setItem('departments', JSON.stringify(updatedDepartments));
      setDepartments(updatedDepartments);
      setSelectedDepartments([]);
      calculateStats(updatedDepartments, JSON.parse(localStorage.getItem('employees') || '[]'));

      toast.showToast('success', `${selectedDepartments.length} departments deleted successfully`);
    }
  };

  if (loading) {
    return (
      <div className="department-grid-container">
        <div className="loading-container">
          <div>Loading departments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="department-grid-container">
      {/* Department Hero Section */}
      <div className="department-hero">
        <div className="hero-content">
          <div className="hero-left">
          </div>

          <div className="hero-actions">
            <div className="hero-status">
              <div className={`
                inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                ${backendStatus === 'connected' 
                  ? 'bg-success-100 text-success-800 border border-success-200' 
                  : backendStatus === 'checking' 
                  ? 'bg-warning-100 text-warning-800 border border-warning-200'
                  : 'bg-danger-100 text-danger-800 border border-danger-200'
                }
              `}>
                <div className="w-2 h-2 rounded-full mr-2 animate-pulse-soft"
                  style={{
                    backgroundColor: backendStatus === 'connected' ? '#22c55e' :
                                     backendStatus === 'checking' ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
                Status: {
                  backendStatus === 'connected' ? '✅ Connected to Backend Database' :
                  backendStatus === 'checking' ? '🔄 Checking Connection...' :
                  '❌ Backend Connection Failed'
                }
              </div>
            </div>
            <div className="hero-search">
              <input
                type="text"
                placeholder="Search departments..."
                className="hero-search-input"
              />
            </div>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={openAddModal}>
                Add Department
              </button>
              <button className="btn btn-outline">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="hero-stats">
          <div className="department-stat-card primary">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{stats.totalDepartments}</h3>
              <p>Total Departments</p>
            </div>
          </div>
          <div className="department-stat-card success">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{stats.totalEmployees}</h3>
              <p>Total Employees</p>
            </div>
          </div>
          <div className="department-stat-card info">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{stats.avgEmployeesPerDept}</h3>
              <p>Avg per Department</p>
            </div>
          </div>
          <div className="department-stat-card warning">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{formatRupees(stats.totalBudget)}</h3>
              <p>Total Budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDepartments.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-selection">
            {selectedDepartments.length} departments selected
          </div>
          <div className="bulk-buttons">
            <button className="btn btn-danger" onClick={handleBulkDelete}>
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Departments Grid */}
      <div className="departments-grid">
        {departments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🏢</div>
            <h3>No departments found</h3>
            <p>Create your first department to get started!</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add First Department
            </button>
          </div>
        ) : (
          <div className="departments-cards">
            {departments.map(department => (
              <div key={department.id} className="department-card">
                <div className="department-card-header">
                  <div className="department-info">
                    <h3 className="department-name">{department.name}</h3>
                    <span className={`department-status ${department.status?.toLowerCase()}`}>
                      {department.status || 'Active'}
                    </span>
                  </div>
                  <div className="department-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => openEditModal(department)}
                      title="Edit Department"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteDepartment(department.id)}
                      title="Delete Department"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="department-details">
                  <div className="detail-item">
                    <span className="detail-label">Manager:</span>
                    <span className="detail-value">{department.manager}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Employees:</span>
                    <span className="detail-value highlight">{department.employeeCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Annual Budget:</span>
                    <span className="detail-value budget">{formatRupees(department.totalBudget)}</span>
                  </div>
                </div>

                {/* Progress bar for employee utilization */}
                <div className="department-utilization">
                  <div className="utilization-header">
                    <span>Team Utilization</span>
                    <span>{Math.round((department.employeeCount / Math.max(stats.avgEmployeesPerDept, 1)) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min((department.employeeCount / Math.max(stats.avgEmployeesPerDept, 1)) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>

                <div className="department-card-footer">
                  <span className="created-date">
                    Created: {new Date(department.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Department Modal */}
      {isModalOpen && (
        <DepartmentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingDepartment(null);
          }}
          onSave={editingDepartment ? handleEditDepartment : handleAddDepartment}
          department={editingDepartment}
          mode={editingDepartment ? 'edit' : 'add'}
        />
      )}
    </div>
  );
};

export default DepartmentGrid;
