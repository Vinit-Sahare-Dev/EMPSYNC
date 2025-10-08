package com.spring.restapi.controller;

import com.spring.restapi.config.ApplicationInfo;
import com.spring.restapi.config.ServerInfo;
import com.spring.restapi.config.SystemInfo;
import com.spring.restapi.models.Employee;
import com.spring.restapi.service.EmployeeService;
import com.spring.restapi.exception.EmployeeNotFoundException;
import com.spring.restapi.exception.IllegalDepartmentException;

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
public class EmployeeController {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private ApplicationInfo applicationInfo;

    @Autowired
    private ServerInfo serverInfo;
    
    @Autowired
    private SystemInfo systemInfo; 

    @GetMapping("/app-info")
    public ResponseEntity<Map<String, Object>> getApplicationInfo() {
        logger.info("GET APPLICATION INFO REQUEST - App: {}", applicationInfo.getName());
        
        Map<String, Object> response = new HashMap<>();
        response.put("application", applicationInfo.getFormattedInfo());
        response.put("name", applicationInfo.getName());
        response.put("version", applicationInfo.getVersion());
        response.put("description", applicationInfo.getDescription());
        response.put("environment", applicationInfo.getEnvironment());
        response.put("database", applicationInfo.getDatabase());
        response.put("h2Console", applicationInfo.getH2ConsolePath());
        response.put("databaseInfo", applicationInfo.getDatabaseInfo());
        
        logger.info("APPLICATION INFO RETURNED - Name: {}, Env: {}, DB: {}", 
                   applicationInfo.getName(), applicationInfo.getEnvironment(), 
                   applicationInfo.getDatabase());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/server-info")
    public ResponseEntity<Map<String, Object>> getServerInfo() {
        logger.info("GET SERVER INFO REQUEST - Port: {}", serverInfo.getPort());
        
        Map<String, Object> response = new HashMap<>();
        response.put("server", serverInfo.getFormattedInfo());
        response.put("applicationName", serverInfo.getApplicationName());
        response.put("url", serverInfo.getServerUrl());
        response.put("host", serverInfo.getHost());
        response.put("port", serverInfo.getPort());
        response.put("configuredPort", serverInfo.getConfiguredPort());
        response.put("portInfo", serverInfo.getPortInfo());
        response.put("startupTime", serverInfo.getFormattedStartupTime());
        response.put("uptimeSeconds", serverInfo.getUptimeInSeconds());
        response.put("protocol", serverInfo.getProtocol());
        response.put("contextPath", serverInfo.getContextPath());
        
        logger.info("SERVER INFO RETURNED - URL: {}, Uptime: {}s, Port: {}", 
                   serverInfo.getServerUrl(), serverInfo.getUptimeInSeconds(),
                   serverInfo.getPort());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/system-info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        logger.info("GET SYSTEM INFO REQUEST");
        
        Map<String, Object> response = new HashMap<>();
        response.put("summary", systemInfo.getFormattedSystemInfo());
        response.put("details", systemInfo.getDetailedSystemInfo());
        
        logger.info("SYSTEM INFO RETURNED - OS: {}, Java: {}, Memory: {}", 
                   systemInfo.getOperatingSystem(), systemInfo.getJavaVersion(), 
                   systemInfo.getMaxMemory());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        logger.info("HEALTH CHECK REQUEST - App: {}", applicationInfo.getName());
        
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("application", applicationInfo.getFormattedInfo());
        healthInfo.put("server", serverInfo.getFormattedInfo());
        healthInfo.put("timestamp", java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        healthInfo.put("employeeCount", employeeService.getEmployeeCount());
        healthInfo.put("uptimeSeconds", serverInfo.getUptimeInSeconds());
        healthInfo.put("database", "H2 In-Memory (Connected)");
        healthInfo.put("h2Console", "Available at " + serverInfo.getServerUrl() + applicationInfo.getH2ConsolePath());
        healthInfo.put("port", serverInfo.getPort());
        healthInfo.put("configuredPort", serverInfo.getConfiguredPort());
        
        logger.info("HEALTH CHECK - Status: UP, Employees: {}, Uptime: {}s, Port: {}", 
                   employeeService.getEmployeeCount(), serverInfo.getUptimeInSeconds(),
                   serverInfo.getPort());
        
        return ResponseEntity.ok(healthInfo);
    }

    @GetMapping("/h2-console-info")
    public ResponseEntity<Map<String, Object>> getH2ConsoleInfo() {
        logger.info("H2 CONSOLE INFO REQUEST");
        
        String h2ConsoleUrl = serverInfo.getServerUrl() + applicationInfo.getH2ConsolePath();
        
        Map<String, Object> consoleInfo = new HashMap<>();
        consoleInfo.put("consoleUrl", h2ConsoleUrl);
        consoleInfo.put("databaseUrl", "jdbc:h2:mem:testdb");
        consoleInfo.put("username", "sa");
        consoleInfo.put("description", "H2 In-Memory Database Console");
        consoleInfo.put("driverClass", "org.h2.Driver");
        consoleInfo.put("application", applicationInfo.getName());
        consoleInfo.put("fullApplicationInfo", applicationInfo.getFormattedInfo());
        
        logger.info("H2 CONSOLE INFO - URL: {}, DB: {}", h2ConsoleUrl, "jdbc:h2:mem:testdb");
        
        return ResponseEntity.ok(consoleInfo);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        logger.info("CREATE EMPLOYEE REQUEST - Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   employee.getName(), employee.getDepartment(), employee.getGender(), employee.getSalary());
        
        Employee savedEmployee = employeeService.saveEmployee(employee);
        
        logger.info("EMPLOYEE CREATED - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   savedEmployee.getId(), savedEmployee.getName(), savedEmployee.getDepartment(), 
                   savedEmployee.getGender(), savedEmployee.getSalary());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/api/employees/" + savedEmployee.getId())
                .body(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employeeDetails) {
        logger.info("UPDATE EMPLOYEE REQUEST - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   id, employeeDetails.getName(), employeeDetails.getDepartment(), 
                   employeeDetails.getGender(), employeeDetails.getSalary());
        
        Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
        
        logger.info("EMPLOYEE UPDATED - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   id, updatedEmployee.getName(), updatedEmployee.getDepartment(), 
                   updatedEmployee.getGender(), updatedEmployee.getSalary());
        return ResponseEntity.ok(updatedEmployee);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Employee> partialUpdateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        logger.info("PARTIAL UPDATE EMPLOYEE REQUEST - ID: {}, Updates: {}", id, updates);
        Employee updatedEmployee = employeeService.partialUpdateEmployee(id, updates);
        
        logger.info("EMPLOYEE PARTIALLY UPDATED - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   id, updatedEmployee.getName(), updatedEmployee.getDepartment(), 
                   updatedEmployee.getGender(), updatedEmployee.getSalary());
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployeeById(@PathVariable Long id) {
        // First get employee details before deleting
        Employee employee = employeeService.getEmployeeById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        
        logger.info("DELETE EMPLOYEE REQUEST - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   id, employee.getName(), employee.getDepartment(), employee.getGender(), employee.getSalary());
        
        employeeService.deleteEmployeeById(id);
        
        logger.info("EMPLOYEE DELETED - ID: {}, Name: {}, Department: {}", 
                   id, employee.getName(), employee.getDepartment());
        return ResponseEntity.ok("Employee with id " + id + " deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        logger.info("GET ALL EMPLOYEES REQUEST");
        List<Employee> employees = employeeService.getAllEmployees();
        
        // Log summary of all employees
        logger.info("RETURNING {} EMPLOYEES:", employees.size());
        for (Employee emp : employees) {
            logger.info("  - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                       emp.getId(), emp.getName(), emp.getDepartment(), emp.getGender(), emp.getSalary());
        }
        
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        logger.info("GET EMPLOYEE BY ID REQUEST - ID: {}", id);
        Employee employee = employeeService.getEmployeeById(id)
                .orElseThrow(() -> {
                    logger.warn("EMPLOYEE NOT FOUND - ID: {}", id);
                    return new EmployeeNotFoundException("Employee not found with id: " + id);
                });
        
        logger.info("EMPLOYEE FOUND - ID: {}, Name: {}, Department: {}, Gender: {}, Salary: {}", 
                   employee.getId(), employee.getName(), employee.getDepartment(), 
                   employee.getGender(), employee.getSalary());
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        logger.info("GET EMPLOYEES BY DEPARTMENT REQUEST - Department: {}", department);
        List<String> validDepartments = List.of("IT", "HR", "Finance");

        if (!validDepartments.contains(department)) {
            logger.error("INVALID DEPARTMENT - Department: {}", department);
            throw new IllegalDepartmentException("Department " + department + " is not allowed.");
        }

        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        
        logger.info("RETURNING {} EMPLOYEES FROM DEPARTMENT {}:", employees.size(), department);
        for (Employee emp : employees) {
            logger.info("  - ID: {}, Name: {}, Gender: {}, Salary: {}", 
                       emp.getId(), emp.getName(), emp.getGender(), emp.getSalary());
        }
        
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<Employee>> getEmployeesByGender(@PathVariable String gender) {
        logger.info("GET EMPLOYEES BY GENDER REQUEST - Gender: {}", gender);
        List<Employee> employees = employeeService.getEmployeesByGender(gender);
        
        logger.info("RETURNING {} EMPLOYEES WITH GENDER {}:", employees.size(), gender);
        for (Employee emp : employees) {
            logger.info("  - ID: {}, Name: {}, Department: {}, Salary: {}", 
                       emp.getId(), emp.getName(), emp.getDepartment(), emp.getSalary());
        }
        
        return ResponseEntity.ok(employees);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<Employee>> saveAllEmployees(@RequestBody List<@Valid Employee> employees) {
        logger.info("BULK SAVE EMPLOYEES REQUEST - Count: {}", employees.size());
        
        // Log details of all employees being saved
        for (int i = 0; i < employees.size(); i++) {
            Employee emp = employees.get(i);
            logger.info("EMPLOYEE {} - Name: {}, Department: {}, Gender: {}, Salary: {}", 
                       i + 1, emp.getName(), emp.getDepartment(), emp.getGender(), emp.getSalary());
        }
        
        List<Employee> savedEmployees = employeeService.saveAllEmployees(employees);
        
        logger.info("BULK SAVE SUCCESSFUL - Total Employees Saved: {}", savedEmployees.size());
        return ResponseEntity.ok(savedEmployees);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getEmployeeCount() {
        logger.info("GET EMPLOYEE COUNT REQUEST");
        int count = employeeService.getEmployeeCount();
        logger.info("EMPLOYEE COUNT: {}", count);
        return ResponseEntity.ok(count);
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> deleteAllEmployees() {
        logger.info("DELETE ALL EMPLOYEES REQUEST");
        int count = employeeService.getEmployeeCount(); // Get count before deletion
        employeeService.deleteAllEmployees();
        logger.info("ALL EMPLOYEES DELETED - Total Deleted: {}", count);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<Employee> getEmployeeByEmail(@RequestParam("email") String email) {
        return employeeService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/department-gender")
    public List<Employee> getEmployeesByDepartmentAndGender(
            @RequestParam String department, 
            @RequestParam String gender) {
        return employeeService.findByDepartmentAndGender(department, gender);
    }

    @GetMapping("/salary-greater-than")
    public List<Employee> getEmployeesBySalaryGreaterThan(@RequestParam Double minSalary) {
        return employeeService.findBySalaryGreaterThan(minSalary);
    }

    @GetMapping("/salary-between")
    public List<Employee> getEmployeesBySalaryBetween(
            @RequestParam Double minSalary, 
            @RequestParam Double maxSalary) {
        return employeeService.findBySalaryBetween(minSalary, maxSalary);
    }
}