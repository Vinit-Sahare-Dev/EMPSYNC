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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
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
        
        if (employeeRepository.existsByEmail(employee.getEmail())) {
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
        BigDecimal salary = employee.getSalary();
        
        // Calculate bonus (10% of salary)
        BigDecimal bonus = salary.multiply(BigDecimal.valueOf(0.10));
        employee.setBonus(bonus);
        
        // Calculate PF (12% of salary)
        BigDecimal pf = salary.multiply(BigDecimal.valueOf(0.12));
        employee.setPf(pf);
        
        // Calculate tax
        BigDecimal tax = calculateTax(salary);
        employee.setTax(tax);
        
        logger.debug("DEDUCTIONS CALCULATED - Employee: {}, Bonus: {}, PF: {}, Tax: {}", 
                   employee.getName(), bonus, pf, tax);
    }

    private BigDecimal calculateTax(BigDecimal salary) {
        BigDecimal tax = BigDecimal.ZERO;
        
        if (salary.compareTo(BigDecimal.valueOf(250000)) <= 0) {
            tax = BigDecimal.ZERO;
        } else if (salary.compareTo(BigDecimal.valueOf(500000)) <= 0) {
            tax = salary.subtract(BigDecimal.valueOf(250000))
                      .multiply(BigDecimal.valueOf(0.05));
        } else if (salary.compareTo(BigDecimal.valueOf(1000000)) <= 0) {
            tax = BigDecimal.valueOf(12500)
                      .add(salary.subtract(BigDecimal.valueOf(500000))
                      .multiply(BigDecimal.valueOf(0.20)));
        } else {
            tax = BigDecimal.valueOf(112500)
                      .add(salary.subtract(BigDecimal.valueOf(1000000))
                      .multiply(BigDecimal.valueOf(0.30)));
        }
        
        return tax;
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
            employeeRepository.existsByEmail(employeeDetails.getEmail())) {
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
        BigDecimal minSalaryBD = BigDecimal.valueOf(minSalary);
        return employeeRepository.findBySalaryGreaterThan(minSalaryBD);
    }
    
    public List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary) {
        BigDecimal minSalaryBD = BigDecimal.valueOf(minSalary);
        BigDecimal maxSalaryBD = BigDecimal.valueOf(maxSalary);
        return employeeRepository.findBySalaryBetween(minSalaryBD, maxSalaryBD);
    }

    public int getEmployeeCount() {
        logger.info("FETCHING EMPLOYEE COUNT");
        int count = (int) employeeRepository.count();
        logger.info("TOTAL EMPLOYEE COUNT: {}", count);
        return count;
    }

    // Helper method to convert Map to Employee (for API requests)
    public Employee convertMapToEmployee(Map<String, Object> employeeData) {
        Employee employee = new Employee();
        
        if (employeeData.containsKey("name")) {
            employee.setName((String) employeeData.get("name"));
        }
        if (employeeData.containsKey("email")) {
            employee.setEmail((String) employeeData.get("email"));
        }
        if (employeeData.containsKey("phone")) {
            employee.setPhone((String) employeeData.get("phone"));
        }
        if (employeeData.containsKey("department")) {
            employee.setDepartment((String) employeeData.get("department"));
        }
        if (employeeData.containsKey("position")) {
            employee.setPosition((String) employeeData.get("position"));
        }
        if (employeeData.containsKey("salary")) {
            Object salaryObj = employeeData.get("salary");
            if (salaryObj instanceof Number) {
                employee.setSalary(BigDecimal.valueOf(((Number) salaryObj).doubleValue()));
            } else if (salaryObj instanceof String) {
                employee.setSalary(new BigDecimal((String) salaryObj));
            }
        }
        if (employeeData.containsKey("gender")) {
            employee.setGender((String) employeeData.get("gender"));
        }
        if (employeeData.containsKey("joinDate")) {
            Object joinDateObj = employeeData.get("joinDate");
            if (joinDateObj instanceof String) {
                try {
                    employee.setJoinDate(LocalDate.parse((String) joinDateObj));
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD");
                }
            }
        }
        if (employeeData.containsKey("address")) {
            employee.setAddress((String) employeeData.get("address"));
        }
        if (employeeData.containsKey("status")) {
            employee.setStatus((String) employeeData.get("status"));
        }
        
        return employee;
    }
    
    // Create employee from Map (for API requests)
    public Employee createEmployeeFromMap(Map<String, Object> employeeData) {
        Employee employee = convertMapToEmployee(employeeData);
        return saveEmployee(employee);
    }
    
    // Additional utility methods
    public Long getDepartmentCount(String department) {
        return employeeRepository.countByDepartment(department);
    }
    
    public BigDecimal getAverageSalaryByDepartment(String department) {
        BigDecimal avgSalary = employeeRepository.findAverageSalaryByDepartment(department);
        return avgSalary != null ? avgSalary : BigDecimal.ZERO;
    }
    
    // Database connection test method
    public String testDatabaseConnection() {
        try {
            long count = employeeRepository.count();
            List<String> departments = employeeRepository.findDistinctDepartments();
            return String.format("✅ Database connected successfully! Total employees: %d, Departments: %s", 
                               count, departments);
        } catch (Exception e) {
            return "❌ Database connection failed: " + e.getMessage();
        }
    }
    
    // Bulk operations
    public List<Employee> saveAllEmployees(List<Employee> employees) {
        logger.info("BULK SAVING {} EMPLOYEES", employees.size());
        employees.forEach(emp -> {
            if (employeeRepository.existsByEmail(emp.getEmail())) {
                throw new IllegalArgumentException("Employee with email " + emp.getEmail() + " already exists");
            }
            calculateEmployeeDeductions(emp);
        });
        List<Employee> saved = employeeRepository.saveAll(employees);
        logger.info("BULK SAVE COMPLETED - {} EMPLOYEES SAVED SUCCESSFULLY", saved.size());
        return saved;
    }
}