package com.spring.restapi.repository;  // Note: lowercase 'repository'

import com.spring.restapi.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Spring Data JPA provides basic CRUD operations automatically
}