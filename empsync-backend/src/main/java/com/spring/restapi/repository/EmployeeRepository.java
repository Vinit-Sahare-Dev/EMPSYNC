// src/main/java/com/spring/restapi/repository/EmployeeRepository.java
package com.spring.restapi.repository;

import com.spring.restapi.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    List<Employee> findByDepartment(String department);
    List<Employee> findByGender(String gender);
    Optional<Employee> findByEmail(String email);
    List<Employee> findByDepartmentAndGender(String department, String gender);
    List<Employee> findBySalaryGreaterThan(Double minSalary);
    List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary);
    List<Employee> findByStatus(String status);
    List<Employee> findByPosition(String position);
    
    @Query("SELECT e FROM Employee e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Employee> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT DISTINCT e.department FROM Employee e")
    List<String> findDistinctDepartments();
    
    @Query("SELECT DISTINCT e.position FROM Employee e")
    List<String> findDistinctPositions();
    
    @Query("SELECT e FROM Employee e WHERE e.status = 'Active'")
    List<Employee> findActiveEmployees();
}