package com.spring.restapi.repository;

import com.spring.restapi.models.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {
    
    List<Performance> findByEmployeeIdOrderByReviewDateDesc(Long employeeId);
    
    List<Performance> findByReviewerIdOrderByReviewDateDesc(Long reviewerId);
    
    Optional<Performance> findByEmployeeIdAndReviewPeriod(Long employeeId, String reviewPeriod);
    
    List<Performance> findByStatus(String status);
    
    List<Performance> findByEmployeeIdAndStatus(Long employeeId, String status);
    
    @Query("SELECT p FROM Performance p WHERE p.reviewDate >= :startDate AND p.reviewDate <= :endDate")
    List<Performance> findByReviewDateBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Performance p WHERE p.employeeId = :employeeId AND p.reviewDate >= :startDate AND p.reviewDate <= :endDate")
    List<Performance> findByEmployeeIdAndReviewDateBetween(@Param("employeeId") Long employeeId,
                                                         @Param("startDate") LocalDateTime startDate,
                                                         @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(p.overallRating) FROM Performance p WHERE p.employeeId = :employeeId")
    Double getAverageOverallRating(@Param("employeeId") Long employeeId);
    
    @Query("SELECT AVG(p.overallRating) FROM Performance p WHERE p.reviewDate >= :startDate")
    Double getAverageOverallRatingSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT p.status, COUNT(p) FROM Performance p GROUP BY p.status")
    List<Object[]> getPerformanceStatsByStatus();
    
    @Query("SELECT p.overallRating, COUNT(p) FROM Performance p GROUP BY p.overallRating ORDER BY p.overallRating")
    List<Object[]> getRatingDistribution();
    
    @Query("SELECT p FROM Performance p WHERE p.nextReviewDate <= :date AND p.status != 'Completed'")
    List<Performance> findUpcomingReviews(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(p) FROM Performance p WHERE p.employeeId = :employeeId AND p.status = 'Pending'")
    Long countPendingReviews(@Param("employeeId") Long employeeId);
    
    @Query("SELECT p FROM Performance p WHERE p.employeeId = :employeeId ORDER BY p.reviewDate DESC LIMIT 1")
    Optional<Performance> findLatestPerformance(@Param("employeeId") Long employeeId);
}
