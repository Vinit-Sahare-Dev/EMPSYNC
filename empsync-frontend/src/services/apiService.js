// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888/api';

class EmpSyncAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log('🚀 Making request to:', config.baseURL + config.url);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ Received response:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('🔴 API Error:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.baseURL + error.config?.url,
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
  }

  // ==================== AUTHENTICATION METHODS ====================
  async login(credentials) {
    try {
      console.log('🔐 Attempting login for:', credentials.username);
      const response = await this.client.post('/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async checkAuthStatus() {
    try {
      const response = await this.client.get('/auth/status');
      return response.data;
    } catch (error) {
      console.error('Auth status check failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.client.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // ==================== HEALTH CHECK METHODS ====================
  async healthCheck() {
    try {
      const response = await this.client.get('/employees');
      return {
        success: true,
        message: 'Backend is connected and responding',
        status: response.status,
        data: response.data
      };
    } catch (error) {
      const errorInfo = {
        success: false,
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.baseURL + error.config?.url,
        errorCode: error.code,
        isNetworkError: !error.response,
      };
      
      console.error('🔴 Health Check Failed:', errorInfo);
      return errorInfo;
    }
  }

  // ==================== EMPLOYEE MANAGEMENT METHODS ====================
  async getAllEmployees() {
    const response = await this.client.get('/employees');
    return response.data;
  }

  async createEmployee(employeeData) {
    const response = await this.client.post('/employees', employeeData);
    return response.data;
  }

  async updateEmployee(id, employeeData) {
    const response = await this.client.put(`/employees/${id}`, employeeData);
    return response.data;
  }

  async deleteEmployee(id) {
    const response = await this.client.delete(`/employees/${id}`);
    return response.data;
  }

  async getEmployeesByDepartment(department) {
    const response = await this.client.get(`/employees/department/${department}`);
    return response.data;
  }

  async searchEmployeesByName(name) {
    const response = await this.client.get(`/employees/search/name?name=${encodeURIComponent(name)}`);
    return response.data;
  }

  async getEmployeesByGender(gender) {
    const response = await this.client.get(`/employees/gender/${gender}`);
    return response.data;
  }

  async getEmployeesByStatus(status) {
    const response = await this.client.get(`/employees/status/${status}`);
    return response.data;
  }

  async getActiveEmployees() {
    const response = await this.client.get('/employees/active');
    return response.data;
  }

  async getAllDepartments() {
    const response = await this.client.get('/employees/departments');
    return response.data;
  }

  async getAllPositions() {
    const response = await this.client.get('/employees/positions');
    return response.data;
  }

  async getEmployeeCount() {
    const response = await this.client.get('/employees/count');
    return response.data;
  }

  // ==================== CONNECTION TESTING ====================
  async testConnection() {
    try {
      const response = await axios.get('http://localhost:8888/api/employees', {
        withCredentials: true,
        timeout: 5000
      });
      return {
        success: true,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        status: error.response?.status,
        message: error.message,
        error: error.toString()
      };
    }
  }

  // ==================== LEGACY SYNC METHODS (for compatibility) ====================
  async syncEmployees() {
    return this.getAllEmployees();
  }

  async syncByDepartment(department) {
    return this.getEmployeesByDepartment(department);
  }

  async syncByGender(gender) {
    return this.getEmployeesByGender(gender);
  }

  async createSync(employeeData) {
    return this.createEmployee(employeeData);
  }

  async updateSync(id, employeeData) {
    return this.updateEmployee(id, employeeData);
  }

  async deleteSync(id) {
    return this.deleteEmployee(id);
  }

  // ==================== UTILITY METHODS ====================
  async testAllEndpoints() {
    const endpoints = [
      { name: 'Auth Status', method: this.checkAuthStatus() },
      { name: 'Employees', method: this.getAllEmployees() },
      { name: 'Departments', method: this.getAllDepartments() },
      { name: 'Health Check', method: this.healthCheck() }
    ];

    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const result = await endpoint.method;
        results.push({
          name: endpoint.name,
          status: '✅ Connected',
          data: result
        });
      } catch (error) {
        results.push({
          name: endpoint.name,
          status: '❌ Failed',
          error: error.message
        });
      }
    }

    return results;
  }
}

export const empSyncAPI = new EmpSyncAPI();
export default empSyncAPI;