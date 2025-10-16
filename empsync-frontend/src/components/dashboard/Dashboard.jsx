// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import AnalyticsCharts from './AnalyticsCharts';
import RecentActivity from './RecentActivity';
import LoadingSpinner from '../layout/LoadingSpinner';
import { useToast } from '../ui/Toast';
import { empSyncAPI } from '../../services/apiService';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setConnectionStatus('testing');
    
    try {
      console.log('📡 Loading dashboard data from backend...');
      console.log('API Base URL:', empSyncAPI.client.defaults.baseURL);
      
      // Load employees from BACKEND
      const response = await empSyncAPI.getAllEmployees();
      console.log('✅ Backend response received:', response);
      
      if (response.success) {
        setConnectionStatus('connected');
        const employees = response.employees || [];
        console.log(`✅ Loaded ${employees.length} employees for dashboard`);

        // Calculate dashboard stats
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
        const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
        const newHires = employees.filter(emp => {
          const joinDate = new Date(emp.joinDate || emp.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return joinDate > thirtyDaysAgo;
        }).length;

        // Department distribution
        const departmentStats = departments.map(dept => ({
          name: dept,
          count: employees.filter(emp => emp.department === dept).length
        }));

        // Recent activity
        const recentActivity = employees
          .sort((a, b) => new Date(b.createdAt || b.joinDate) - new Date(a.createdAt || a.joinDate))
          .slice(0, 5)
          .map(emp => ({
            id: emp.id,
            type: 'new_employee',
            message: `${emp.name} joined ${emp.department}`,
            time: new Date(emp.createdAt || emp.joinDate).toLocaleDateString(),
            icon: '👤'
          }));

        setDashboardData({
          stats: {
            totalEmployees,
            activeEmployees,
            departments: departments.length,
            newHires
          },
          departmentStats,
          recentActivity,
          employees
        });
        
        showToast('success', `Connected to backend - ${employees.length} employees loaded`);
      } else {
        throw new Error(response.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('❌ Error loading dashboard data from backend:', error);
      setConnectionStatus('failed');
      
      // Fallback to localStorage
      try {
        const savedEmployees = localStorage.getItem('employees');
        const employees = savedEmployees ? JSON.parse(savedEmployees) : [];
        console.log('🔄 Using localStorage fallback for dashboard');
        
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
        const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
        const newHires = employees.filter(emp => {
          const joinDate = new Date(emp.joinDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return joinDate > thirtyDaysAgo;
        }).length;

        const departmentStats = departments.map(dept => ({
          name: dept,
          count: employees.filter(emp => emp.department === dept).length
        }));

        const recentActivity = employees
          .sort((a, b) => new Date(b.createdAt || b.joinDate) - new Date(a.createdAt || a.joinDate))
          .slice(0, 5)
          .map(emp => ({
            id: emp.id,
            type: 'new_employee',
            message: `${emp.name} joined ${emp.department}`,
            time: new Date(emp.createdAt || emp.joinDate).toLocaleDateString(),
            icon: '👤'
          }));

        setDashboardData({
          stats: {
            totalEmployees,
            activeEmployees,
            departments: departments.length,
            newHires
          },
          departmentStats,
          recentActivity,
          employees
        });
        
        showToast('warning', `Using local data (${employees.length} employees) - Backend connection failed`);
      } catch (localError) {
        console.error('Local storage fallback also failed:', localError);
        showToast('error', 'Failed to load dashboard data from both backend and local storage');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add_employee':
        showToast('info', 'Redirecting to employees...');
        navigate('/employees');
        break;
      case 'export_data':
        showToast('success', 'Preparing data export...');
        break;
      case 'generate_report':
        showToast('info', 'Generating report...');
        break;
      case 'team_overview':
        showToast('info', 'Showing team overview...');
        break;
      default:
        showToast('info', `Action: ${action}`);
    }
  };

  if (loading) {
    return (
      <div>
        <LoadingSpinner size="large" text="Loading dashboard..." />
        <div style={{ textAlign: 'center', marginTop: '10px', color: '#666' }}>
          Connection status: {connectionStatus}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Employee Workforce Management</h1>
          <p>Welcome to your dashboard - Overview of your team and operations</p>
          <div style={{ 
            fontSize: '12px', 
            color: connectionStatus === 'connected' ? 'green' : 'orange',
            marginTop: '5px'
          }}>
            Status: {connectionStatus === 'connected' ? '✅ Connected to Backend' : '🔄 Using Local Data'}
          </div>
        </div>
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => handleQuickAction('generate_report')}
          >
            📊 Generate Report
          </button>
          <button 
            className="btn btn-outline" 
            onClick={loadDashboardData}
            style={{ marginLeft: '10px' }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Employees"
          value={dashboardData?.stats.totalEmployees || 0}
          icon="👥"
          theme="primary"
        />
        <StatsCard
          title="Active Employees"
          value={dashboardData?.stats.activeEmployees || 0}
          icon="✅"
          theme="success"
        />
        <StatsCard
          title="Departments"
          value={dashboardData?.stats.departments || 0}
          icon="🏢"
          theme="info"
        />
        <StatsCard
          title="New Hires (30 days)"
          value={dashboardData?.stats.newHires || 0}
          icon="🆕"
          theme="warning"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions onActionClick={handleQuickAction} />

      <div className="dashboard-content">
        {/* Analytics Charts */}
        <div className="dashboard-charts">
          <AnalyticsCharts 
            departmentStats={dashboardData?.departmentStats || []}
            employees={dashboardData?.employees || []}
          />
        </div>

        {/* Recent Activity */}
        <div className="dashboard-activity">
          <RecentActivity activities={dashboardData?.recentActivity || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;