// src/main/java/com/spring/restapi/service/AuthService.java
package com.spring.restapi.service;

import com.spring.restapi.dto.AuthResponse;
import com.spring.restapi.dto.LoginRequest;
import com.spring.restapi.dto.RegisterRequest;
import com.spring.restapi.models.User;
import com.spring.restapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse authenticate(LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        
        logger.info("🔐 Login attempt - Username: {}", username);
        
        try {
            // Check database users first
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Simple password check (in production, use password encoding!)
                if (user.getPassword().equals(password) && "ACTIVE".equals(user.getStatus())) {
                    logger.info("✅ Database user login successful: {}", username);
                    return new AuthResponse(true, "Login successful", 
                        user.getUsername(), user.getName(), 
                        user.getRole(), user.getUserType());
                } else if (!"ACTIVE".equals(user.getStatus())) {
                    logger.warn("❌ User account is inactive: {}", username);
                    return new AuthResponse(false, "Account is inactive", null, null, null, null);
                }
            }
            
            logger.warn("❌ Login failed - Invalid credentials for user: {}", username);
            return new AuthResponse(false, "Invalid username or password", null, null, null, null);
            
        } catch (Exception e) {
            logger.error("🚨 Authentication error for user {}: {}", username, e.getMessage());
            return new AuthResponse(false, "Authentication error: " + e.getMessage(), null, null, null, null);
        }
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        try {
            logger.info("📝 Registration attempt - Username: {}, Email: {}, UserType: {}", 
                       registerRequest.getUsername(), registerRequest.getEmail(), registerRequest.getUserType());
            
            // Validate passwords match
            if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
                return new AuthResponse(false, "Passwords do not match", null, null, null, null);
            }
            
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                return new AuthResponse(false, "Username already exists", null, null, null, null);
            }
            
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return new AuthResponse(false, "Email already exists", null, null, null, null);
            }
            
            // Create new user
            User newUser = new User();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setPassword(registerRequest.getPassword()); // In production, encrypt this!
            newUser.setEmail(registerRequest.getEmail());
            newUser.setName(registerRequest.getName());
            newUser.setUserType(registerRequest.getUserType());
            newUser.setStatus("ACTIVE");
            
            // Set role based on user type
            if ("admin".equals(registerRequest.getUserType())) {
                newUser.setRole("ADMIN");
                newUser.setAdminLevel(registerRequest.getAdminLevel());
                newUser.setDepartmentAccess(registerRequest.getDepartmentAccess());
            } else {
                newUser.setRole("EMPLOYEE");
                newUser.setEmployeeId(registerRequest.getEmployeeId());
                newUser.setDepartment(registerRequest.getDepartment());
                newUser.setPosition(registerRequest.getPosition());
                newUser.setPhoneNumber(registerRequest.getPhoneNumber());
            }
            
            User savedUser = userRepository.save(newUser);
            
            logger.info("✅ User registered successfully: {}", savedUser.getUsername());
            
            return new AuthResponse(true, "Registration successful", 
                savedUser.getUsername(), savedUser.getName(), 
                savedUser.getRole(), savedUser.getUserType());
                
        } catch (Exception e) {
            logger.error("🚨 Registration error: {}", e.getMessage());
            return new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null, null, null);
        }
    }
    
    // Method to initialize demo users in database
    @Autowired
    public void initializeDemoUsers() {
        try {
            // Check if demo users already exist
            if (!userRepository.existsByUsername("admin_manager")) {
                User demoAdmin = new User();
                demoAdmin.setUsername("admin_manager");
                demoAdmin.setPassword("admin123");
                demoAdmin.setEmail("admin@company.com");
                demoAdmin.setName("Admin Manager");
                demoAdmin.setRole("ADMIN");
                demoAdmin.setUserType("admin");
                demoAdmin.setAdminLevel("MANAGER");
                demoAdmin.setDepartmentAccess("ALL");
                demoAdmin.setStatus("ACTIVE");
                userRepository.save(demoAdmin);
                logger.info("✅ Demo admin user created: admin_manager");
            }
            
            if (!userRepository.existsByUsername("john_employee")) {
                User demoEmployee = new User();
                demoEmployee.setUsername("john_employee");
                demoEmployee.setPassword("password123");
                demoEmployee.setEmail("john@company.com");
                demoEmployee.setName("John Employee");
                demoEmployee.setRole("EMPLOYEE");
                demoEmployee.setUserType("employee");
                demoEmployee.setDepartment("IT");
                demoEmployee.setPosition("Developer");
                demoEmployee.setEmployeeId("EMP001");
                demoEmployee.setStatus("ACTIVE");
                userRepository.save(demoEmployee);
                logger.info("✅ Demo employee user created: john_employee");
            }
            
        } catch (Exception e) {
            logger.error("❌ Error initializing demo users: {}", e.getMessage());
        }
    }
    
    // Method to get demo credentials info
    public Map<String, Object> getDemoCredentials() {
        Map<String, Object> demoCreds = new HashMap<>();
        
        try {
            Optional<User> adminUser = userRepository.findByUsername("admin_manager");
            Optional<User> employeeUser = userRepository.findByUsername("john_employee");
            
            if (adminUser.isPresent()) {
                User admin = adminUser.get();
                Map<String, String> adminInfo = new HashMap<>();
                adminInfo.put("password", admin.getPassword());
                adminInfo.put("name", admin.getName());
                adminInfo.put("role", admin.getRole());
                adminInfo.put("userType", admin.getUserType());
                demoCreds.put("admin_manager", adminInfo);
            }
            
            if (employeeUser.isPresent()) {
                User employee = employeeUser.get();
                Map<String, String> employeeInfo = new HashMap<>();
                employeeInfo.put("password", employee.getPassword());
                employeeInfo.put("name", employee.getName());
                employeeInfo.put("role", employee.getRole());
                employeeInfo.put("userType", employee.getUserType());
                demoCreds.put("john_employee", employeeInfo);
            }
            
        } catch (Exception e) {
            logger.error("❌ Error getting demo credentials: {}", e.getMessage());
        }
        
        return demoCreds;
    }
}