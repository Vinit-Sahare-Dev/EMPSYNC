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
  const [realTimeInsights, setRealTimeInsights] = useState([]);
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
    startRealTimeInsights();
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const backendPromise = empSyncAPI.getAllEmployees().catch(() => null);
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1000));
      
      const result = await Promise.race([backendPromise, timeoutPromise]);
      
      if (result && result.success) {
        setBackendConnected(true);
        processDashboardData(result.employees || []);
        showToast('success', 'Data refreshed successfully');
      } else {
        setBackendConnected(false);
        const savedEmployees = localStorage.getItem('employees');
        const employees = savedEmployees ? JSON.parse(savedEmployees) : getDefaultEmployees();
        processDashboardData(employees);
        showToast('info', 'Using demo data');
      }
    } catch (error) {
      console.log('Using fallback data');
      const savedEmployees = localStorage.getItem('employees');
      const employees = savedEmployees ? JSON.parse(savedEmployees) : getDefaultEmployees();
      processDashboardData(employees);
    } finally {
      setLoading(false);
    }
  }, [loading, showToast]);

  const startRealTimeInsights = () => {
    const insights = [
      "🚀 IT department leading with 35% growth",
      "⭐ 5 new team members onboarded",
      "📈 Marketing reached 50K impressions",
      "💼 Finance optimized budget by 18%",
      "🎯 Sales exceeded targets by 27%"
    ];
    
    setRealTimeInsights(insights);
    
    const interval = setInterval(() => {
      setRealTimeInsights(prev => {
        const newInsights = [...prev];
        const first = newInsights.shift();
        return [...newInsights, first];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  };

  const getDefaultEmployees = () => {
    return [
      {
        id: 1, name: "John Doe", email: "john@company.com", department: "IT",
        position: "Senior Developer", status: "Active", joinDate: new Date().toISOString(), salary: 85000
      },
      {
        id: 2, name: "Jane Smith", email: "jane@company.com", department: "HR",
        position: "HR Manager", status: "Active", joinDate: new Date().toISOString(), salary: 75000
      },
      {
        id: 3, name: "Mike Johnson", email: "mike@company.com", department: "Finance",
        position: "Financial Analyst", status: "Active", joinDate: new Date().toISOString(), salary: 70000
      },
      {
        id: 4, name: "Sarah Wilson", email: "sarah@company.com", department: "Marketing",
        position: "Marketing Specialist", status: "Active", joinDate: new Date().toISOString(), salary: 65000
      },
      {
        id: 5, name: "David Brown", email: "david@company.com", department: "IT",
        position: "IT Manager", status: "Active", joinDate: new Date().toISOString(), salary: 95000
      }
    ];
  };

  const processDashboardData = (employees) => {
    const stats = {
      total: employees.length,
      active: employees.filter(emp => emp.status === 'Active' || !emp.status).length,
      departments: new Set(employees.map(emp => emp.department)).size,
      newHires: employees.filter(emp => {
        const joinDate = new Date(emp.joinDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate > thirtyDaysAgo;
      }).length
    };

    const departmentData = {};
    employees.forEach(emp => {
      const dept = emp.department || 'Unknown';
      if (!departmentData[dept]) {
        departmentData[dept] = { count: 0, recentHires: 0 };
      }
      departmentData[dept].count++;
      
      const joinDate = new Date(emp.joinDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (joinDate > thirtyDaysAgo) {
        departmentData[dept].recentHires++;
      }
    });

    const departmentStats = Object.entries(departmentData)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6)
      .map(([name, data], index) => ({
        name,
        count: data.count,
        percentage: Math.round((data.count / employees.length) * 100),
        recentHires: data.recentHires,
        growth: Math.floor(10 + Math.random() * 25),
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index]
      }));

    const recentActivity = employees
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
      .slice(0, 3)
      .map(emp => ({
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
    { id: 'insights', icon: '📊', label: 'Live Insights', action: () => showToast('success', 'Showing real-time analytics') },
    { id: 'reports', icon: '📈', label: 'Reports', action: () => showToast('info', 'Generating reports...') },
    { id: 'analytics', icon: '🔍', label: 'Analytics', action: () => showToast('info', 'Opening analytics') }
  ];

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const DepartmentChart = ({ data }) => {
    const maxCount = Math.max(...data.map(dept => dept.count), 1);
    
    return (
      <div className="department-chart">
        <div className="chart-bars">
          {data.map((dept, index) => (
            <div key={dept.name} className="chart-bar-container">
              <div className="bar-info">
                <div className="bar-label">
                  <span className="dept-icon">
                    {dept.name === 'IT' ? '💻' : 
                     dept.name === 'HR' ? '👥' :
                     dept.name === 'Finance' ? '💰' :
                     dept.name === 'Marketing' ? '📢' :
                     dept.name === 'Sales' ? '🎯' : '⚙️'}
                  </span>
                  {dept.name}
                </div>
                <div className="bar-meta">
                  <span className="meta-item">{dept.count} employees</span>
                  {dept.recentHires > 0 && (
                    <span className="meta-item new">+{dept.recentHires} new</span>
                  )}
                </div>
              </div>
              <div className="bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{
                    width: `${(dept.count / maxCount) * 100}%`,
                    backgroundColor: dept.color
                  }}
                >
                  <span className="bar-count">{dept.count}</span>
                </div>
              </div>
              <div className="bar-details">
                <div className="bar-percentage">{dept.percentage}%</div>
                <div className="bar-growth">↑ {dept.growth}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Compact Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <div className="welcome-main">
              <h1>Welcome back{currentUser.name ? `, ${currentUser.name}` : ''}</h1>
              <p className="welcome-subtitle">Team overview & analytics</p>
            </div>
            
            <div className="welcome-stats">
              <div className="welcome-stat">
                <span className="stat-number">{dashboardData.stats.total}</span>
                <span className="stat-label">Employees</span>
              </div>
              <div className="welcome-stat">
                <span className="stat-number">{dashboardData.stats.departments}</span>
                <span className="stat-label">Departments</span>
              </div>
              <div className="welcome-stat">
                <span className="stat-number">{dashboardData.stats.newHires}</span>
                <span className="stat-label">New Hires</span>
              </div>
            </div>

            <div className="insights-ticker">
              <div className="insights-label">Live Insights</div>
              <div className="insights-scroll">
                {realTimeInsights.map((insight, index) => (
                  <div key={index} className="insight-item">{insight}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="connection-status">
            <span className={`status-dot ${backendConnected ? 'connected' : 'demo'}`}></span>
            <span>{backendConnected ? 'Live Data' : 'Demo Mode'}</span>
          </div>
          <button className="btn btn-primary insights-btn" onClick={() => showToast('success', 'Showing insights dashboard')}>
            <span className="btn-icon">📊</span>
            Insights
          </button>
          <button className="btn btn-secondary" onClick={loadDashboardData} disabled={loading}>
            <span className="btn-icon">{loading ? '⟳' : '↻'}</span>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{loading ? '...' : dashboardData.stats.total}</h3>
            <p>Total Employees</p>
            <span className="stat-trend positive">+12%</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{loading ? '...' : dashboardData.stats.active}</h3>
            <p>Active</p>
            <span className="stat-trend positive">+5%</span>
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
            <span className="stat-trend positive">+{dashboardData.stats.newHires}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map(action => (
            <button key={action.id} className="action-btn" onClick={action.action}>
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
        </div>
      </div>

      {/* Department Distribution */}
      <div className="chart-section">
        <div className="chart-header">
          <div>
            <h3>Department Distribution</h3>
            <span className="chart-subtitle">Team composition overview</span>
          </div>
        </div>
        <div className="chart-container">
          {dashboardData.departmentStats.length > 0 ? (
            <DepartmentChart data={dashboardData.departmentStats} />
          ) : (
            <div className="no-chart-data">
              <p>No department data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;