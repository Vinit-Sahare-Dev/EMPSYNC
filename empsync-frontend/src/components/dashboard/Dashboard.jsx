import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { empSyncAPI } from '../../services/apiService';
import { useToast } from '../ui/Toast';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: { total: 0, active: 0, departments: 0, newHires: 0 },
    departmentStats: [],
    recentActivity: [],
    employees: []
  });
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    try {
      const result = await Promise.race([
        empSyncAPI.getAllEmployees(),
        new Promise(resolve => setTimeout(() => resolve(null), 1500))
      ]);

      if (result && result.success) {
        setBackendConnected(true);
        processDashboardData(result.employees || []);
      } else {
        setBackendConnected(false);
        const saved = localStorage.getItem('employees');
        processDashboardData(saved ? JSON.parse(saved) : getDefaultEmployees());
      }
    } catch (error) {
      const saved = localStorage.getItem('employees');
      processDashboardData(saved ? JSON.parse(saved) : getDefaultEmployees());
    }
  }, []);

  const getDefaultEmployees = () => [
    { id: 1, name: "John Doe", department: "IT", position: "Senior Developer", status: "Active", joinDate: new Date().toISOString() },
    { id: 2, name: "Jane Smith", department: "HR", position: "HR Manager", status: "Active", joinDate: new Date().toISOString() },
    { id: 3, name: "Mike Johnson", department: "Finance", position: "Financial Analyst", status: "Active", joinDate: new Date().toISOString() },
    { id: 4, name: "Sarah Wilson", department: "Marketing", position: "Specialist", status: "Active", joinDate: new Date().toISOString() }
  ];

  const processDashboardData = (employees) => {
    const stats = {
      total: employees.length,
      active: employees.filter(e => e.status === 'Active' || !e.status).length,
      departments: new Set(employees.map(e => e.department)).size,
      newHires: employees.filter(e => {
        const d = new Date(e.joinDate);
        const limit = new Date();
        limit.setDate(limit.getDate() - 30);
        return d > limit;
      }).length
    };

    const deptMap = {};
    employees.forEach(e => {
      const d = e.department || 'Unknown';
      if (!deptMap[d]) deptMap[d] = { count: 0, new: 0 };
      deptMap[d].count++;
      if (new Date(e.joinDate) > new Date(Date.now() - 30 * 86400000)) deptMap[d].new++;
    });

    const deptStats = Object.entries(deptMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6)
      .map(([name, data], i) => ({
        name,
        count: data.count,
        percentage: Math.round((data.count / (employees.length || 1)) * 100),
        new: data.new,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][i]
      }));

    setDashboardData({ stats, departmentStats: deptStats, employees });
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <div className="dashboard-professional">
      <div className="news-ticker">
        <div className="ticker-content">
          <span>🚀 System Update: Employee Database v2.1 is now online.</span>
          <span>📈 Monthly reports are ready for review.</span>
          <span>💡 Tip: Use Quick Navigation for faster accessibility.</span>
          <span>🏢 Welcome to our 5 new team members this week!</span>
        </div>
      </div>

      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-welcome">
            <h1 className="hero-title">Welcome, <span className="hero-name">{currentUser.name || 'User'}</span></h1>
            <p className="hero-subtitle">You have <span className="highlight-text">{dashboardData.stats.newHires} new notifications</span> today.</p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.total}</span>
              <span className="hero-label">Team Members</span>
              <div className="stat-progress"><div className="stat-progress-fill" style={{ width: '75%' }}></div></div>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.active}</span>
              <span className="hero-label">Active Now</span>
              <div className="stat-progress"><div className="stat-progress-fill success" style={{ width: '90%' }}></div></div>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.departments}</span>
              <span className="hero-label">Units</span>
              <div className="stat-progress"><div className="stat-progress-fill warning" style={{ width: '60%' }}></div></div>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.newHires}</span>
              <span className="hero-label">New Hires</span>
              <div className="stat-progress"><div className="stat-progress-fill purple" style={{ width: '40%' }}></div></div>
            </div>
          </div>

          <div className="hero-actions">
            <div className="hero-time">
              <span className="time-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              <span className="time-clock">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="hero-quick-actions">
              <button className="hero-action-btn primary" onClick={() => navigate('/employees')}>
                <span className="btn-icon">+</span> Quick Add
              </button>
              <button className="hero-action-btn secondary" onClick={() => navigate('/analytics')}>
                <span className="btn-icon">📊</span> View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-column">
          <div className="recent-employees-professional">
            <h2>Recent Activity</h2>
            <div className="recent-employees-grid">
              {dashboardData.employees.slice(0, 4).map((emp, i) => (
                <div key={emp.id || i} className="recent-employee-card">
                  <div className="recent-avatar-sm" style={{ background: dashboardData.departmentStats.find(d => d.name === emp.department)?.color || '#3b82f6' }}>
                    {emp.name.charAt(0)}
                  </div>
                  <div className="recent-employee-info">
                    <h4>{emp.name}</h4>
                    <p>{emp.position}</p>
                    <div className="recent-meta-pill">{emp.department}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-section-professional">
            <div className="chart-header-flex">
              <h2>Department Growth</h2>
              <div className={`status-badge-mini ${backendConnected ? 'live' : 'offline'}`}>
                {backendConnected ? 'Live' : 'Cached'}
              </div>
            </div>
            <div className="custom-bar-chart">
              {dashboardData.departmentStats.map(dept => (
                <div key={dept.name} className="chart-row">
                  <div className="row-label"><span>{dept.name}</span><span>{dept.count}</span></div>
                  <div className="row-track"><div className="row-fill" style={{ width: `${dept.percentage}%`, background: dept.color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;