// src/components/dashboard/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { empSyncAPI } from '../../services/apiService';
import '../../styles/Analytics.css';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    departmentStats: [],
    genderDistribution: [],
    salaryStats: {
      average: 0,
      highest: 0,
      lowest: 0,
      total: 0,
      monthly: 0
    },
    employeeCount: 0,
    activeEmployees: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading analytics data...');
      
      const response = await empSyncAPI.getAllEmployees();
      const employees = response.employees || response || [];
      
      console.log(`📊 Processing ${employees.length} employees for analytics`);
      const stats = calculateAnalytics(employees);
      setAnalyticsData(stats);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      // Fallback to localStorage
      try {
        const savedEmployees = localStorage.getItem('employees');
        const employees = savedEmployees ? JSON.parse(savedEmployees) : [];
        console.log('🔄 Using localStorage data for analytics');
        const stats = calculateAnalytics(employees);
        setAnalyticsData(stats);
        setLastUpdated(new Date());
      } catch (localError) {
        console.error('Local storage fallback failed:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (employees) => {
    if (!employees || employees.length === 0) {
      return {
        departmentStats: [],
        genderDistribution: [],
        salaryStats: {
          average: 0,
          highest: 0,
          lowest: 0,
          total: 0,
          monthly: 0
        },
        employeeCount: 0,
        activeEmployees: 0
      };
    }

    // Salary calculations
    let totalSalary = 0;
    let highestSalary = 0;
    let lowestSalary = employees[0]?.salary || 0;
    let activeEmployees = 0;
    
    // Department and gender tracking
    const departmentMap = {};
    const genderMap = {};

    employees.forEach(employee => {
      // Parse salary - handle different formats
      const salary = parseFloat(employee.salary) || 0;
      const isActive = employee.status === 'Active' || employee.status === 'ACTIVE';
      
      // Update salary stats
      totalSalary += salary;
      if (salary > highestSalary) highestSalary = salary;
      if (salary < lowestSalary || lowestSalary === 0) lowestSalary = salary;

      // Count active employees
      if (isActive) activeEmployees++;

      // Department stats
      const dept = employee.department || 'Unassigned';
      if (!departmentMap[dept]) {
        departmentMap[dept] = {
          count: 0,
          totalSalary: 0,
          active: 0,
          avgSalary: 0
        };
      }
      departmentMap[dept].count++;
      departmentMap[dept].totalSalary += salary;
      if (isActive) departmentMap[dept].active++;

      // Gender stats
      const gender = employee.gender || 'Not Specified';
      genderMap[gender] = (genderMap[gender] || 0) + 1;
    });

    // Calculate averages and format department stats
    const departmentStats = Object.entries(departmentMap).map(([name, data]) => ({
      name,
      employeeCount: data.count,
      activeEmployees: data.active,
      avgSalary: Math.round(data.count > 0 ? data.totalSalary / data.count : 0),
      totalBudget: data.totalSalary,
      utilization: Math.round((data.active / data.count) * 100)
    }));

    // Format gender distribution
    const genderDistribution = Object.entries(genderMap).map(([gender, count]) => ({
      gender,
      count,
      percentage: Math.round((count / employees.length) * 100)
    }));

    const averageSalary = employees.length > 0 ? Math.round(totalSalary / employees.length) : 0;
    const monthlyPayroll = Math.round(totalSalary / 12);

    return {
      departmentStats: departmentStats.sort((a, b) => b.employeeCount - a.employeeCount),
      genderDistribution,
      salaryStats: {
        average: averageSalary,
        highest: highestSalary,
        lowest: lowestSalary,
        total: totalSalary,
        monthly: monthlyPayroll
      },
      employeeCount: employees.length,
      activeEmployees
    };
  };


  const formatRupees = (amount) => {
    if (amount === 0) return '0';
    
 
    if (amount >= 10000000) { // 1 Crore
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) { // 1 Lakh
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) { // 1 Thousand
      return `₹${(amount / 1000).toFixed(1)}K`;
    } else {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
  };


  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner">📊</div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Employee Analytics Dashboard</h1>
          <p>Real-time insights and salary statistics in Indian Rupees</p>
          {lastUpdated && (
            <div className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>
        <div className="analytics-controls">
          <button onClick={loadAnalyticsData} className="refresh-btn">
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>TOTAL EMPLOYEES</h3>
            <div className="metric-value">{formatNumber(analyticsData.employeeCount)}</div>
            <div className="metric-change">
              {formatNumber(analyticsData.activeEmployees)} active ({analyticsData.employeeCount > 0 ? 
                Math.round((analyticsData.activeEmployees / analyticsData.employeeCount) * 100) : 0}%)
            </div>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>AVERAGE SALARY</h3>
            <div className="metric-value">{formatRupees(analyticsData.salaryStats.average)}</div>
            <div className="metric-change">Per employee per year</div>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">📈</div>
          <div className="metric-content">
            <h3>TOTAL PAYROLL</h3>
            <div className="metric-value">{formatRupees(analyticsData.salaryStats.monthly)}</div>
            <div className="metric-change">Monthly expenditure</div>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-icon">🏢</div>
          <div className="metric-content">
            <h3>DEPARTMENTS</h3>
            <div className="metric-value">{formatNumber(analyticsData.departmentStats.length)}</div>
            <div className="metric-change">Active departments</div>
          </div>
        </div>
      </div>

      {/* Salary Statistics Section */}
      <div className="section">
        <h2>Salary Statistics (Indian Rupees)</h2>
        <div className="salary-stats">
          <div className="salary-card">
            <div className="salary-icon">📊</div>
            <div className="salary-content">
              <h4>AVERAGE SALARY</h4>
              <div className="salary-amount">{formatRupees(analyticsData.salaryStats.average)}</div>
              <p>Per employee per year</p>
            </div>
          </div>
          
          <div className="salary-card">
            <div className="salary-icon">🚀</div>
            <div className="salary-content">
              <h4>HIGHEST SALARY</h4>
              <div className="salary-amount">{formatRupees(analyticsData.salaryStats.highest)}</div>
              <p>Top earner in company</p>
            </div>
          </div>
          
          <div className="salary-card">
            <div className="salary-icon">📉</div>
            <div className="salary-content">
              <h4>LOWEST SALARY</h4>
              <div className="salary-amount">{formatRupees(analyticsData.salaryStats.lowest)}</div>
              <p>Starting level salary</p>
            </div>
          </div>
          
          <div className="salary-card">
            <div className="salary-icon">💼</div>
            <div className="salary-content">
              <h4>ANNUAL PAYROLL</h4>
              <div className="salary-amount">{formatRupees(analyticsData.salaryStats.total)}</div>
              <p>Total company payroll</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="section">
        <h2>Department Performance</h2>
        {analyticsData.departmentStats.length === 0 ? (
          <div className="no-data">
            <p>No department data available. Add employees with departments to see analytics.</p>
          </div>
        ) : (
          <div className="department-grid">
            {analyticsData.departmentStats.map((dept) => (
              <div key={dept.name} className="department-card">
                <div className="dept-header">
                  <h3>{dept.name}</h3>
                  <span className="employee-count">{formatNumber(dept.employeeCount)} employees</span>
                </div>
                
                <div className="dept-metrics">
                  <div className="dept-metric">
                    <span className="label">Active:</span>
                    <span className="value">{formatNumber(dept.activeEmployees)}</span>
                  </div>
                  <div className="dept-metric">
                    <span className="label">Avg Salary:</span>
                    <span className="value">{formatRupees(dept.avgSalary)}</span>
                  </div>
                  <div className="dept-metric">
                    <span className="label">Total Budget:</span>
                    <span className="value">{formatRupees(dept.totalBudget)}</span>
                  </div>
                </div>

                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${dept.utilization}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{dept.utilization}% utilization</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="auto-update-notice">
        <p>💡 <strong>Live Data:</strong> Analytics update automatically every 30 seconds</p>
      </div>
    </div>
  );
};

export default Analytics;