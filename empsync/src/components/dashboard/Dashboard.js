import React, { useState, useEffect } from 'react';
import { empSyncAPI } from '../../services/apiService';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import LoadingSpinner from '../layout/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    byDepartment: {},
    loading: true
  });

  useEffect(() => {
    syncDashboardData();
  }, []);

  const syncDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      const [count, allEmployees] = await Promise.all([
        empSyncAPI.getSyncCount(),
        empSyncAPI.syncEmployees()
      ]);

      const byDepartment = allEmployees.reduce((acc, emp) => {
        acc[emp.department] = (acc[emp.department] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: count,
        byDepartment,
        loading: false
      });
    } catch (error) {
      console.error('🔴 Dashboard sync failed:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (stats.loading) return <LoadingSpinner message="Syncing dashboard..." />;

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1>EmpSync Dashboard</h1>
        <p>Real-time workforce synchronization</p>
      </div>

      <div className="stats-grid">
        <StatsCard 
          title="Total Employees" 
          value={stats.total} 
          icon="👥"
          theme="primary"
        />
        
        {Object.entries(stats.byDepartment).map(([dept, count]) => (
          <StatsCard
            key={dept}
            title={dept}
            value={count}
            icon="🏢"
            theme="secondary"
          />
        ))}
        
        {Object.keys(stats.byDepartment).length === 0 && stats.total > 0 && (
          <StatsCard
            title="All Employees"
            value={stats.total}
            icon="👨‍💼"
            theme="info"
          />
        )}
      </div>

      <QuickActions onDataChange={syncDashboardData} />
    </div>
  );
};

export default Dashboard;