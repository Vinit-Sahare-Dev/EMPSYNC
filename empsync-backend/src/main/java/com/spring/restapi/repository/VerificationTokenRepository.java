// src/main/java/com/spring/restapi/repository/VerificationTokenRepository.java
package com.spring.restapi.repository;

import com.spring.restapi.models.VerificationToken;
import com.spring.restapi.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    
    Optional<VerificationToken> findByToken(String token);
    
    Optional<VerificationToken> findByUserAndTokenType(User user, String tokenType);
    
    List<VerificationToken> findByUser(User user);
    
    @Query("SELECT vt FROM VerificationToken vt WHERE vt.expiryDate < :now")
    List<VerificationToken> findExpiredTokens(@Param("now") LocalDateTime now);
    
    @Query("SELECT vt FROM VerificationToken vt WHERE vt.user = :user AND vt.tokenType = :tokenType AND vt.used = false AND vt.expiryDate > :now")
    Optional<VerificationToken> findValidTokenByUserAndType(
        @Param("user") User user, 
        @Param("tokenType") String tokenType, 
        @Param("now") LocalDateTime now
    );
    
    void deleteByUser(User user);
    
    void deleteByExpiryDateBefore(LocalDateTime dateTime);
}