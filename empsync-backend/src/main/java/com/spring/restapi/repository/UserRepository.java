// src/main/java/com/spring/restapi/repository/UserRepository.java
package com.spring.restapi.repository;

import com.spring.restapi.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findByUserType(String userType);
    List<User> findByRole(String role);
    
    @Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")
    List<User> findActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.userType = :userType")
    Long countByUserType(@Param("userType") String userType);
}