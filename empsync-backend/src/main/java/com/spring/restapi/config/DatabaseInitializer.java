package com.spring.restapi.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private DataSourceProperties dataSourceProperties;

    @Override
    public void run(String... args) throws Exception {
        insertSampleData();
    }

    @Transactional
    public void insertSampleData() {
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSourceProperties.initializeDataSourceBuilder().build());
            
            // Check if we have any employees
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM employees", Integer.class);
            
            if (count != null && count == 0) {
                System.out.println("Inserting sample Indian employee data...");
                
                // Insert sample employees
                String insertEmployeeSql = """
                    INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status, bonus, pf, tax) VALUES
                    ('Rajesh Kumar', 'rajesh.kumar@company.com', '+91-9876543210', 'IT', 'Senior Software Engineer', 850000.00, 'Male', '2022-01-15', '123 MG Road, Bangalore, Karnataka', 'Active', 50000.00, 85000.00, 102000.00),
                    ('Priya Sharma', 'priya.sharma@company.com', '+91-9876543211', 'HR', 'HR Manager', 750000.00, 'Female', '2021-06-10', '456 Brigade Road, Bangalore, Karnataka', 'Active', 45000.00, 75000.00, 90000.00),
                    ('Amit Patel', 'amit.patel@company.com', '+91-9876543212', 'Finance', 'Senior Accountant', 650000.00, 'Male', '2022-03-20', '789 Residency Road, Bangalore, Karnataka', 'Active', 35000.00, 65000.00, 78000.00),
                    ('Sneha Reddy', 'sneha.reddy@company.com', '+91-9876543213', 'IT', 'Software Engineer', 600000.00, 'Female', '2022-07-01', '321 Commercial Street, Bangalore, Karnataka', 'Active', 30000.00, 60000.00, 72000.00),
                    ('Vikram Singh', 'vikram.singh@company.com', '+91-9876543214', 'Sales', 'Sales Manager', 700000.00, 'Male', '2021-09-15', '654 Infantry Road, Bangalore, Karnataka', 'Active', 40000.00, 70000.00, 84000.00)
                    """;
                
                jdbcTemplate.update(insertEmployeeSql);
                System.out.println("Sample employee data inserted successfully!");
                
                // Insert corresponding users with default passwords (password: password123)
                String insertUserSql = """
                    INSERT INTO users (username, password, email, name, role, user_type, department, position, phone_number, employee_id, status, email_verified) VALUES
                    ('rajesh.kumar', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFDYZt/M5nBmzL6UxTKrIx6', 'rajesh.kumar@company.com', 'Rajesh Kumar', 'EMPLOYEE', 'employee', 'IT', 'Senior Software Engineer', '+91-9876543210', 'EMP001', 'ACTIVE', TRUE),
                    ('priya.sharma', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFDYZt/M5nBmzL6UxTKrIx6', 'priya.sharma@company.com', 'Priya Sharma', 'MANAGER', 'employee', 'HR', 'HR Manager', '+91-9876543211', 'EMP002', 'ACTIVE', TRUE),
                    ('amit.patel', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFDYZt/M5nBmzL6UxTKrIx6', 'amit.patel@company.com', 'Amit Patel', 'EMPLOYEE', 'employee', 'Finance', 'Senior Accountant', '+91-9876543212', 'EMP003', 'ACTIVE', TRUE),
                    ('sneha.reddy', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFDYZt/M5nBmzL6UxTKrIx6', 'sneha.reddy@company.com', 'Sneha Reddy', 'EMPLOYEE', 'employee', 'IT', 'Software Engineer', '+91-9876543213', 'EMP004', 'ACTIVE', TRUE),
                    ('vikram.singh', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFDYZt/M5nBmzL6UxTKrIx6', 'vikram.singh@company.com', 'Vikram Singh', 'MANAGER', 'employee', 'Sales', 'Sales Manager', '+91-9876543214', 'EMP005', 'ACTIVE', TRUE)
                    """;
                
                jdbcTemplate.update(insertUserSql);
                System.out.println("Sample user data inserted successfully!");
                
                // Create an admin user
                String insertAdminSql = """
                    INSERT INTO users (username, password, email, name, role, user_type, department, position, phone_number, employee_id, status, email_verified) VALUES
                    ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iYqiSfFDYZt/M5nBmzL6UxTKrIx6', 'admin@company.com', 'System Administrator', 'ADMIN', 'admin', 'IT', 'Administrator', '+91-9876543220', 'ADMIN001', 'ACTIVE', TRUE)
                    """;
                
                jdbcTemplate.update(insertAdminSql);
                System.out.println("Admin user created successfully! Username: admin, Password: password123");
                
            } else {
                System.out.println("Employee data already exists. Skipping sample data insertion.");
            }
            
        } catch (Exception e) {
            System.err.println("Error inserting sample data: " + e.getMessage());
            // Don't fail the application startup if sample data insertion fails
        }
    }
}
