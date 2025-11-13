import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { empSyncAPI } from '../../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const testBackendConnection = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8888/api/employees');
      const data = await response.json();
      return true;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    // Prevent multiple simultaneous loads
    if (loading && dataLoaded) return;
    
    setLoading(true);
    try {
      // Test backend connection first
      const isConnected = await testBackendConnection();
      setBackendConnected(isConnected);

      if (isConnected) {
        // Use real backend data
        const response = await empSyncAPI.getAllEmployees();
        
        if (response.success) {
          const employees = response.employees || [];
          processDashboardData(employees);
          
          // Only show toast on first load or manual refresh
          if (!dataLoaded) {
            showToast('success', `Dashboard loaded successfully`);
          }
        }
      } else {
        // Fallback to localStorage data
        console.log('🔄 Using localStorage data as fallback');
        const savedEmployees = localStorage.getItem('employees');
        const employees = savedEmployees ? JSON.parse(savedEmployees) : [];
        processDashboardData(employees);
        
        if (!dataLoaded) {
          showToast('info', 'Using demo data - Backend not connected');
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Final fallback to empty data
      setDashboardData({
        stats: { total: 0, active: 0, departments: 0, newHires: 0 },
        departmentStats: [],
        recentActivity: [],
        employees: []
      });
      
      if (!dataLoaded) {
        showToast('error', 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  }, [testBackendConnection, showToast, loading, dataLoaded]);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (!user) {
      showToast('error', 'Please login first');
      navigate('/login');
      return;
    }

    // Load data only once on component mount
    if (!dataLoaded) {
      loadDashboardData();
    }
  }, [navigate, showToast, loadDashboardData, dataLoaded]);

  const processDashboardData = (employees) => {
    // Calculate stats
    const stats = {
      total: employees.length,
      active: employees.filter(emp => emp.status === 'Active' || emp.status === 'ACTIVE').length,
      departments: [...new Set(employees.map(emp => emp.department).filter(Boolean))].length,
      newHires: employees.filter(emp => {
        const joinDate = new Date(emp.joinDate || emp.createdAt || Date.now());
        return (Date.now() - joinDate) < 30 * 24 * 60 * 60 * 1000;
      }).length
    };

    // Department distribution for pie chart
    const departmentData = employees.reduce((acc, emp) => {
      if (emp.department) {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
      }
      return acc;
    }, {});

    const departmentStats = Object.entries(departmentData).map(([name, count], index) => ({
      name,
      count,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6]
    }));

    // Recent activity - Only get 3 for the 3-box layout
    const recentActivity = employees
      .sort((a, b) => new Date(b.createdAt || b.joinDate || Date.now()) - new Date(a.createdAt || a.joinDate || Date.now()))
      .slice(0, 3)
      .map(emp => ({
        id: emp.id || emp.employeeId || Math.random(),
        name: emp.name,
        department: emp.department,
        position: emp.position || 'Employee',
        time: new Date(emp.createdAt || emp.joinDate || Date.now()).toLocaleDateString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=3B82F6&color=fff&size=64`,
        status: 'active',
        action: 'Joined team'
      }));

    setDashboardData({ stats, departmentStats, recentActivity, employees });
  };

  // Quick Actions
  const quickActions = [
    { id: 'add', icon: '👤', label: 'Add Employee', action: () => navigate('/employees') },
    { id: 'export', icon: '📤', label: 'Export Data', action: () => showToast('success', 'Exporting data...') },
    { id: 'report', icon: '📊', label: 'Generate Report', action: () => showToast('info', 'Generating report...') },
    { id: 'team', icon: '👥', label: 'Team Overview', action: () => showToast('info', 'Showing team overview...') }
  ];

  // Rest of your component remains the same...
  // [PieChart component and JSX structure]

  if (loading && !dataLoaded) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Your existing JSX */}
    </div>
  );
};

export default Dashboard;