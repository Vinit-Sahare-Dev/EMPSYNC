// services/apiService.js
class EmpSyncAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api';
  }

  async request(endpoint, options = {}) {
    try {
      // API debugging can be enabled via localStorage if needed
      if (localStorage.getItem('debug_api') === 'true') {
        console.log(`🔄 API Call: ${options.method || 'GET'} ${this.baseURL}${endpoint}`);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error(`❌ API Request Failed:`, error);
      throw error;
    }
  }

  async getAllEmployees() {
    try {
      const data = await this.request('/employees');
      // Handle different response formats
      return {
        success: true,
        employees: data.employees || data.data || []
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        employees: []
      };
    }
  }

  async createEmployee(employeeData) {
    try {
      const data = await this.request('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      return {
        success: true,
        employee: data.employee || data,
        message: data.message || 'Employee created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      const data = await this.request(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData),
      });
      return {
        success: true,
        employee: data.employee || data,
        message: data.message || 'Employee updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async deleteEmployee(id) {
    try {
      const data = await this.request(`/employees/${id}`, {
        method: 'DELETE',
      });
      return {
        success: true,
        message: data.message || 'Employee deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async healthCheck() {
    try {
      await this.request('/employees');
      return {
        success: true,
        connected: true,
        message: 'Backend connected successfully'
      };
    } catch (error) {
      return {
        success: false,
        connected: false,
        message: error.message
      };
    }
  }
}

export const empSyncAPI = new EmpSyncAPI();