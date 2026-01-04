import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../ui/Toast';
import './AttendanceHistory.css';

const AttendanceHistory = ({ employeeId = null }) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all'
  });
  const [stats, setStats] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const targetEmployeeId = employeeId || user.id;
    
    if (targetEmployeeId) {
      loadAttendanceHistory(targetEmployeeId);
      loadAttendanceStats(targetEmployeeId);
    }
  }, [employeeId]);

  const loadAttendanceHistory = async (empId) => {
    setLoading(true);
    try {
      let result;
      if (filters.startDate && filters.endDate) {
        result = await attendanceService.getEmployeeAttendanceByDateRange(
          empId, 
          filters.startDate, 
          filters.endDate
        );
      } else {
        result = await attendanceService.getEmployeeAttendance(empId);
      }

      if (result.success) {
        let filteredAttendances = result.attendances || [];
        
        if (filters.status !== 'all') {
          filteredAttendances = filteredAttendances.filter(
            attendance => attendance.status === filters.status
          );
        }

        setAttendances(filteredAttendances);
      } else {
        showToast(result.message || 'Failed to load attendance history', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Failed to load attendance history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStats = async (empId) => {
    try {
      const result = await attendanceService.getEmployeeAttendanceStats(empId, 30);
      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error loading attendance stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const targetEmployeeId = employeeId || user.id;
    
    if (targetEmployeeId) {
      loadAttendanceHistory(targetEmployeeId);
    }
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: 'all'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (checkIn, checkOut) => {
    if (!checkIn) return 'N/A';
    
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : new Date();
    const diff = end - start;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Present': { color: '#10b981', icon: '✓' },
      'Absent': { color: '#ef4444', icon: '✗' },
      'Late': { color: '#f59e0b', icon: '⏰' },
      'Half Day': { color: '#8b5cf6', icon: '🕐' }
    };

    const config = statusConfig[status] || { color: '#6b7280', icon: '?' };

    return (
      <span 
        className="status-badge"
        style={{ backgroundColor: config.color }}
      >
        <span className="status-icon">{config.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="attendance-history">
      <div className="history-header">
        <h2>Attendance History</h2>
        
        {stats && (
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-value">{stats.totalDays}</span>
              <span className="stat-label">Total Days</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.averageWorkHours?.toFixed(1) || '0'}</span>
              <span className="stat-label">Avg Hours</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.totalWorkHours?.toFixed(1) || '0'}</span>
              <span className="stat-label">Total Hours</span>
            </div>
          </div>
        )}
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button 
            className="apply-btn"
            onClick={applyFilters}
            disabled={loading}
          >
            Apply Filters
          </button>
          <button 
            className="reset-btn"
            onClick={resetFilters}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="attendance-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading attendance history...</p>
          </div>
        ) : attendances.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No attendance records found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="attendance-table">
            <div className="table-header">
              <div className="header-cell">Date</div>
              <div className="header-cell">Check In</div>
              <div className="header-cell">Check Out</div>
              <div className="header-cell">Duration</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Location</div>
            </div>
            
            {attendances.map((attendance) => (
              <div key={attendance.id} className="table-row">
                <div className="cell date-cell">
                  <div className="date-main">{formatDate(attendance.date)}</div>
                </div>
                
                <div className="cell time-cell">
                  {attendance.checkIn ? (
                    <div className="time-info">
                      <span className="time-value">{formatTime(attendance.checkIn)}</span>
                    </div>
                  ) : (
                    <span className="no-data">-</span>
                  )}
                </div>
                
                <div className="cell time-cell">
                  {attendance.checkOut ? (
                    <div className="time-info">
                      <span className="time-value">{formatTime(attendance.checkOut)}</span>
                    </div>
                  ) : (
                    <span className="no-data">-</span>
                  )}
                </div>
                
                <div className="cell duration-cell">
                  <span className="duration-value">
                    {calculateDuration(attendance.checkIn, attendance.checkOut)}
                  </span>
                  {attendance.workHours && (
                    <span className="hours-detail">
                      ({attendance.workHours.toFixed(2)}h)
                    </span>
                  )}
                </div>
                
                <div className="cell status-cell">
                  {getStatusBadge(attendance.status)}
                </div>
                
                <div className="cell location-cell">
                  {attendance.location ? (
                    <span className="location-value">{attendance.location}</span>
                  ) : (
                    <span className="no-data">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
