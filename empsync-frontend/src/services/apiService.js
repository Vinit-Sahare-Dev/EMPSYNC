import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/employees';

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
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('🔴 EmpSync API Error:', error.response?.data);
        return Promise.reject({
          message: error.response?.data?.message || 'Sync failed. Please try again.',
          status: error.response?.status
        });
      }
    );
  }

  async syncEmployees() {
    const response = await this.client.get('/');
    return response.data;
  }

  async syncEmployeeById(id) {
    const response = await this.client.get(`/${id}`);
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

  async partialSync(id, updates) {
    const response = await this.client.patch(`/${id}`, updates);
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