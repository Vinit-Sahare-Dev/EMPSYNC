// src/main/java/com/spring/restapi/dto/RegisterRequest.java
package com.spring.restapi.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private String confirmPassword;
    private String email;
    private String name;
    private String userType;
    private String employeeId;
    private String department;
    private String position;
    private String phoneNumber;
    private String address;
    private String adminLevel;
    private String departmentAccess;
    
    // Constructors
    public RegisterRequest() {}
    
    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getAdminLevel() { return adminLevel; }
    public void setAdminLevel(String adminLevel) { this.adminLevel = adminLevel; }
    
    public String getDepartmentAccess() { return departmentAccess; }
    public void setDepartmentAccess(String departmentAccess) { this.departmentAccess = departmentAccess; }
}