// services/localStorageService.js
const STORAGE_KEY = 'employees_data';

export const localStorageService = {
  // Get all employees from localStorage
  getEmployees: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Save employees to localStorage
  saveEmployees: (employees) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  // Add a single employee
  addEmployee: (employee) => {
    const employees = localStorageService.getEmployees();
    const newEmployee = {
      ...employee,
      id: employee.id || Date.now(), // Generate ID if not provided
      createdAt: new Date().toISOString()
    };
    employees.push(newEmployee);
    return localStorageService.saveEmployees(employees);
  },

  // Update an employee
  updateEmployee: (id, employeeData) => {
    const employees = localStorageService.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = { ...employees[index], ...employeeData, updatedAt: new Date().toISOString() };
      return localStorageService.saveEmployees(employees);
    }
    return false;
  },

  // Delete an employee
  deleteEmployee: (id) => {
    const employees = localStorageService.getEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== id);
    return localStorageService.saveEmployees(filteredEmployees);
  }
};