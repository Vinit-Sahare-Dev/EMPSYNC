// src/main/java/com/spring/restapi/dto/LoginRequest.java
package com.spring.restapi.dto;

public class LoginRequest {
    private String username;
    private String password;
    private String userType; // Add this field
    
    // Constructors
    public LoginRequest() {}
    
    public LoginRequest(String username, String password, String userType) {
        this.username = username;
        this.password = password;
        this.userType = userType;
    }
    
    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}