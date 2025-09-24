package com.spring.restapi.controller;

import com.spring.restapi.models.Employee;

import com.spring.restapi.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = employeeService.saveEmployee(employee);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/api/employees/" + savedEmployee.getId())
                .body(savedEmployee);
    }
    
    
    // NEW: PUT - Full Update
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
   
    @PatchMapping("/{id}")
    public ResponseEntity<Employee> partialUpdateEmployee(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Employee updatedEmployee = employeeService.partialUpdateEmployee(id, updates);
        return ResponseEntity.ok(updatedEmployee);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployeeById(@PathVariable Long id) {
        employeeService.deleteEmployeeById(id);
        return ResponseEntity.ok("Employee with id " + id + " deleted successfully");
    }
 
    
    
    
    // Get all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }
    
    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    // Get employees by department
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }
    
    // Get employees by gender
    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<Employee>> getEmployeesByGender(@PathVariable String gender) {
        List<Employee> employees = employeeService.getEmployeesByGender(gender);
        return ResponseEntity.ok(employees);
    }
    
    // POST - Save multiple employees
    @PostMapping("/bulk")
    public ResponseEntity<List<Employee>> saveAllEmployees(@RequestBody List<Employee> employees) {
        List<Employee> savedEmployees = employeeService.saveAllEmployees(employees);
        return ResponseEntity.ok(savedEmployees);
    }

    // GET - Get total employee count
    @GetMapping("/count")
    public ResponseEntity<Integer> getEmployeeCount() {
        int count = employeeService.getEmployeeCount();
        return ResponseEntity.ok(count);
    }

    // DELETE - Delete all employees
    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllEmployees() {
        employeeService.deleteAllEmployees();
        return ResponseEntity.noContent().build(); // 204 No Content
    }
    
   
}