// src/components/employee/EmployeeDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useToast } from '../ui/Toast';
import './EmployeeDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api';

const EmployeeDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      // Fetch employee data by email or employeeId
      const response = await fetch(`${API_BASE_URL}/employees/search/name?name=${user.name}`);
      const data = await response.json();

      if (data.success && data.employees && data.employees.length > 0) {
        setEmployeeData(data.employees[0]);
      } else {
        showToast('info', 'Complete your profile to see full details');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      showToast('error', 'Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="employee-overview">
      <div className="welcome-section">
        <h2>Welcome back, {user.name}! 👋</h2>
        <p>Here's your employee dashboard overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>Days Present</h3>
            <p className="stat-value">22</p>
            <span className="stat-label">This Month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>Working Hours</h3>
            <p className="stat-value">176</p>
            <span className="stat-label">This Month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>Tasks Completed</h3>
            <p className="stat-value">45</p>
            <span className="stat-label">This Month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Salary</h3>
            <p className="stat-value">
              {employeeData ? `₹${employeeData.salary.toLocaleString()}` : 'N/A'}
            </p>
            <span className="stat-label">Monthly</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => setActiveTab('profile')}>
            <span className="action-icon">👤</span>
            View Profile
          </button>
          <button className="action-btn">
            <span className="action-icon">📝</span>
            Apply Leave
          </button>
          <button className="action-btn">
            <span className="action-icon">💵</span>
            View Payslip
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            Performance
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p className="activity-title">Attendance Marked</p>
              <p className="activity-time">Today, 9:00 AM</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📄</div>
            <div className="activity-content">
              <p className="activity-title">Document Submitted</p>
              <p className="activity-time">Yesterday, 3:30 PM</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🎯</div>
            <div className="activity-content">
              <p className="activity-title">Task Completed</p>
              <p className="activity-time">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="employee-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-text">{user.name.charAt(0)}</span>
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-role">{employeeData?.position || 'Employee'}</p>
          <p className="profile-dept">{employeeData?.department || 'Not Assigned'}</p>
        </div>
      </div>

      <div className="profile-details">
        <h3>Personal Information</h3>
        <div className="details-grid">
          <div className="detail-item">
            <label>Username</label>
            <p>{user.username}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>{employeeData?.email || 'Not available'}</p>
          </div>
          <div className="detail-item">
            <label>Employee ID</label>
            <p>{employeeData?.id ? `EMP${String(employeeData.id).padStart(4, '0')}` : 'N/A'}</p>
          </div>
          <div className="detail-item">
            <label>Phone</label>
            <p>{employeeData?.phone || 'Not available'}</p>
          </div>
          <div className="detail-item">
            <label>Department</label>
            <p>{employeeData?.department || 'Not assigned'}</p>
          </div>
          <div className="detail-item">
            <label>Position</label>
            <p>{employeeData?.position || 'Not assigned'}</p>
          </div>
          <div className="detail-item">
            <label>Join Date</label>
            <p>{employeeData?.joinDate || 'Not available'}</p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p className={`status-badge ${employeeData?.status?.toLowerCase()}`}>
              {employeeData?.status || 'Active'}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-details">
        <h3>Salary Information</h3>
        <div className="details-grid">
          <div className="detail-item">
            <label>Basic Salary</label>
            <p className="salary-amount">
              {employeeData?.salary ? `₹${employeeData.salary.toLocaleString()}` : 'N/A'}
            </p>
          </div>
          <div className="detail-item">
            <label>Bonus</label>
            <p className="salary-amount">
              {employeeData?.bonus ? `₹${employeeData.bonus.toLocaleString()}` : '₹0'}
            </p>
          </div>
          <div className="detail-item">
            <label>PF Deduction</label>
            <p className="salary-amount deduction">
              {employeeData?.pf ? `₹${employeeData.pf.toLocaleString()}` : '₹0'}
            </p>
          </div>
          <div className="detail-item">
            <label>Tax Deduction</label>
            <p className="salary-amount deduction">
              {employeeData?.tax ? `₹${employeeData.tax.toLocaleString()}` : '₹0'}
            </p>
          </div>
        </div>
      </div>

      {employeeData?.address && (
        <div className="profile-details">
          <h3>Address</h3>
          <p className="address-text">{employeeData.address}</p>
        </div>
      )}
    </div>
  );

  const renderAttendance = () => (
    <div className="employee-attendance">
      <h2>Attendance Record</h2>
      <div className="attendance-summary">
        <div className="summary-card">
          <h4>Present Days</h4>
          <p className="summary-value present">22</p>
        </div>
        <div className="summary-card">
          <h4>Absent Days</h4>
          <p className="summary-value absent">2</p>
        </div>
        <div className="summary-card">
          <h4>Leave Days</h4>
          <p className="summary-value leave">1</p>
        </div>
        <div className="summary-card">
          <h4>Attendance %</h4>
          <p className="summary-value">91.7%</p>
        </div>
      </div>

      <div className="attendance-calendar">
        <p className="coming-soon">📅 Calendar view coming soon...</p>
      </div>
    </div>
  );

  const renderLeaves = () => (
    <div className="employee-leaves">
      <h2>Leave Management</h2>
      <div className="leave-balance">
        <h3>Leave Balance</h3>
        <div className="balance-grid">
          <div className="balance-card">
            <p className="balance-type">Annual Leave</p>
            <p className="balance-value">12 days</p>
          </div>
          <div className="balance-card">
            <p className="balance-type">Sick Leave</p>
            <p className="balance-value">5 days</p>
          </div>
          <div className="balance-card">
            <p className="balance-type">Casual Leave</p>
            <p className="balance-value">3 days</p>
          </div>
        </div>
      </div>

      <div className="leave-history">
        <h3>Leave History</h3>
        <p className="coming-soon">No leave records yet</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="employee-dashboard loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>🏢 Employee Portal</h1>
          <p className="header-subtitle">Welcome, {user.name}</p>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span>📊</span> Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span>👤</span> My Profile
        </button>
        <button
          className={`nav-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          <span>📅</span> Attendance
        </button>
        <button
          className={`nav-btn ${activeTab === 'leaves' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaves')}
        >
          <span>🏖️</span> Leaves
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'attendance' && renderAttendance()}
        {activeTab === 'leaves' && renderLeaves()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;