package com.spring.restapi.repository;

import com.spring.restapi.models.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByEmployeeIdOrderByDateDesc(Long employeeId);
    
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDateTime date);
    
    List<Attendance> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Attendance> findByEmployeeIdAndDateBetween(Long employeeId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT a FROM Attendance a WHERE a.checkIn IS NOT NULL AND a.checkOut IS NULL")
    List<Attendance> findActiveAttendances();
    
    @Query("SELECT a FROM Attendance a WHERE a.employeeId = :employeeId AND a.checkIn IS NOT NULL AND a.checkOut IS NULL")
    Optional<Attendance> findActiveAttendanceByEmployee(@Param("employeeId") Long employeeId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.employeeId = :employeeId AND a.date >= :startDate")
    Long countAttendanceSince(@Param("employeeId") Long employeeId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT AVG(a.workHours) FROM Attendance a WHERE a.employeeId = :employeeId AND a.date >= :startDate")
    Double getAverageWorkHours(@Param("employeeId") Long employeeId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(a.workHours) FROM Attendance a WHERE a.employeeId = :employeeId AND a.date >= :startDate")
    Double getTotalWorkHours(@Param("employeeId") Long employeeId, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.date >= :startDate GROUP BY a.status")
    List<Object[]> getAttendanceStats(@Param("startDate") LocalDateTime startDate);
}
