// services/apiService.js
class EmpSyncAPI {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  async getAllEmployees() {
    const cacheKey = 'employees';
    
    // Return cached data immediately if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Return pending request if exists
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    try {
      // Fast timeout - don't wait more than 2 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const promise = fetch('http://localhost:8888/api/employees', {
        signal: controller.signal,
        credentials: 'include'
      })
        .then(async (response) => {
          clearTimeout(timeoutId);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          this.cache.set(cacheKey, data);
          return data;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          throw error;
        })
        .finally(() => {
          this.pendingRequests.delete(cacheKey);
        });

      this.pendingRequests.set(cacheKey, promise);
      return await promise;

    } catch (error) {
      this.pendingRequests.delete(cacheKey);
      throw error;
    }
  }

  // Other methods remain the same but with faster timeouts
  async healthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      
      const response = await fetch('http://localhost:8888/api/employees', {
        signal: controller.signal,
        credentials: 'include'
      });
      
      clearTimeout(timeoutId);
      return { success: true, status: response.status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export const empSyncAPI = new EmpSyncAPI();