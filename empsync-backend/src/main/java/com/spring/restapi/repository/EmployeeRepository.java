// src/main/java/com/spring/restapi/repository/EmployeeRepository.java
package com.spring.restapi.repository;

import com.spring.restapi.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    // Basic query methods
    List<Employee> findByDepartment(String department);
    List<Employee> findByGender(String gender);
    Optional<Employee> findByEmail(String email);
    List<Employee> findByStatus(String status);
    List<Employee> findByPosition(String position);
    
    // Complex query methods with BigDecimal
    List<Employee> findByDepartmentAndGender(String department, String gender);
    List<Employee> findBySalaryGreaterThan(BigDecimal minSalary);
    List<Employee> findBySalaryBetween(BigDecimal minSalary, BigDecimal maxSalary);
    
    // Custom query methods
    @Query("SELECT e FROM Employee e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Employee> findByNameContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT DISTINCT e.department FROM Employee e")
    List<String> findDistinctDepartments();
    
    @Query("SELECT DISTINCT e.position FROM Employee e")
    List<String> findDistinctPositions();
    
    @Query("SELECT e FROM Employee e WHERE e.status = 'Active'")
    List<Employee> findActiveEmployees();
    
    // Additional useful query methods
    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :department")
    Long countByDepartment(@Param("department") String department);
    
    @Query("SELECT AVG(e.salary) FROM Employee e WHERE e.department = :department")
    BigDecimal findAverageSalaryByDepartment(@Param("department") String department);
    
    @Query("SELECT e FROM Employee e WHERE e.status = :status ORDER BY e.name ASC")
    List<Employee> findByStatusOrderByName(@Param("status") String status);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find employees by multiple statuses
    @Query("SELECT e FROM Employee e WHERE e.status IN :statuses")
    List<Employee> findByStatusIn(@Param("statuses") List<String> statuses);
    
    // Find employees with salary greater than or equal to
    @Query("SELECT e FROM Employee e WHERE e.salary >= :minSalary ORDER BY e.salary DESC")
    List<Employee> findBySalaryGreaterThanEqualOrderBySalaryDesc(@Param("minSalary") BigDecimal minSalary);
}