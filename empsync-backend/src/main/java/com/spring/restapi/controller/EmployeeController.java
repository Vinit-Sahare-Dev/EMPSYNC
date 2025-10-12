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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3006")
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<?> createEmployee(@Valid @RequestBody Employee employee) {
        logger.info("CREATE EMPLOYEE REQUEST - Name: {}, Email: {}, Department: {}, Position: {}, Salary: {}", 
                   employee.getName(), employee.getEmail(), employee.getDepartment(), 
                   employee.getPosition(), employee.getSalary());
        
        try {
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
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/positions")
    public ResponseEntity<Map<String, Object>> getAllPositions() {
        logger.info("GET ALL POSITIONS REQUEST");
        
        List<String> positions = employeeService.getAllPositions();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("positions", positions);
        
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
    public ResponseEntity<Integer> getEmployeeCount() {
        int count = employeeService.getEmployeeCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<Employee>> getEmployeesByGender(@PathVariable String gender) {
        List<Employee> employees = employeeService.getEmployeesByGender(gender);
        return ResponseEntity.ok(employees);
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
}