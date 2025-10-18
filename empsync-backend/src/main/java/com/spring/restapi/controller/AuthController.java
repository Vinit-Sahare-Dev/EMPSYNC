// src/main/java/com/spring/restapi/controller/AuthController.java
package com.spring.restapi.controller;

import com.spring.restapi.dto.LoginRequest;
import com.spring.restapi.dto.AuthResponse;
import com.spring.restapi.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.authenticate(loginRequest);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            AuthResponse errorResponse = new AuthResponse(false, "Login failed: " + e.getMessage(), null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<AuthResponse> status() {
        AuthResponse response = new AuthResponse(true, "Auth service is running", null, null, null);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = new AuthResponse(true, "Logout successful", null, null, null);
        return ResponseEntity.ok(response);
    }
}