import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../ui/Toast';
import './AttendanceTracker.css';

const AttendanceTracker = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeAttendance, setActiveAttendance] = null;
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('checkIn'); // 'checkIn', 'checkOut', 'markAbsent'
  const { showToast } = useToast();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    
    if (user.id) {
      loadActiveAttendance(user.id);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadActiveAttendance = async (employeeId) => {
    try {
      const result = await attendanceService.getActiveAttendance(employeeId);
      if (result.success && result.hasActiveAttendance) {
        setActiveAttendance(result.attendance);
      } else {
        setActiveAttendance(null);
      }
    } catch (error) {
      console.error('Error loading active attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!currentUser?.id) {
      showToast('Please log in first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await attendanceService.checkIn(currentUser.id, location, notes);
      if (result.success) {
        showToast('Check-in successful!', 'success');
        setActiveAttendance(result.attendance);
        setShowModal(false);
        setLocation('');
        setNotes('');
      } else {
        showToast(result.message || 'Check-in failed', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Check-in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!currentUser?.id) {
      showToast('Please log in first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await attendanceService.checkOut(currentUser.id, location, notes);
      if (result.success) {
        showToast(`Check-out successful! Work hours: ${result.attendance.workHours?.toFixed(2) || 'N/A'}`, 'success');
        setActiveAttendance(null);
        setShowModal(false);
        setLocation('');
        setNotes('');
      } else {
        showToast(result.message || 'Check-out failed', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Check-out failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAbsent = async () => {
    if (!currentUser?.id) {
      showToast('Please log in first', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await attendanceService.markAbsent(currentUser.id, notes);
      if (result.success) {
        showToast('Marked as absent successfully!', 'success');
        setShowModal(false);
        setNotes('');
      } else {
        showToast(result.message || 'Failed to mark absent', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Failed to mark absent', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setLocation('');
    setNotes('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateDuration = (checkInTime) => {
    if (!checkInTime) return '00:00:00';
    
    const checkIn = new Date(checkInTime);
    const now = new Date();
    const diff = now - checkIn;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="attendance-tracker">
      <div className="attendance-header">
        <h2>Attendance Tracker</h2>
        <div className="current-time">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="date-display">{formatDate(currentTime)}</div>
        </div>
      </div>

      <div className="attendance-status">
        <div className="status-card">
          <div className="status-icon">
            {activeAttendance ? (
              <div className="status-indicator active"></div>
            ) : (
              <div className="status-indicator inactive"></div>
            )}
          </div>
          <div className="status-content">
            <h3>
              {activeAttendance ? 'Currently Checked In' : 'Not Checked In'}
            </h3>
            {activeAttendance && (
              <p>
                Check-in: {new Date(activeAttendance.checkIn).toLocaleTimeString()}
                {activeAttendance.location && ` at ${activeAttendance.location}`}
              </p>
            )}
            {activeAttendance && (
              <p className="duration">
                Duration: {calculateDuration(activeAttendance.checkIn)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="attendance-actions">
        {!activeAttendance ? (
          <button 
            className="action-btn check-in-btn"
            onClick={() => openModal('checkIn')}
            disabled={loading}
          >
            <span className="btn-icon">🕐</span>
            Check In
          </button>
        ) : (
          <button 
            className="action-btn check-out-btn"
            onClick={() => openModal('checkOut')}
            disabled={loading}
          >
            <span className="btn-icon">🕑</span>
            Check Out
          </button>
        )}
        
        <button 
          className="action-btn absent-btn"
          onClick={() => openModal('markAbsent')}
          disabled={loading || activeAttendance !== null}
        >
          <span className="btn-icon">📅</span>
          Mark Absent
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {modalType === 'checkIn' && 'Check In'}
                {modalType === 'checkOut' && 'Check Out'}
                {modalType === 'markAbsent' && 'Mark Absent'}
              </h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {(modalType === 'checkIn' || modalType === 'checkOut') && (
                <div className="form-group">
                  <label>Location (Optional)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter any notes"
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn"
                onClick={() => {
                  if (modalType === 'checkIn') handleCheckIn();
                  else if (modalType === 'checkOut') handleCheckOut();
                  else if (modalType === 'markAbsent') handleMarkAbsent();
                }}
                disabled={loading}
              >
                {loading ? 'Processing...' : (
                  modalType === 'checkIn' ? 'Check In' :
                  modalType === 'checkOut' ? 'Check Out' : 'Mark Absent'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
