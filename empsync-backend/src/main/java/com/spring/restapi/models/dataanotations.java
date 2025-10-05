package com.spring.restapi.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                 // generates getters, setters, toString, equals, hashCode
@AllArgsConstructor   // generates constructor with all arguments
@NoArgsConstructor    // generates no-argument constructor

@Entity
public class dataanotations {
    @Id
    private int id;
    private String name;
    private double salary;
    private String dept;
    private String gender;

}
