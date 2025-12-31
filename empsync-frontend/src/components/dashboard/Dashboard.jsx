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
    try {
      const backendPromise = empSyncAPI.getAllEmployees().catch(() => null);
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1000));
      
      const result = await Promise.race([backendPromise, timeoutPromise]);
      
      if (result && result.success) {
        setBackendConnected(true);
        processDashboardData(result.employees || []);
      } else {
        setBackendConnected(false);
        const savedEmployees = localStorage.getItem('employees');
        const employees = savedEmployees ? JSON.parse(savedEmployees) : getDefaultEmployees();
        processDashboardData(employees);
      }
    } catch (error) {
      // Silently use fallback data without console logs
      const savedEmployees = localStorage.getItem('employees');
      const employees = savedEmployees ? JSON.parse(savedEmployees) : getDefaultEmployees();
      processDashboardData(employees);
    }
  }, []);

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
      },
      {
        id: 6, name: "Emily Davis", email: "emily@company.com", department: "Sales",
        position: "Sales Representative", status: "Active", joinDate: new Date().toISOString(), salary: 60000
      },
      {
        id: 7, name: "Robert Miller", email: "robert@company.com", department: "IT",
        position: "DevOps Engineer", status: "Active", joinDate: new Date().toISOString(), salary: 80000
      },
      {
        id: 8, name: "Lisa Anderson", email: "lisa@company.com", department: "HR",
        position: "Recruiter", status: "Active", joinDate: new Date().toISOString(), salary: 55000
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
      .slice(0, 6)
      .map(emp => ({
        id: emp.id || Math.random(),
        name: emp.name,
        department: emp.department,
        position: emp.position,
        time: 'Recently Joined',
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

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <div className="dashboard-professional">
      {/* Hero Section - Inspired by Landing Page */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-welcome">
            <h1 className="hero-title">
              Welcome back, <span className="hero-name">{currentUser.name}</span>
            </h1>
            <p className="hero-subtitle">Team overview & workforce analytics</p>
          </div>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.total}</span>
              <span className="hero-label">Total Employees</span>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.active}</span>
              <span className="hero-label">Active Now</span>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.departments}</span>
              <span className="hero-label">Departments</span>
            </div>
            <div className="hero-stat">
              <span className="hero-number">{dashboardData.stats.newHires}</span>
              <span className="hero-label">New Hires</span>
            </div>
          </div>

          <div className="hero-actions">
            <div className="hero-time">
              <span className="time-date">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="time-clock">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="hero-quick-actions">
              <button className="hero-action-btn" onClick={() => navigate('/employees')}>
                <span className="action-icon">➕</span>
                <span className="action-text">Add Employee</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="chart-section-professional">
        <div className="chart-header-professional">
          <div>
            <h2>Department Distribution</h2>
            <span className="chart-subtitle">Team composition overview</span>
          </div>
          <div className="connection-status">
            <span className={`status-indicator ${backendConnected ? 'connected' : 'demo'}`}></span>
            <span className="status-text">
              {backendConnected ? 'Live Data' : 'Demo Mode'}
            </span>
          </div>
        </div>

        <div className="chart-container-professional">
          {dashboardData.departmentStats.length > 0 ? (
            <DepartmentChart data={dashboardData.departmentStats} />
          ) : (
            <div className="no-chart-data">
              <div className="no-data-icon">📊</div>
              <p>No department data available</p>
              <button 
                className="btn btn-primary" 
                onClick={loadDashboardData} 
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load Sample Data'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;