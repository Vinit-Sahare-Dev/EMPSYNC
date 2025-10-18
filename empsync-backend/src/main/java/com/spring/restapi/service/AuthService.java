// src/main/java/com/spring/restapi/service/AuthService.java
package com.spring.restapi.service;

import com.spring.restapi.dto.AuthResponse;
import com.spring.restapi.dto.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    public AuthResponse authenticate(LoginRequest loginRequest) {
        // Simple hardcoded authentication
        if ("admin".equals(loginRequest.getUsername()) && "admin123".equals(loginRequest.getPassword())) {
            return new AuthResponse(true, "Login successful", "admin", "System Administrator", "ADMIN");
        } else if ("employee".equals(loginRequest.getUsername()) && "employee123".equals(loginRequest.getPassword())) {
            return new AuthResponse(true, "Login successful", "employee", "Demo Employee", "EMPLOYEE");
        } else {
            return new AuthResponse(false, "Invalid username or password", null, null, null);
        }
    }
}