package com.spring.restapi.service;

import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.EmployeeRepository;
import com.spring.restapi.exception.EmployeeNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Validated
@Transactional(readOnly = true)
public class EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public Employee saveEmployee(@Valid Employee employee) {
        logger.info("💾 Saving new employee: {}", employee.getEmail());
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            logger.warn("⚠️ Email already exists: {}", employee.getEmail());
            throw new IllegalArgumentException("Email already exists: " + employee.getEmail());
        }
        calculateDeductions(employee);
        Employee saved = employeeRepository.save(employee);
        logger.info("✅ Employee saved with ID: {}", saved.getId());
        return saved;
    }

    @Transactional
    public void deleteEmployeeById(Long id) {
        logger.info("🗑️ Deleting employee ID: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("⚠️ Employee not found for deletion ID: {}", id);
                    return new EmployeeNotFoundException("Employee not found ID: " + id);
                });
        employeeRepository.delete(employee);
        logger.info("✅ Employee ID: {} deleted", id);
    }

    private void calculateDeductions(Employee employee) {
        BigDecimal salary = employee.getSalary();
        employee.setBonus(salary.multiply(BigDecimal.valueOf(0.10)));
        employee.setPf(salary.multiply(BigDecimal.valueOf(0.12)));
        employee.setTax(calculateTax(salary));
    }

    private BigDecimal calculateTax(BigDecimal salary) {
        if (salary.compareTo(BigDecimal.valueOf(250000)) <= 0)
            return BigDecimal.ZERO;
        if (salary.compareTo(BigDecimal.valueOf(500000)) <= 0)
            return salary.subtract(BigDecimal.valueOf(250000)).multiply(BigDecimal.valueOf(0.05));
        if (salary.compareTo(BigDecimal.valueOf(1000000)) <= 0)
            return BigDecimal.valueOf(12500)
                    .add(salary.subtract(BigDecimal.valueOf(500000)).multiply(BigDecimal.valueOf(0.20)));
        return BigDecimal.valueOf(112500)
                .add(salary.subtract(BigDecimal.valueOf(1000000)).multiply(BigDecimal.valueOf(0.30)));
    }

    public List<Employee> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id).map(e -> {
            calculateDeductions(e);
            return e;
        });
    }

    public List<Employee> getEmployeesByDepartment(String department) {
        List<Employee> employees = employeeRepository.findByDepartment(department);
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    @Transactional
    public Employee updateEmployee(Long id, @Valid Employee details) {
        logger.info("🔄 Updating employee ID: {}", id);
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("⚠️ Employee not found for update ID: {}", id);
                    return new EmployeeNotFoundException("Not found ID: " + id);
                });

        if (!employee.getEmail().equals(details.getEmail()) && employeeRepository.existsByEmail(details.getEmail())) {
            logger.warn("⚠️ Cannot update. Email already exists: {}", details.getEmail());
            throw new IllegalArgumentException("Email already exists: " + details.getEmail());
        }

        employee.setName(details.getName());
        employee.setEmail(details.getEmail());
        employee.setPhone(details.getPhone());
        employee.setSalary(details.getSalary());
        employee.setDepartment(details.getDepartment());
        employee.setPosition(details.getPosition());
        employee.setGender(details.getGender());
        employee.setJoinDate(details.getJoinDate());
        employee.setAddress(details.getAddress());
        employee.setStatus(details.getStatus());

        calculateDeductions(employee);
        Employee updated = employeeRepository.save(employee);
        logger.info("✅ Employee ID: {} updated successfully", id);
        return updated;
    }

    public List<String> getAllDepartments() {
        return employeeRepository.findDistinctDepartments();
    }

    public Employee convertMapToEmployee(Map<String, Object> data) {
        Employee e = new Employee();
        if (data.containsKey("name"))
            e.setName((String) data.get("name"));
        if (data.containsKey("email"))
            e.setEmail((String) data.get("email"));
        if (data.containsKey("phone"))
            e.setPhone((String) data.get("phone"));
        if (data.containsKey("department"))
            e.setDepartment((String) data.get("department"));
        if (data.containsKey("position"))
            e.setPosition((String) data.get("position"));
        if (data.containsKey("salary")) {
            Object s = data.get("salary");
            e.setSalary(
                    s instanceof Number ? BigDecimal.valueOf(((Number) s).doubleValue()) : new BigDecimal((String) s));
        }
        if (data.containsKey("gender"))
            e.setGender((String) data.get("gender"));
        if (data.containsKey("joinDate") && data.get("joinDate") instanceof String) {
            try {
                e.setJoinDate(LocalDate.parse((String) data.get("joinDate")));
            } catch (DateTimeParseException ex) {
                throw new IllegalArgumentException("Invalid date format");
            }
        }
        if (data.containsKey("status"))
            e.setStatus((String) data.get("status"));
        return e;
    }

    public Employee createEmployeeFromMap(Map<String, Object> data) {
        return saveEmployee(convertMapToEmployee(data));
    }

    public String testDatabaseConnection() {
        try {
            long count = employeeRepository.count();
            return "Database connection successful. Total employees: " + count;
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }

    public long getDepartmentCount(String department) {
        return employeeRepository.countByDepartment(department);
    }

    public BigDecimal getAverageSalaryByDepartment(String department) {
        return employeeRepository.findAverageSalaryByDepartment(department);
    }

    public List<Employee> searchEmployeesByName(String name) {
        List<Employee> employees = employeeRepository.findByNameContainingIgnoreCase(name);
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public List<String> getAllPositions() {
        return employeeRepository.findDistinctPositions();
    }

    public List<Employee> getEmployeesByStatus(String status) {
        List<Employee> employees = employeeRepository.findByStatus(status);
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public int getEmployeeCount() {
        return (int) employeeRepository.count();
    }

    public List<Employee> getEmployeesByGender(String gender) {
        List<Employee> employees = employeeRepository.findByGender(gender);
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public List<Employee> getActiveEmployees() {
        List<Employee> employees = employeeRepository.findActiveEmployees();
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public List<Employee> findBySalaryGreaterThan(Double minSalary) {
        List<Employee> employees = employeeRepository.findBySalaryGreaterThan(BigDecimal.valueOf(minSalary));
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary) {
        List<Employee> employees = employeeRepository.findBySalaryBetween(BigDecimal.valueOf(minSalary), BigDecimal.valueOf(maxSalary));
        employees.forEach(this::calculateDeductions);
        return employees;
    }

    public List<Employee> saveAllEmployees(List<Employee> employees) {
        employees.forEach(this::calculateDeductions);
        return employeeRepository.saveAll(employees);
    }
}
