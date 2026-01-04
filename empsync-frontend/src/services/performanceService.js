import { empSyncAPI } from './apiService';

export const performanceService = {
  // Create a new performance review
  createPerformanceReview: async (performanceData) => {
    try {
      const response = await empSyncAPI.post('/performance', performanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create performance review' };
    }
  },

  // Update an existing performance review
  updatePerformanceReview: async (id, performanceData) => {
    try {
      const response = await empSyncAPI.put(`/performance/${id}`, performanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update performance review' };
    }
  },

  // Submit a performance review
  submitPerformanceReview: async (id) => {
    try {
      const response = await empSyncAPI.post(`/performance/${id}/submit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to submit performance review' };
    }
  },

  // Approve a performance review
  approvePerformanceReview: async (id, approverId) => {
    try {
      const response = await empSyncAPI.post(`/performance/${id}/approve`, null, {
        params: { approverId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to approve performance review' };
    }
  },

  // Get performance history for an employee
  getEmployeePerformanceHistory: async (employeeId) => {
    try {
      const response = await empSyncAPI.get(`/performance/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch performance history' };
    }
  },

  // Get reviewer assignments
  getReviewerAssignments: async (reviewerId) => {
    try {
      const response = await empSyncAPI.get(`/performance/reviewer/${reviewerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch reviewer assignments' };
    }
  },

  // Get performance by employee and review period
  getPerformanceByEmployeeAndPeriod: async (employeeId, reviewPeriod) => {
    try {
      const response = await empSyncAPI.get(`/performance/employee/${employeeId}/period/${reviewPeriod}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch performance data' };
    }
  },

  // Get performance by date range
  getPerformanceByDateRange: async (startDate, endDate) => {
    try {
      const response = await empSyncAPI.get('/performance/date-range', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch performance data' };
    }
  },

  // Get pending reviews
  getPendingReviews: async () => {
    try {
      const response = await empSyncAPI.get('/performance/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch pending reviews' };
    }
  },

  // Get upcoming reviews
  getUpcomingReviews: async () => {
    try {
      const response = await empSyncAPI.get('/performance/upcoming');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch upcoming reviews' };
    }
  },

  // Get employee performance statistics
  getEmployeePerformanceStats: async (employeeId) => {
    try {
      const response = await empSyncAPI.get(`/performance/employee/${employeeId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch performance statistics' };
    }
  },

  // Get overall performance statistics
  getOverallPerformanceStats: async () => {
    try {
      const response = await empSyncAPI.get('/performance/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch overall performance statistics' };
    }
  },

  // Add employee comments to a performance review
  addEmployeeComments: async (id, comments) => {
    try {
      const response = await empSyncAPI.post(`/performance/${id}/employee-comments`, { comments });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to add employee comments' };
    }
  },

  // Delete a performance review
  deletePerformanceReview: async (id) => {
    try {
      const response = await empSyncAPI.delete(`/performance/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete performance review' };
    }
  }
};
