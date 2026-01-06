import { empSyncAPI } from './apiService';

export const attendanceService = {
  // Check in an employee
  checkIn: async (employeeId, location = null, notes = null) => {
    try {
      const response = await empSyncAPI.post('/attendance/check-in', {
        employeeId,
        location,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Check-in failed' };
    }
  },

  // Check out an employee
  checkOut: async (employeeId, location = null, notes = null) => {
    try {
      const response = await empSyncAPI.post('/attendance/check-out', {
        employeeId,
        location,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Check-out failed' };
    }
  },

  // Get attendance history for an employee
  getEmployeeAttendance: async (employeeId) => {
    try {
      const response = await empSyncAPI.get(`/attendance/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch attendance' };
    }
  },

  // Get active attendance for an employee
  getActiveAttendance: async (employeeId) => {
    try {
      const response = await empSyncAPI.get(`/attendance/employee/${employeeId}/active`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch active attendance' };
    }
  },

  // Get attendance by date range
  getAttendanceByDateRange: async (startDate, endDate) => {
    try {
      const response = await empSyncAPI.get('/attendance/date-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch attendance data' };
    }
  },

  // Get employee attendance by date range
  getEmployeeAttendanceByDateRange: async (employeeId, startDate, endDate) => {
    try {
      const response = await empSyncAPI.get(`/attendance/employee/${employeeId}/date-range`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch employee attendance data' };
    }
  },

  // Get employee attendance statistics
  getEmployeeAttendanceStats: async (employeeId, days = 30) => {
    try {
      const response = await empSyncAPI.get(`/attendance/employee/${employeeId}/stats`, {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch attendance statistics' };
    }
  },

  // Get attendance stats (alias for getOverallAttendanceStats for compatibility)
  getAttendanceStats: async (days = 30) => {
    return attendanceService.getOverallAttendanceStats(days);
  },

  // Get overall attendance statistics
  getOverallAttendanceStats: async (days = 30) => {
    try {
      const response = await empSyncAPI.get('/attendance/stats', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch overall attendance statistics' };
    }
  },

  // Mark employee as absent
  markAbsent: async (employeeId, notes = null) => {
    try {
      const response = await empSyncAPI.post('/attendance/mark-absent', {
        employeeId,
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to mark absent' };
    }
  },

  // Get all active attendances
  getAllActiveAttendances: async () => {
    try {
      const response = await empSyncAPI.get('/attendance/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch active attendances' };
    }
  }
};
