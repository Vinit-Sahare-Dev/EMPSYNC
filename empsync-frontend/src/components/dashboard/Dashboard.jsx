// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../ui/Toast';
import { empSyncAPI } from '../../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await empSyncAPI.getAllEmployees();
      
      if (response.success) {
        const employees = response.employees || [];
        
        // Calculate stats
        const stats = {
          total: employees.length,
          active: employees.filter(emp => emp.status === 'Active').length,
          departments: [...new Set(employees.map(emp => emp.department).filter(Boolean))].length,
          newHires: employees.filter(emp => {
            const joinDate = new Date(emp.joinDate || emp.createdAt);
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
          .sort((a, b) => new Date(b.createdAt || b.joinDate) - new Date(a.createdAt || a.joinDate))
          .slice(0, 3) // Only take 3 for the 3-box layout
          .map(emp => ({
            id: emp.id,
            name: emp.name,
            department: emp.department,
            position: emp.position || 'Employee',
            time: new Date(emp.createdAt || emp.joinDate).toLocaleDateString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=3B82F6&color=fff&size=64`,
            status: 'active',
            action: 'Joined team'
          }));

        setDashboardData({ stats, departmentStats, recentActivity, employees });
        showToast('success', `Loaded ${employees.length} employees`);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fallback data
      setDashboardData({
        stats: { total: 0, active: 0, departments: 0, newHires: 0 },
        departmentStats: [],
        recentActivity: [],
        employees: []
      });
      showToast('error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'add', icon: '👤', label: 'Add Employee', action: () => navigate('/employees') },
    { id: 'export', icon: '📤', label: 'Export Data', action: () => showToast('success', 'Exporting data...') },
    { id: 'report', icon: '📊', label: 'Generate Report', action: () => showToast('info', 'Generating report...') },
    { id: 'team', icon: '👥', label: 'Team Overview', action: () => showToast('info', 'Showing team overview...') }
  ];

  // Pie Chart Component
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
                className="pie-segment"
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Employee Dashboard</h1>
            <p>Welcome back! Here's your team overview</p>
          </div>
          <div className="connection-status">
            <span className="status-dot connected"></span>
            Live Data
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => showToast('info', 'Generating report...')}>
            <span className="btn-icon">📊</span>
            Generate Report
          </button>
          <button className="btn btn-secondary" onClick={loadDashboardData}>
            <span className="btn-icon">🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{dashboardData.stats.total}</h3>
            <p>Total Employees</p>
            <span className="stat-trend positive">+12%</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{dashboardData.stats.active}</h3>
            <p>Active Employees</p>
            <span className="stat-trend positive">+5%</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{dashboardData.stats.departments}</h3>
            <p>Departments</p>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>{dashboardData.stats.newHires}</h3>
            <p>New Hires (30d)</p>
            <span className="stat-trend positive">+3</span>
          </div>
        </div>
      </div>

      {/* Horizontal Recent Activity - 3 Boxes Layout */}
      <div className="recent-activity-horizontal">
        <div className="section-header">
          <div className="section-header-content">
            <h3>Recent Team Members</h3>
            <p className="section-subtitle">Latest additions to your team</p>
          </div>
          {dashboardData.employees.length > 3 && (
            <a href="/employees" className="view-all-link">
              View All
              <span className="btn-icon">→</span>
            </a>
          )}
        </div>
        <div className="activity-three-grid">
          {dashboardData.recentActivity.map(activity => (
            <div key={activity.id} className="activity-horizontal-card">
              <div className="activity-avatar-large">
                <img src={activity.avatar} alt={activity.name} />
              </div>
              <div className="activity-content-horizontal">
                <h4 className="activity-name">{activity.name}</h4>
                <p className="activity-position">{activity.position}</p>
                <p className="activity-department">{activity.department}</p>
                <div className="activity-meta">
                  <div className="activity-time-horizontal">
                    <span className="time-icon">🕒</span>
                    Joined {activity.time}
                  </div>
                  <div className="activity-action">
                    <span className="action-icon">✓</span>
                    {activity.action}
                  </div>
                </div>
                <span className={`activity-status status-${activity.status}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
          {dashboardData.recentActivity.length === 0 && (
            <div className="no-activity-horizontal">
              <span className="no-activity-icon">📋</span>
              <p>No recent team members</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Left Column - Quick Actions */}
        <div className="content-left">
          <div className="actions-card">
            <div className="card-header">
              <h3>Quick Actions</h3>
              <span className="card-subtitle">Manage your team efficiently</span>
            </div>
            <div className="actions-grid-rectangular">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className="action-btn-rectangular"
                  onClick={action.action}
                >
                  <span className="action-icon-rectangular">{action.icon}</span>
                  <span className="action-label-rectangular">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Pie Chart */}
        <div className="content-right">
          <div className="chart-card">
            <div className="card-header">
              <h3>Department Distribution</h3>
              <span className="card-subtitle">Team composition overview</span>
            </div>
            <div className="chart-content">
              <PieChart data={dashboardData.departmentStats} size={160} />
              <div className="chart-legend">
                {dashboardData.departmentStats.map((dept, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: dept.color }}></span>
                    <span className="legend-label">{dept.name}</span>
                    <span className="legend-value">{dept.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;