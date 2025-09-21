package com.spring.restapi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "employees")  // Use lowercase table name
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Use lowercase 'id' not 'ID'
    
    @Column(name = "NAME")
    private String name;
    
    @Column(name = "SALARY")
    private Double salary;
    
    @Column(name = "DEPARTMENT")
    private String department;
    
    @Column(name = "GENDER")
    private String gender;
    
    @JsonIgnore
    @Column(name = "BONUS")
    private Double bonus;
    
    @JsonIgnore
    @Column(name = "PF")
    private Double pf;
    
    @JsonIgnore
    @Column(name = "TAX")
    private Double tax;
    
    // Default constructor (CRITICAL)
    public Employee() {
    }
    
    // Parameterized constructor
    public Employee(String name, Double salary, String department, String gender) {
        this.name = name;
        this.salary = salary;
        this.department = department;
        this.gender = gender;
    }
    
    // Getters and setters for ALL fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public Double getBonus() { return bonus; }
    public void setBonus(Double bonus) { this.bonus = bonus; }
    
    public Double getPf() { return pf; }
    public void setPf(Double pf) { this.pf = pf; }
    
    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }
}