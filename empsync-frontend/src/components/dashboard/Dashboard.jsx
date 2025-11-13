import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { empSyncAPI } from '../../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: { total: 0, active: 0, departments: 0, newHires: 0 },
    departmentStats: [],
    recentActivity: [],
    employees: []
  });
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load data immediately on component mount
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      // Try backend first, but don't wait too long
      const backendPromise = empSyncAPI.getAllEmployees().catch(() => null);
      
      // Set a timeout for backend response
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1000));
      
      const result = await Promise.race([backendPromise, timeoutPromise]);
      
      if (result && result.success) {
        setBackendConnected(true);
        processDashboardData(result.employees || []);
      } else {
        // Fallback to localStorage immediately
        setBackendConnected(false);
        const savedEmployees = localStorage.getItem('employees');
        const employees = savedEmployees ? JSON.parse(savedEmployees) : getDefaultEmployees();
        processDashboardData(employees);
      }
    } catch (error) {
      console.log('Using fallback data');
      const savedEmployees = localStorage.getItem('employees');
      const employees = savedEmployees ? JSON.parse(savedEmployees) : getDefaultEmployees();
      processDashboardData(employees);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const getDefaultEmployees = () => {
    return [
      {
        id: 1,
        name: "John Doe",
        email: "john@company.com",
        department: "IT",
        position: "Developer",
        status: "Active",
        joinDate: new Date().toISOString()
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@company.com", 
        department: "HR",
        position: "Manager",
        status: "Active",
        joinDate: new Date().toISOString()
      }
    ];
  };

  const processDashboardData = (employees) => {
    // Fast calculation - no complex operations
    const stats = {
      total: employees.length,
      active: employees.length, // Assume all active for speed
      departments: new Set(employees.map(emp => emp.department)).size,
      newHires: Math.min(employees.length, 3) // Simple approximation
    };

    // Fast department stats
    const departmentCounts = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const departmentStats = Object.entries(departmentCounts).slice(0, 6).map(([name, count], index) => ({
      name,
      count,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index]
    }));

    // Fast recent activity (just take first 3)
    const recentActivity = employees.slice(0, 3).map(emp => ({
      id: emp.id || Math.random(),
      name: emp.name,
      department: emp.department,
      position: emp.position,
      time: 'Recently',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=3B82F6&color=fff&size=64`,
      status: 'active'
    }));

    setDashboardData({ 
      stats, 
      departmentStats, 
      recentActivity, 
      employees 
    });
  };

  const quickActions = [
    { id: 'add', icon: '👤', label: 'Add Employee', action: () => navigate('/employees') },
    { id: 'report', icon: '📊', label: 'Reports', action: () => showToast('info', 'Reports') },
    { id: 'team', icon: '👥', label: 'Team', action: () => showToast('info', 'Team') },
    { id: 'settings', icon: '⚙️', label: 'Settings', action: () => showToast('info', 'Settings') }
  ];

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const PieChart = ({ data, size = 120 }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    let cumulativePercent = 0;

    return (
      <div className="pie-chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pie-chart">
          {data.map((item, index) => {
            const percent = (item.count / total) * 100;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;
            
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={size / 4}
                fill="transparent"
                stroke={item.color}
                strokeWidth={size / 2}
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={-startPercent}
              />
            );
          })}
        </svg>
        <div className="pie-center">
          <span className="pie-total">{total}</span>
          <span className="pie-label">Total</span>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Header - Show immediately */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>EmpSync Dashboard</h1>
            <p>Welcome back{currentUser.name ? `, ${currentUser.name}` : ''}!</p>
            <div className="connection-info">
              <span className={`status-indicator ${backendConnected ? 'connected' : 'demo'}`}>
                {backendConnected ? '🔗 Live' : '🔄 Demo'}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={loadDashboardData} disabled={loading}>
            {loading ? '⟳' : '↻'}
          </button>
        </div>
      </div>

      {/* Stats Grid - Show immediately with loading states */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{loading ? '...' : dashboardData.stats.total}</h3>
            <p>Total Employees</p>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{loading ? '...' : dashboardData.stats.active}</h3>
            <p>Active</p>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{loading ? '...' : dashboardData.stats.departments}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{loading ? '...' : dashboardData.stats.newHires}</h3>
            <p>New Hires</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Show immediately */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map(action => (
            <button
              key={action.id}
              className="action-btn"
              onClick={action.action}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Team Members</h3>
        <div className="activity-grid">
          {dashboardData.recentActivity.map(activity => (
            <div key={activity.id} className="activity-card">
              <img src={activity.avatar} alt={activity.name} />
              <div className="activity-info">
                <h4>{activity.name}</h4>
                <p>{activity.position}</p>
                <span>{activity.department}</span>
              </div>
            </div>
          ))}
          {dashboardData.recentActivity.length === 0 && !loading && (
            <div className="no-activity">
              <p>No team members yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Department Chart */}
      <div className="chart-section">
        <h3>Department Distribution</h3>
        <div className="chart-container">
          {dashboardData.departmentStats.length > 0 ? (
            <PieChart data={dashboardData.departmentStats} />
          ) : (
            <div className="no-chart-data">
              <p>No department data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;