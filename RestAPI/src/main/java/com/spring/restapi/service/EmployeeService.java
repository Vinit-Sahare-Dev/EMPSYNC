package com.spring.restapi.service;

import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.EmployeeRepository;
import com.spring.restapi.exception.EmployeeNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.validation.annotation.Validated; // Add this line
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
@Validated // Activates validation in this service layer
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(@Valid Employee employee) {
        calculateEmployeeDeductions(employee);
        return employeeRepository.save(employee);
    }

    public void deleteEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    private void calculateEmployeeDeductions(Employee employee) {
        Double salary = employee.getSalary();
        Double bonus = salary * 0.10;
        employee.setBonus(bonus);
        Double pf = salary * 0.12;
        employee.setPf(pf);
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

    public Employee updateEmployee(Long id, @Valid Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        employee.setName(employeeDetails.getName());
        employee.setSalary(employeeDetails.getSalary());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setGender(employeeDetails.getGender());
        calculateEmployeeDeductions(employee);
        return employeeRepository.save(employee);
    }

    public List<Employee> saveAllEmployees(List<@Valid Employee> employees) {
        employees.forEach(this::calculateEmployeeDeductions);
        return employeeRepository.saveAll(employees);
    }

    public int getEmployeeCount() {
        return (int) employeeRepository.count();
    }

    public void deleteAllEmployees() {
        employeeRepository.deleteAll();
    }

    public Employee partialUpdateEmployee(Long id, Map<String, Object> updates) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> employee.setName((String) value);
                case "salary" -> {
                    employee.setSalary(Double.valueOf(value.toString()));
                    calculateEmployeeDeductions(employee);
                }
                case "department" -> employee.setDepartment((String) value);
                case "gender" -> employee.setGender((String) value);
                default -> throw new IllegalArgumentException("Field '" + key + "' is not updatable.");
            }
        });
        return employeeRepository.save(employee);
    }
}
