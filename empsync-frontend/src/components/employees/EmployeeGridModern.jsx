// src/components/employees/EmployeeGridModern.jsx
import React, { useState, useEffect } from 'react';
import EmployeeModal from './EmployeeModal';
import EmployeeCard from './EmployeeCard';
import EmployeeTable from './EmployeeTable';
import { empSyncAPI } from '../../services/apiService';
import {
  PlusIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import './EmployeeModern.css';

// Safe toast fallback
const useToastFallback = () => {
  return {
    showToast: (type, message) => {
      console.log(`${type}: ${message}`);
      // Create modern toast notification
      const toast = document.createElement('div');
      toast.className = `toast toast-${type} animate-slide-down`;
      toast.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            ${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">${message}</p>
          </div>
          <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          toast.remove();
        }
      }, 5000);
    }
  };
};

const EmployeeGridModern = ({ view = "grid" }) => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // Backend connection check
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log('🔍 Initializing backend connection...');
        setLoading(true);
        setBackendStatus('checking');

        const health = await empSyncAPI.healthCheck();
        console.log('Health check result:', health);

        if (health.connected) {
          console.log('✅ Backend connected successfully');
          setBackendStatus('connected');
          await loadEmployeesFromBackend();
        } else {
          throw new Error(health.message || 'Backend not available');
        }
      } catch (error) {
        console.error('❌ Backend initialization failed:', error);
        setBackendStatus('disconnected');
        toast.showToast('error', `Backend connection failed: ${error.message}`);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Load employees from backend
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
        // toast.showToast('success', `Loaded ${backendEmployees.length} employees from database`);
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

  // Handle adding new employee
  const handleAddEmployee = async (employeeData) => {
    try {
      console.log('📨 Creating employee via backend API:', employeeData);
      const response = await empSyncAPI.createEmployee(employeeData);
      console.log('Backend create response:', response);

      if (response.success) {
        toast.showToast('success', response.message || 'Employee added successfully to database!');
        setIsModalOpen(false);
        await loadEmployeesFromBackend();
      } else {
        throw new Error(response.message || 'Failed to create employee in database');
      }
    } catch (error) {
      console.error('❌ Error adding employee to backend:', error);
      toast.showToast('error', `Failed to add employee: ${error.message}`);
    }
  };

  // Handle editing employee
  const handleEditEmployee = async (employeeData) => {
    try {
      console.log('📨 Updating employee via backend API:', editingEmployee.id, employeeData);
      const response = await empSyncAPI.updateEmployee(editingEmployee.id, employeeData);
      console.log('Backend update response:', response);

      if (response.success) {
        toast.showToast('success', response.message || 'Employee updated successfully in database!');
        setIsModalOpen(false);
        setEditingEmployee(null);
        await loadEmployeesFromBackend();
      } else {
        throw new Error(response.message || 'Failed to update employee in database');
      }
    } catch (error) {
      console.error('❌ Error updating employee in backend:', error);
      toast.showToast('error', `Failed to update employee: ${error.message}`);
    }
  };

  // Handle deleting employee
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee from the database?')) {
      try {
        console.log('📨 Deleting employee via backend API:', employeeId);
        const response = await empSyncAPI.deleteEmployee(employeeId);

        if (response.success) {
          toast.showToast('success', response.message || 'Employee deleted successfully from database!');
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

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner loading-spinner--large loading-spinner--primary mb-4"></div>
          <p className="text-gray-600">Loading employees from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Employee Hero Section */}
      <div className="employee-hero">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-text">
              <h1 className="hero-title">Employee Navigator</h1>
              <p className="hero-subtitle">Manage your workforce efficiently likewise</p>
            </div>
          </div>

          <div className="hero-actions">
            <div className="hero-section-title">
              <h3 className="section-title">Employee Navigator</h3>
            </div>
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
              
              {backendStatus !== 'connected' && (
                <button
                  onClick={retryBackendConnection}
                  disabled={loading}
                  className="btn btn-outline btn-sm flex items-center gap-2 ml-3"
                >
                  <ArrowPathIcon className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
            <div className="hero-search">
              <input
                type="text"
                placeholder="Search employees by name, email, department, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hero-search-input"
              />
            </div>
            <div className="hero-buttons">
              <button
                onClick={openAddModal}
                disabled={backendStatus !== 'connected'}
                className="btn btn-primary"
              >
                Add Employee
              </button>
              <button className="btn btn-outline">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Employee Statistics Row */}
        <div className="hero-stats">
          <div className="employee-stat-card primary">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{filteredEmployees.length}</h3>
              <p>Total Employees</p>
            </div>
          </div>
          <div className="employee-stat-card success">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{[...new Set(filteredEmployees.map(emp => emp.department))].length}</h3>
              <p>Departments</p>
            </div>
          </div>
          <div className="employee-stat-card info">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{filteredEmployees.filter(emp => emp.status === 'active').length}</h3>
              <p>Active</p>
            </div>
          </div>
          <div className="employee-stat-card warning">
            <div className="stat-icon"></div>
            <div className="stat-content">
              <h3>{filteredEmployees.filter(emp => emp.status === 'inactive').length}</h3>
              <p>Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Error Message */}
      {backendStatus !== 'connected' && (
        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-4 w-4 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-warning-800">⚠️ Backend Connection Required</h3>
              <p className="text-warning-700 text-sm mt-1">
                Cannot connect to the server. Please make sure your backend is running on port 8888.
                Employee data will not be saved or loaded until connection is restored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlusIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {backendStatus === 'connected' ? 'No employees found' : 'Cannot load employees'}
            </h3>
            <p className="text-gray-600 mb-6">
              {backendStatus === 'connected'
                ? (searchTerm 
                  ? 'No employees match your search criteria.' 
                  : 'Add your first employee to get started!')
                : 'Please check your backend connection and retry.'
              }
            </p>
            {backendStatus === 'connected' && (
              <button
                onClick={openAddModal}
                className="btn btn-primary"
              >
                {searchTerm ? 'Clear Search' : 'Add First Employee'}
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className={`employee-view ${view}`}>
            <div className="employee-cards-container">
              {view === "grid" ? (
                <EmployeeCard
                  employees={filteredEmployees}
                  onView={handleViewEmployee}
                  onEdit={openEditModal}
                  onDelete={handleDeleteEmployee}
                  selectedEmployees={selectedEmployees}
                  onSelectionChange={setSelectedEmployees}
                  backendConnected={backendStatus === 'connected'}
                />
              ) : (
                <EmployeeTable
                  employees={filteredEmployees}
                  onView={handleViewEmployee}
                  onEdit={openEditModal}
                  onDelete={handleDeleteEmployee}
                  selectedEmployees={selectedEmployees}
                  onSelectionChange={setSelectedEmployees}
                  backendConnected={backendStatus === 'connected'}
                />
              )}
            </div>
          </div>
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

export default EmployeeGridModern;
