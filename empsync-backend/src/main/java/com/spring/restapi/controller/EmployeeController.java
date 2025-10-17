// src/main/java/com/spring/restapi/controller/EmployeeController.java
package com.spring.restapi.controller;

import com.spring.restapi.models.Employee;
import com.spring.restapi.service.EmployeeService;
import com.spring.restapi.exception.EmployeeNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001","http://localhost:3002","http://localhost:3003"})
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeService employeeService;

    // Test database connection
    @GetMapping("/test-db")
    public ResponseEntity<Map<String, Object>> testDatabase() {
        String result = employeeService.testDatabaseConnection();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", result);
        response.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(response);
    }

    // Create employee with Map support for flexible input
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Map<String, Object> employeeData) {
        logger.info("CREATE EMPLOYEE REQUEST - Data: {}", employeeData);
        
        try {
            Employee employee = employeeService.convertMapToEmployee(employeeData);
            
            // Validate required fields
            if (employee.getName() == null || employee.getEmail() == null || 
                employee.getDepartment() == null || employee.getPosition() == null || 
                employee.getSalary() == null || employee.getJoinDate() == null) {
                throw new IllegalArgumentException("All required fields (name, email, department, position, salary, joinDate) must be provided");
            }
            
            Employee savedEmployee = employeeService.saveEmployee(employee);
            
            logger.info("EMPLOYEE CREATED - ID: {}, Name: {}, Email: {}", 
                       savedEmployee.getId(), savedEmployee.getName(), savedEmployee.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee created successfully");
            response.put("employee", savedEmployee);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error creating employee: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Alternative create endpoint for direct Employee object
    @PostMapping("/direct")
    public ResponseEntity<?> createEmployeeDirect(@Valid @RequestBody Employee employee) {
        logger.info("CREATE EMPLOYEE DIRECT - Name: {}, Email: {}, Department: {}", 
                   employee.getName(), employee.getEmail(), employee.getDepartment());
        
        try {
            Employee savedEmployee = employeeService.saveEmployee(employee);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee created successfully");
            response.put("employee", savedEmployee);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEmployees() {
        logger.info("GET ALL EMPLOYEES REQUEST");
        List<Employee> employees = employeeService.getAllEmployees();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("employees", employees);
        
        logger.info("RETURNING {} EMPLOYEES", employees.size());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable Long id) {
        logger.info("GET EMPLOYEE BY ID REQUEST - ID: {}", id);
        
        return employeeService.getEmployeeById(id)
                .map(employee -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("employee", employee);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Employee not found with id: " + id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employeeDetails) {
        logger.info("UPDATE EMPLOYEE REQUEST - ID: {}, Name: {}, Email: {}", 
                   id, employeeDetails.getName(), employeeDetails.getEmail());
        
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee updated successfully");
            response.put("employee", updatedEmployee);
            
            return ResponseEntity.ok(response);
            
        } catch (EmployeeNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEmployeeById(@PathVariable Long id) {
        logger.info("DELETE EMPLOYEE REQUEST - ID: {}", id);
        
        try {
            employeeService.deleteEmployeeById(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee deleted successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (EmployeeNotFoundException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<Map<String, Object>> getEmployeesByDepartment(@PathVariable String department) {
        logger.info("GET EMPLOYEES BY DEPARTMENT - Department: {}", department);
        
        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("employees", employees);
        response.put("departmentCount", employeeService.getDepartmentCount(department));
        response.put("averageSalary", employeeService.getAverageSalaryByDepartment(department));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> searchEmployeesByName(@RequestParam String name) {
        logger.info("SEARCH EMPLOYEES BY NAME - Name: {}", name);
        
        List<Employee> employees = employeeService.searchEmployeesByName(name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("employees", employees);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/departments")
    public ResponseEntity<Map<String, Object>> getAllDepartments() {
        logger.info("GET ALL DEPARTMENTS REQUEST");
        
        List<String> departments = employeeService.getAllDepartments();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("departments", departments);
        response.put("count", departments.size());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/positions")
    public ResponseEntity<Map<String, Object>> getAllPositions() {
        logger.info("GET ALL POSITIONS REQUEST");
        
        List<String> positions = employeeService.getAllPositions();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("positions", positions);
        response.put("count", positions.size());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Map<String, Object>> getEmployeesByStatus(@PathVariable String status) {
        logger.info("GET EMPLOYEES BY STATUS - Status: {}", status);
        
        List<Employee> employees = employeeService.getEmployeesByStatus(status);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("employees", employees);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getEmployeeCount() {
        int count = employeeService.getEmployeeCount();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", count);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<Map<String, Object>> getEmployeesByGender(@PathVariable String gender) {
        logger.info("GET EMPLOYEES BY GENDER - Gender: {}", gender);
        
        List<Employee> employees = employeeService.getEmployeesByGender(gender);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("employees", employees);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveEmployees() {
        logger.info("GET ACTIVE EMPLOYEES REQUEST");
        
        List<Employee> employees = employeeService.getActiveEmployees();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("employees", employees);
        
        return ResponseEntity.ok(response);
    }

    // New endpoints for salary filtering
    @GetMapping("/salary/greater-than")
    public ResponseEntity<Map<String, Object>> getEmployeesByMinSalary(@RequestParam Double minSalary) {
        logger.info("GET EMPLOYEES BY MIN SALARY - Min Salary: {}", minSalary);
        
        List<Employee> employees = employeeService.findBySalaryGreaterThan(minSalary);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("minSalary", minSalary);
        response.put("employees", employees);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/salary/between")
    public ResponseEntity<Map<String, Object>> getEmployeesBySalaryRange(
            @RequestParam Double minSalary, 
            @RequestParam Double maxSalary) {
        logger.info("GET EMPLOYEES BY SALARY RANGE - Min: {}, Max: {}", minSalary, maxSalary);
        
        List<Employee> employees = employeeService.findBySalaryBetween(minSalary, maxSalary);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", employees.size());
        response.put("minSalary", minSalary);
        response.put("maxSalary", maxSalary);
        response.put("employees", employees);
        
        return ResponseEntity.ok(response);
    }

    // Bulk operations
    @PostMapping("/bulk")
    public ResponseEntity<?> createEmployeesBulk(@Valid @RequestBody List<Employee> employees) {
        logger.info("BULK CREATE EMPLOYEES REQUEST - Count: {}", employees.size());
        
        try {
            List<Employee> savedEmployees = employeeService.saveAllEmployees(employees);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employees created successfully");
            response.put("count", savedEmployees.size());
            response.put("employees", savedEmployees);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}