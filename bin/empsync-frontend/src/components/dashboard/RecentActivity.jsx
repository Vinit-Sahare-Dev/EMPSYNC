// src/components/dashboard/RecentActivity.jsx
import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="recent-activity">
      <h2>Recent Activity</h2>
      {activities.length > 0 ? (
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-activity">
          <p>No recent activity</p>
          <small>Employee actions will appear here</small>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;