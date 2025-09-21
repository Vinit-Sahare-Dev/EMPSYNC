package com.spring.restapi.controller;

import com.spring.restapi.models.Employee;
import com.spring.restapi.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}