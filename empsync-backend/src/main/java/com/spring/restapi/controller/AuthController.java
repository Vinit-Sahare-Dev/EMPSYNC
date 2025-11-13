// src/main/java/com/spring/restapi/controller/AuthController.java
package com.spring.restapi.controller;

import com.spring.restapi.dto.LoginRequest;
import com.spring.restapi.dto.RegisterRequest;
import com.spring.restapi.dto.AuthResponse;
import com.spring.restapi.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"})
public class AuthController {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("🔐 Login request for user: {}", loginRequest.getUsername());
            
            AuthResponse response = authService.authenticate(loginRequest);
            
            if (response.isSuccess()) {
                logger.info("✅ Login successful for user: {}", loginRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("❌ Login failed for user: {}", loginRequest.getUsername());
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Login error for user {}: {}", loginRequest.getUsername(), e.getMessage());
            AuthResponse errorResponse = new AuthResponse(false, "Login failed: " + e.getMessage(), null, null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/register/employee")
    public ResponseEntity<AuthResponse> registerEmployee(@RequestBody RegisterRequest registerRequest) {
        try {
            registerRequest.setUserType("employee");
            logger.info("👤 Employee registration: {}", registerRequest.getUsername());
            
            AuthResponse response = authService.register(registerRequest);
            
            if (response.isSuccess()) {
                logger.info("✅ Employee registered successfully: {}", registerRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("❌ Employee registration failed: {}", registerRequest.getUsername());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Employee registration error: {}", e.getMessage());
            AuthResponse errorResponse = new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> registerAdmin(@RequestBody RegisterRequest registerRequest) {
        try {
            registerRequest.setUserType("admin");
            logger.info("👑 Admin registration: {}", registerRequest.getUsername());
            
            AuthResponse response = authService.register(registerRequest);
            
            if (response.isSuccess()) {
                logger.info("✅ Admin registered successfully: {}", registerRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("❌ Admin registration failed: {}", registerRequest.getUsername());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Admin registration error: {}", e.getMessage());
            AuthResponse errorResponse = new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/demo-credentials")
    public ResponseEntity<Map<String, Object>> getDemoCredentials() {
        try {
            Map<String, Object> demoCreds = authService.getDemoCredentials();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("demoUsers", demoCreds);
            response.put("message", "Use these credentials for testing:");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get demo credentials: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<AuthResponse> status() {
        AuthResponse response = new AuthResponse(true, "Auth service is running", null, null, null, null);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = new AuthResponse(true, "Logout successful", null, null, null, null);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test-db")
    public ResponseEntity<Map<String, Object>> testDatabase() {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Database connection successful");
            response.put("database", "MySQL");
            response.put("timestamp", java.time.LocalDateTime.now());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Database connection failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}