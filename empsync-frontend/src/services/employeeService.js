// services/employeeService.js
import { localStorageService } from './localStorageService';
import { empSyncAPI } from './apiService';

export const employeeService = {
  // Create employee in both localStorage and backend
  createEmployee: async (employeeData) => {
    try {
      // 1. Save to localStorage immediately
      const localSuccess = localStorageService.addEmployee(employeeData);
      
      // 2. Try to sync with backend
      let backendSuccess = false;
      try {
        await empSyncAPI.createSync(employeeData);
        backendSuccess = true;
        console.log('✅ Employee synced with backend');
      } catch (error) {
        console.warn('⚠️ Backend sync failed, data saved locally only', error);
      }
      
      return { localSuccess, backendSuccess };
    } catch (error) {
      console.error('🔴 Create failed:', error);
      throw error;
    }
  },

  // Update employee in both places
  updateEmployee: async (id, employeeData) => {
    try {
      // 1. Update localStorage
      const localSuccess = localStorageService.updateEmployee(id, employeeData);
      
      // 2. Try to sync with backend
      let backendSuccess = false;
      try {
        await empSyncAPI.updateSync(id, employeeData);
        backendSuccess = true;
        console.log('✅ Employee updated in backend');
      } catch (error) {
        console.warn('⚠️ Backend update failed, data updated locally only', error);
      }
      
      return { localSuccess, backendSuccess };
    } catch (error) {
      console.error('🔴 Update failed:', error);
      throw error;
    }
  },

  // Delete from both places
  deleteEmployee: async (id) => {
    try {
      // 1. Delete from localStorage
      const localSuccess = localStorageService.deleteEmployee(id);
      
      // 2. Try to delete from backend
      let backendSuccess = false;
      try {
        await empSyncAPI.deleteSync(id);
        backendSuccess = true;
        console.log('✅ Employee deleted from backend');
      } catch (error) {
        console.warn('⚠️ Backend delete failed, data deleted locally only', error);
      }
      
      return { localSuccess, backendSuccess };
    } catch (error) {
      console.error('🔴 Delete failed:', error);
      throw error;
    }
  },

  // Sync all local data with backend
  syncAllWithBackend: async () => {
    try {
      const localEmployees = localStorageService.getEmployees();
      let syncedCount = 0;
      
      for (const employee of localEmployees) {
        try {
          // Check if employee exists in backend, if not create it
          await empSyncAPI.createSync(employee);
          syncedCount++;
        } catch (error) {
          console.warn(`⚠️ Failed to sync employee ${employee.id}:`, error);
        }
      }
      
      console.log(`✅ Synced ${syncedCount}/${localEmployees.length} employees with backend`);
      return syncedCount;
    } catch (error) {
      console.error('🔴 Bulk sync failed:', error);
      throw error;
    }
  }
};