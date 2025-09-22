package com.spring.restapi.service;

import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    public Employee saveEmployee(Employee employee) {
        // Calculate bonus, PF, and tax before saving
        calculateEmployeeDeductions(employee);
        return employeeRepository.save(employee);
    }
    
   
    public void deleteEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }
    
    private void calculateEmployeeDeductions(Employee employee) {
        Double salary = employee.getSalary();
        
        // Calculate bonus (10% of salary)
        Double bonus = salary * 0.10;
        employee.setBonus(bonus);
        
        // Calculate PF (12% of salary)
        Double pf = salary * 0.12;
        employee.setPf(pf);
        
        // Calculate tax based on salary brackets
        Double tax = calculateTax(salary);
        employee.setTax(tax);
    }
    
    private Double calculateTax(Double salary) {
        if (salary <= 250000) {
            return 0.0;
        } else if (salary <= 500000) {
            return (salary - 250000) * 0.05;
        } else if (salary <= 1000000) {
            return 12500 + (salary - 500000) * 0.20;
        } else {
            return 112500 + (salary - 1000000) * 0.30;
        }
    }
    
    public List<Employee> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        // Ensure calculations are done for all retrieved employees
        employees.forEach(this::calculateEmployeeDeductions);
        return employees;
    }
    
    public Optional<Employee> getEmployeeById(Long id) {
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        employeeOpt.ifPresent(this::calculateEmployeeDeductions);
        return employeeOpt;
    }
    
    public List<Employee> getEmployeesByDepartment(String department) {
        List<Employee> employees = employeeRepository.findByDepartment(department);
        employees.forEach(this::calculateEmployeeDeductions);
        return employees;
    }
    
    public List<Employee> getEmployeesByGender(String gender) {
        List<Employee> employees = employeeRepository.findByGender(gender);
        employees.forEach(this::calculateEmployeeDeductions);
        return employees;
    }
}