// src/services/apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888/api/employees';

class EmpSyncAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Log all requests
    this.client.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.baseURL + config.url,
          data: config.data
        });
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Log all responses
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Response Success:', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
        return response;
      },
      (error) => {
        console.error('🔴 API Response Error:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url,
          fullError: error
        });
        return Promise.reject(error);
      }
    );
  }

  async syncEmployees() {
    const response = await this.client.get('/');
    return response.data;
  }

  async createSync(employeeData) {
    const response = await this.client.post('/', employeeData);
    return response.data;
  }

  async updateSync(id, employeeData) {
    const response = await this.client.put(`/${id}`, employeeData);
    return response.data;
  }

  async deleteSync(id) {
    await this.client.delete(`/${id}`);
  }

  async syncByDepartment(department) {
    const response = await this.client.get(`/department/${department}`);
    return response.data;
  }

  async syncByGender(gender) {
    const response = await this.client.get(`/gender/${gender}`);
    return response.data;
  }

  async bulkSync(employees) {
    const response = await this.client.post('/bulk', employees);
    return response.data;
  }

  async getSyncCount() {
    const response = await this.client.get('/count');
    return response.data;
  }

  async clearAllSync() {
    await this.client.delete('/all');
  }
}

export const empSyncAPI = new EmpSyncAPI();