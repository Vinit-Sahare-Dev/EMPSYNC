class EmpSyncAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  async request(endpoint, options = {}) {
    let url = `${this.baseURL}${endpoint}`;
    
    // Handle query parameters
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Handle empty responses
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("API Request Error:", error);
      throw error;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async getAllEmployees() {
    try {
      const data = await this.request('/employees');
      return { success: true, employees: data.employees || data.data || data || [] };
    } catch (error) {
      return { success: false, message: error.message, employees: [] };
    }
  }

  async createEmployee(employeeData) {
    try {
      const data = await this.request('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      return { success: true, employee: data.employee || data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      const data = await this.request(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData),
      });
      return { success: true, employee: data.employee || data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteEmployee(id) {
    try {
      await this.request(`/employees/${id}`, { method: 'DELETE' });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getDepartments() {
    try {
      const data = await this.request('/employees/departments');
      return { success: true, departments: data.departments || data || [] };
    } catch (error) {
      return { success: false, message: error.message, departments: [] };
    }
  }

  async getDepartmentStats() {
    try {
      const data = await this.request('/departments');
      return { success: true, stats: data || [] };
    } catch (error) {
      return { success: false, message: error.message, stats: [] };
    }
  }

  async healthCheck() {
    try {
      await this.request('/employees/test-db');
      return { success: true, connected: true };
    } catch (error) {
      return { success: false, connected: false, message: error.message };
    }
  }
}

export const empSyncAPI = new EmpSyncAPI();