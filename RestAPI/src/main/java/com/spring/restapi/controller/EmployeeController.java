package com.spring.restapi.controller;

import com.spring.restapi.models.Employee;
import com.spring.restapi.service.EmployeeService;
import com.spring.restapi.exception.EmployeeNotFoundException;
import com.spring.restapi.exception.IllegalDepartmentException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid; // Required for validation

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        Employee savedEmployee = employeeService.saveEmployee(employee);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/api/employees/" + savedEmployee.getId())
                .body(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employeeDetails) {
        Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
        return ResponseEntity.ok(updatedEmployee);
    }

    // PATCH validation for partial updates typically requires custom validation logic on the service layer.
    @PatchMapping("/{id}")
    public ResponseEntity<Employee> partialUpdateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        Employee updatedEmployee = employeeService.partialUpdateEmployee(id, updates);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployeeById(@PathVariable Long id) {
        employeeService.deleteEmployeeById(id);
        return ResponseEntity.ok("Employee with id " + id + " deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id)
                  .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        // Example: only IT, HR, and Finance are valid departments
        List<String> validDepartments = List.of("IT", "HR", "Finance");

        if (!validDepartments.contains(department)) {
            throw new IllegalDepartmentException("Department " + department + " is not allowed.");
        }

        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<Employee>> getEmployeesByGender(@PathVariable String gender) {
        List<Employee> employees = employeeService.getEmployeesByGender(gender);
        return ResponseEntity.ok(employees);
    }

    // Bulk validation for @Valid List<Employee> requires further configuration in some Spring versions.
    @PostMapping("/bulk")
    public ResponseEntity<List<Employee>> saveAllEmployees(@RequestBody List<@Valid Employee> employees) {
        List<Employee> savedEmployees = employeeService.saveAllEmployees(employees);
        return ResponseEntity.ok(savedEmployees);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getEmployeeCount() {
        int count = employeeService.getEmployeeCount();
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllEmployees() {
        employeeService.deleteAllEmployees();
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}
