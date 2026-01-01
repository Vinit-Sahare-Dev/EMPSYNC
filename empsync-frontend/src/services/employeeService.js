// src/services/employeeService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888/api'; // Your backend port

class EmployeeService {
  // Get all employees
  async getAllEmployees() {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  // Get employee by ID
  async getEmployeeById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create employee');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  // Update employee
  async updateEmployee(id, employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update employee');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Delete employee
  async deleteEmployee(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }

      return await response.text(); // Your backend returns string message
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  // Get employees by department
  async getEmployeesByDepartment(department) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/department/${department}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees by department');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      throw error;
    }
  }

  // Get employees by gender
  async getEmployeesByGender(gender) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/gender/${gender}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees by gender');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees by gender:', error);
      throw error;
    }
  }

  // Get employee count
  async getEmployeeCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/count`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee count');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employee count:', error);
      throw error;
    }
  }

  // Search employee by email
  async searchEmployeeByEmail(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/search?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Employee not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching employee:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/health`);
      if (!response.ok) {
        throw new Error('Backend health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export default new EmployeeService();