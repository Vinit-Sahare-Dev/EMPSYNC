package com.spring.restapi.controller;

import com.spring.restapi.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
public class DepartmentController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getDepartmentStats() {
        List<String> departments = employeeService.getAllDepartments();
        
        List<Map<String, Object>> stats = departments.stream().map(dept -> {
            Map<String, Object> deptStats = new HashMap<>();
            long count = employeeService.getDepartmentCount(dept);
            BigDecimal avgSalary = employeeService.getAverageSalaryByDepartment(dept);
            
            deptStats.put("name", dept);
            deptStats.put("count", count);
            deptStats.put("averageSalary", avgSalary != null ? avgSalary : BigDecimal.ZERO);
            return deptStats;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{name}")
    public ResponseEntity<Map<String, Object>> getDepartmentDetails(@PathVariable String name) {
        long count = employeeService.getDepartmentCount(name);
        BigDecimal avgSalary = employeeService.getAverageSalaryByDepartment(name);
        
        Map<String, Object> response = new HashMap<>();
        response.put("name", name);
        response.put("count", count);
        response.put("averageSalary", avgSalary != null ? avgSalary : BigDecimal.ZERO);
        
        return ResponseEntity.ok(response);
    }
}
