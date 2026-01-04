import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { empSyncAPI } from '../../services/apiService';
import { attendanceService } from '../../services/attendanceService';
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
  const [selectedMetric, setSelectedMetric] = useState('total');
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceData, setAttendanceData] = useState({
    todayAttendance: null,
    weeklyStats: { present: 0, absent: 0, late: 0 },
    monthlyStats: { totalDays: 0, averageHours: 0 }
  });
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
        loadAttendanceData();
      } else {
        setBackendConnected(false);
        const saved = localStorage.getItem('employees');
        processDashboardData(saved ? JSON.parse(saved) : getDefaultEmployees());
        loadAttendanceData();
      }
    } catch (error) {
      const saved = localStorage.getItem('employees');
      processDashboardData(saved ? JSON.parse(saved) : getDefaultEmployees());
      loadAttendanceData();
    }
  }, []);

  const loadAttendanceData = async () => {
    try {
      const [todayResult, weeklyResult, monthlyResult] = await Promise.allSettled([
        attendanceService.getActiveAttendance(),
        attendanceService.getAttendanceStats(),
        attendanceService.getAttendanceStats()
      ]);

      if (todayResult.status === 'fulfilled' && todayResult.value.success) {
        setAttendanceData(prev => ({
          ...prev,
          todayAttendance: todayResult.value.attendance
        }));
      }

      if (weeklyResult.status === 'fulfilled' && weeklyResult.value.success) {
        setAttendanceData(prev => ({
          ...prev,
          weeklyStats: weeklyResult.value.stats
        }));
      }

      if (monthlyResult.status === 'fulfilled' && monthlyResult.value.success) {
        setAttendanceData(prev => ({
          ...prev,
          monthlyStats: monthlyResult.value.stats
        }));
      }
    } catch (error) {
      console.error('Failed to load attendance data:', error);
    }
  };

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

  const metricCards = [
    { 
      id: 'total', 
      label: 'Team Members', 
      value: dashboardData.stats.total, 
      icon: '👥', 
      color: '#3B82F6',
      trend: '+12%',
      description: 'Total workforce'
    },
    { 
      id: 'active', 
      label: 'Active Now', 
      value: dashboardData.stats.active, 
      icon: '✨', 
      color: '#10B981',
      trend: '+8%',
      description: 'Currently active'
    },
    { 
      id: 'departments', 
      label: 'Departments', 
      value: dashboardData.stats.departments, 
      icon: '🏢', 
      color: '#F59E0B',
      trend: '+2',
      description: 'Total units'
    },
    { 
      id: 'newHires', 
      label: 'New Hires', 
      value: dashboardData.stats.newHires, 
      icon: '🎯', 
      color: '#8B5CF6',
      trend: '+25%',
      description: 'This month'
    }
  ];

  const quickActions = [
    { icon: '➕', label: 'Add Employee', action: () => navigate('/employees'), color: '#3B82F6' },
    { icon: '📊', label: 'Analytics', action: () => navigate('/analytics'), color: '#10B981' },
    { icon: '⏰', label: 'Check In', action: () => handleCheckIn(), color: '#F59E0B' },
    { icon: '⏱️', label: 'Check Out', action: () => handleCheckOut(), color: '#EF4444' }
  ];

  const handleCheckIn = async () => {
    try {
      const result = await attendanceService.checkIn();
      if (result.success) {
        showToast('success', 'Successfully checked in!');
        loadAttendanceData();
      } else {
        showToast('error', result.message || 'Failed to check in');
      }
    } catch (error) {
      showToast('error', 'Failed to check in. Please try again.');
    }
  };

  const handleCheckOut = async () => {
    try {
      const result = await attendanceService.checkOut();
      if (result.success) {
        showToast('success', 'Successfully checked out!');
        loadAttendanceData();
      } else {
        showToast('error', result.message || 'Failed to check out');
      }
    } catch (error) {
      showToast('error', 'Failed to check out. Please try again.');
    }
  };

  return (
    <div className="dashboard-professional">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="news-ticker">
        <div className="ticker-content">
          <span>🚀 System Update: Employee Database v2.1 is now online.</span>
          <span>📈 Monthly reports are ready for review.</span>
          <span>💡 Tip: Use Quick Navigation for faster accessibility.</span>
          <span>🏢 Welcome to our 5 new team members this week!</span>
        </div>
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            Welcome back, <span className="user-name">{currentUser.name || 'User'}</span> 👋
          </h1>
          <p className="dashboard-subtitle">Here's what's happening with your team today</p>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metricCards.map((metric) => (
          <div 
            key={metric.id}
            className={`metric-card ${selectedMetric === metric.id ? 'active' : ''}`}
            onClick={() => setSelectedMetric(metric.id)}
          >
            <div className="metric-header">
              <div className="metric-icon" style={{ background: metric.color }}>
                {metric.icon}
              </div>
              <div className="metric-trend">
                <span className="trend-value">{metric.trend}</span>
                <span className="trend-arrow">↑</span>
              </div>
            </div>
            <div className="metric-content">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-description">{metric.description}</div>
            </div>
            <div className="metric-sparkline">
              <svg viewBox="0 0 100 20" className="sparkline">
                <polyline
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="2"
                  points="0,15 20,10 40,12 60,8 80,5 100,10"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-btn"
              onClick={action.action}
              style={{ '--action-color': action.color }}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
              <div className="action-ripple"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        <div className="dashboard-left-column">
          {/* Recent Activity */}
          <div className="recent-employees-professional">
            <div className="section-header">
              <h2>Recent Activity</h2>
              <div className="activity-filter">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">New</button>
                <button className="filter-btn">Updated</button>
              </div>
            </div>
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
                    <div className="activity-time">2 hours ago</div>
                  </div>
                  <div className="employee-status">
                    <div className={`status-dot ${emp.status === 'Active' ? 'active' : 'inactive'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Chart */}
          <div className="chart-section-professional">
            <div className="chart-header-flex">
              <h2>Department Distribution</h2>
              <div className="chart-controls">
                <button className="chart-control-btn active">Bar</button>
                <button className="chart-control-btn">Pie</button>
                <div className={`status-badge-mini ${backendConnected ? 'live' : 'offline'}`}>
                  {backendConnected ? 'Live' : 'Cached'}
                </div>
              </div>
            </div>
            <div className="chart-container">
              <div className="custom-bar-chart">
                {dashboardData.departmentStats.map((dept, index) => (
                  <div key={dept.name} className="chart-row">
                    <div className="row-label">
                      <span>{dept.name}</span>
                      <span className="row-count">{dept.count}</span>
                    </div>
                    <div className="row-track">
                      <div 
                        className="row-fill" 
                        style={{ 
                          width: `${dept.percentage}%`, 
                          background: dept.color,
                          animationDelay: `${index * 0.1}s`
                        }} 
                      />
                    </div>
                    <div className="row-percentage">{dept.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right-column">
          {/* Attendance Overview */}
          <div className="attendance-overview-card">
            <h3>Today's Attendance</h3>
            <div className="attendance-status">
              {attendanceData.todayAttendance ? (
                <div className="attendance-active">
                  <div className="status-icon">✓</div>
                  <div className="status-info">
                    <span className="status-text">Checked In</span>
                    <span className="check-time">
                      {attendanceData.todayAttendance.checkIn ? 
                        new Date(attendanceData.todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 
                        'Loading...'
                      }
                    </span>
                  </div>
                </div>
              ) : (
                <div className="attendance-inactive">
                  <div className="status-icon">○</div>
                  <div className="status-info">
                    <span className="status-text">Not Checked In</span>
                    <span className="check-time">Ready to check in</span>
                  </div>
                </div>
              )}
            </div>
            <div className="attendance-stats">
              <div className="stat-item">
                <span className="stat-number">{attendanceData.weeklyStats.present}</span>
                <span className="stat-label">Present</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{attendanceData.weeklyStats.absent}</span>
                <span className="stat-label">Absent</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{attendanceData.weeklyStats.late}</span>
                <span className="stat-label">Late</span>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="performance-card">
            <h3>Performance Overview</h3>
            <div className="performance-metrics">
              <div className="performance-item">
                <div className="performance-label">Productivity</div>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="performance-value">85%</div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Attendance</div>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: '92%' }}></div>
                </div>
                <div className="performance-value">92%</div>
              </div>
              <div className="performance-item">
                <div className="performance-label">Satisfaction</div>
                <div className="performance-bar">
                  <div className="performance-fill" style={{ width: '78%' }}></div>
                </div>
                <div className="performance-value">78%</div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="events-card">
            <h3>Upcoming Events</h3>
            <div className="events-list">
              <div className="event-item">
                <div className="event-date">
                  <div className="date-day">15</div>
                  <div className="date-month">JAN</div>
                </div>
                <div className="event-content">
                  <h4>Team Meeting</h4>
                  <p>Quarterly review and planning</p>
                  <div className="event-time">10:00 AM</div>
                </div>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <div className="date-day">20</div>
                  <div className="date-month">JAN</div>
                </div>
                <div className="event-content">
                  <h4>Training Session</h4>
                  <p>New software onboarding</p>
                  <div className="event-time">2:00 PM</div>
                </div>
              </div>
              <div className="event-item">
                <div className="event-date">
                  <div className="date-day">25</div>
                  <div className="date-month">JAN</div>
                </div>
                <div className="event-content">
                  <h4>Team Building</h4>
                  <p>Monthly team activity</p>
                  <div className="event-time">4:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;