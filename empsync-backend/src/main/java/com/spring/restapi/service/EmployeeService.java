// src/main/java/com/spring/restapi/service/EmployeeService.java
package com.spring.restapi.service;

import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.EmployeeRepository;
import com.spring.restapi.exception.EmployeeNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Validated
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(@Valid Employee employee) {
        logger.info("SAVING EMPLOYEE - Name: {}, Email: {}, Department: {}, Position: {}, Salary: {}", 
                   employee.getName(), employee.getEmail(), employee.getDepartment(), 
                   employee.getPosition(), employee.getSalary());
        
        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Employee with email " + employee.getEmail() + " already exists");
        }
        
        calculateEmployeeDeductions(employee);
        Employee saved = employeeRepository.save(employee);
        
        logger.info("EMPLOYEE SAVED SUCCESSFULLY - ID: {}, Name: {}, Email: {}", 
                   saved.getId(), saved.getName(), saved.getEmail());
        return saved;
    }

    public void deleteEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("EMPLOYEE NOT FOUND FOR DELETION - ID: {}", id);
                    return new EmployeeNotFoundException("Employee not found with id: " + id);
                });
        
        logger.info("DELETING EMPLOYEE - ID: {}, Name: {}, Email: {}", 
                   id, employee.getName(), employee.getEmail());
        
        employeeRepository.delete(employee);
        
        logger.info("EMPLOYEE DELETED SUCCESSFULLY - ID: {}, Name: {}", id, employee.getName());
    }

    private void calculateEmployeeDeductions(Employee employee) {
        logger.debug("CALCULATING DEDUCTIONS - Employee: {} (ID: {})", employee.getName(), employee.getId());
        Double salary = employee.getSalary();
        
        Double bonus = salary * 0.10;
        employee.setBonus(bonus);
        
        Double pf = salary * 0.12;
        employee.setPf(pf);
        
        Double tax = calculateTax(salary);
        employee.setTax(tax);
        
        logger.debug("DEDUCTIONS CALCULATED - Employee: {}, Bonus: {}, PF: {}, Tax: {}", 
                   employee.getName(), bonus, pf, tax);
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
        logger.info("FETCHING ALL EMPLOYEES");
        List<Employee> employees = employeeRepository.findAll();
        employees.forEach(this::calculateEmployeeDeductions);
        logger.info("FETCHED {} EMPLOYEES", employees.size());
        return employees;
    }

    public Optional<Employee> getEmployeeById(Long id) {
        logger.info("FETCHING EMPLOYEE BY ID: {}", id);
        Optional<Employee> employeeOpt = employeeRepository.findById(id);
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            calculateEmployeeDeductions(employee);
            logger.info("EMPLOYEE FOUND - ID: {}, Name: {}, Email: {}", 
                       employee.getId(), employee.getName(), employee.getEmail());
        } else {
            logger.warn("EMPLOYEE NOT FOUND - ID: {}", id);
        }
        return employeeOpt;
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        logger.info("FETCHING EMPLOYEES BY DEPARTMENT: {}", department);
        List<Employee> employees = employeeRepository.findByDepartment(department);
        employees.forEach(this::calculateEmployeeDeductions);
        logger.info("FETCHED {} EMPLOYEES FROM DEPARTMENT {}", employees.size(), department);
        return employees;
    }

    public List<Employee> getEmployeesByGender(String gender) {
        logger.info("FETCHING EMPLOYEES BY GENDER: {}", gender);
        List<Employee> employees = employeeRepository.findByGender(gender);
        employees.forEach(this::calculateEmployeeDeductions);
        logger.info("FETCHED {} EMPLOYEES WITH GENDER {}", employees.size(), gender);
        return employees;
    }

    public Employee updateEmployee(Long id, @Valid Employee employeeDetails) {
        logger.info("UPDATING EMPLOYEE - ID: {}, New Details - Name: {}, Email: {}, Department: {}, Position: {}", 
                   id, employeeDetails.getName(), employeeDetails.getEmail(), 
                   employeeDetails.getDepartment(), employeeDetails.getPosition());
        
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("EMPLOYEE NOT FOUND FOR UPDATE - ID: {}", id);
                    return new EmployeeNotFoundException("Employee not found with id: " + id);
                });
        
        if (!employee.getEmail().equals(employeeDetails.getEmail()) && 
            employeeRepository.findByEmail(employeeDetails.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Employee with email " + employeeDetails.getEmail() + " already exists");
        }
        
        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhone(employeeDetails.getPhone());
        employee.setSalary(employeeDetails.getSalary());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setPosition(employeeDetails.getPosition());
        employee.setGender(employeeDetails.getGender());
        employee.setJoinDate(employeeDetails.getJoinDate());
        employee.setAddress(employeeDetails.getAddress());
        employee.setStatus(employeeDetails.getStatus());
        
        calculateEmployeeDeductions(employee);
        
        Employee updated = employeeRepository.save(employee);
        
        logger.info("EMPLOYEE UPDATED SUCCESSFULLY - ID: {}, Name: {}, Email: {}", 
                   updated.getId(), updated.getName(), updated.getEmail());
        return updated;
    }
    
    public List<Employee> getEmployeesByStatus(String status) {
        return employeeRepository.findByStatus(status);
    }
    
    public List<Employee> searchEmployeesByName(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<String> getAllDepartments() {
        return employeeRepository.findDistinctDepartments();
    }
    
    public List<String> getAllPositions() {
        return employeeRepository.findDistinctPositions();
    }
    
    public List<Employee> getActiveEmployees() {
        return employeeRepository.findActiveEmployees();
    }

    public Optional<Employee> findByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    public List<Employee> findByDepartmentAndGender(String department, String gender) {
        return employeeRepository.findByDepartmentAndGender(department, gender);
    }
    
    public List<Employee> findBySalaryGreaterThan(Double minSalary) {
        return employeeRepository.findBySalaryGreaterThan(minSalary);
    }
    
    public List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary) {
        return employeeRepository.findBySalaryBetween(minSalary, maxSalary);
    }

    public List<Employee> saveAllEmployees(List<@Valid Employee> employees) {
        logger.info("BULK SAVING {} EMPLOYEES", employees.size());
        employees.forEach(this::calculateEmployeeDeductions);
        List<Employee> saved = employeeRepository.saveAll(employees);
        logger.info("BULK SAVE COMPLETED - {} EMPLOYEES SAVED SUCCESSFULLY", saved.size());
        return saved;
    }

    public int getEmployeeCount() {
        logger.info("FETCHING EMPLOYEE COUNT");
        int count = (int) employeeRepository.count();
        logger.info("TOTAL EMPLOYEE COUNT: {}", count);
        return count;
    }

    public void deleteAllEmployees() {
        logger.info("DELETING ALL EMPLOYEES");
        long count = employeeRepository.count();
        employeeRepository.deleteAll();
        logger.info("ALL {} EMPLOYEES DELETED SUCCESSFULLY", count);
    }

    public Employee partialUpdateEmployee(Long id, Map<String, Object> updates) {
        logger.info("PARTIAL UPDATE EMPLOYEE - ID: {}, Updates: {}", id, updates);
        
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("EMPLOYEE NOT FOUND FOR PARTIAL UPDATE - ID: {}", id);
                    return new EmployeeNotFoundException("Employee not found with id: " + id);
                });
        
        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> employee.setName((String) value);
                case "email" -> {
                    if (!employee.getEmail().equals(value) && 
                        employeeRepository.findByEmail((String) value).isPresent()) {
                        throw new IllegalArgumentException("Employee with email " + value + " already exists");
                    }
                    employee.setEmail((String) value);
                }
                case "salary" -> {
                    employee.setSalary(Double.valueOf(value.toString()));
                    calculateEmployeeDeductions(employee);
                }
                case "department" -> employee.setDepartment((String) value);
                case "position" -> employee.setPosition((String) value);
                case "gender" -> employee.setGender((String) value);
                case "phone" -> employee.setPhone((String) value);
                case "joinDate" -> employee.setJoinDate((String) value);
                case "address" -> employee.setAddress((String) value);
                case "status" -> employee.setStatus((String) value);
                default -> {
                    logger.error("INVALID FIELD UPDATE ATTEMPT - Field: '{}', Value: {}, Employee ID: {}", key, value, id);
                    throw new IllegalArgumentException("Field '" + key + "' is not updatable.");
                }
            }
        });
        
        Employee saved = employeeRepository.save(employee);
        logger.info("PARTIAL UPDATE SUCCESSFUL - ID: {}, Name: {}, Email: {}", 
                   saved.getId(), saved.getName(), saved.getEmail());
        return saved;
    }
}