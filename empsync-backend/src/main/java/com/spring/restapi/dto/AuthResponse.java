// src/main/java/com/spring/restapi/dto/AuthResponse.java
package com.spring.restapi.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String username;
    private String name;
    private String role;
    private String userType; // Add this field
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(boolean success, String message, String username, String name, String role, String userType) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.name = name;
        this.role = role;
        this.userType = userType;
    }
    
    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}