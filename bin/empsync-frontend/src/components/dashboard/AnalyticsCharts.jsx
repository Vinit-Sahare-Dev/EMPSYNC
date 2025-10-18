// src/components/dashboard/AnalyticsCharts.jsx
import React from 'react';

const AnalyticsCharts = ({ departmentStats, employees }) => {
  // Simple bar chart for department distribution
  const maxCount = Math.max(...departmentStats.map(dept => dept.count), 1);

  return (
    <div className="analytics-charts">
      <h2>Department Distribution</h2>
      <div className="chart-container">
        {departmentStats.length > 0 ? (
          <div className="bar-chart">
            {departmentStats.map((dept, index) => (
              <div key={dept.name} className="bar-item">
                <div className="bar-label">
                  <span>{dept.name}</span>
                  <span className="bar-count">{dept.count}</span>
                </div>
                <div className="bar-track">
                  <div 
                    className="bar-fill"
                    style={{ 
                      width: `${(dept.count / maxCount) * 100}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-chart">
            <p>No department data available</p>
            <small>Add employees to see analytics</small>
          </div>
        )}
      </div>

      {/* Status Distribution */}
      <div className="status-distribution">
        <h3>Employee Status</h3>
        <div className="status-cards">
          <div className="status-card active">
            <span className="status-icon">✅</span>
            <div>
              <div className="status-count">
                {employees.filter(emp => emp.status === 'Active').length}
              </div>
              <div className="status-label">Active</div>
            </div>
          </div>
          <div className="status-card inactive">
            <span className="status-icon">⏸️</span>
            <div>
              <div className="status-count">
                {employees.filter(emp => emp.status === 'Inactive').length}
              </div>
              <div className="status-label">Inactive</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;