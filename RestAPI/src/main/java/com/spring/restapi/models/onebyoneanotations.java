package com.spring.restapi.models;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter                // generates getters
@Setter                // generates setters
@ToString              // generates toString()
@AllArgsConstructor    // generates constructor with all arguments
@NoArgsConstructor     // generates no-argument constructor
@EqualsAndHashCode
public class onebyoneanotations {
	
	private int id;
	private String name;
	private double salary;
	
	
	
}
 
