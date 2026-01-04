package com.spring.restapi.service;

import com.spring.restapi.models.Performance;
import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.PerformanceRepository;
import com.spring.restapi.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class PerformanceService {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceService.class);

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Performance createPerformanceReview(Performance performance) {
        logger.info("CREATING PERFORMANCE REVIEW - Employee ID: {}, Review Period: {}", 
                performance.getEmployeeId(), performance.getReviewPeriod());

        Optional<Employee> employee = employeeRepository.findById(performance.getEmployeeId());
        if (employee.isEmpty()) {
            throw new IllegalArgumentException("Employee not found with id: " + performance.getEmployeeId());
        }

        Optional<Employee> reviewer = employeeRepository.findById(performance.getReviewerId());
        if (reviewer.isEmpty()) {
            throw new IllegalArgumentException("Reviewer not found with id: " + performance.getReviewerId());
        }

        Optional<Performance> existingReview = performanceRepository
                .findByEmployeeIdAndReviewPeriod(performance.getEmployeeId(), performance.getReviewPeriod());

        if (existingReview.isPresent()) {
            throw new IllegalStateException("Performance review already exists for employee " + 
                    performance.getEmployeeId() + " for period " + performance.getReviewPeriod());
        }

        Performance savedPerformance = performanceRepository.save(performance);
        logger.info("PERFORMANCE REVIEW CREATED SUCCESSFULLY - ID: {}, Employee ID: {}", 
                savedPerformance.getId(), savedPerformance.getEmployeeId());

        return savedPerformance;
    }

    public Performance updatePerformanceReview(Long id, Performance performanceDetails) {
        logger.info("UPDATING PERFORMANCE REVIEW - ID: {}", id);

        Optional<Performance> existingPerformance = performanceRepository.findById(id);
        if (existingPerformance.isEmpty()) {
            throw new IllegalArgumentException("Performance review not found with id: " + id);
        }

        Performance performance = existingPerformance.get();
        
        performance.setOverallRating(performanceDetails.getOverallRating());
        performance.setQualityRating(performanceDetails.getQualityRating());
        performance.setProductivityRating(performanceDetails.getProductivityRating());
        performance.setTeamworkRating(performanceDetails.getTeamworkRating());
        performance.setCommunicationRating(performanceDetails.getCommunicationRating());
        performance.setInitiativeRating(performanceDetails.getInitiativeRating());
        performance.setStrengths(performanceDetails.getStrengths());
        performance.setAreasForImprovement(performanceDetails.getAreasForImprovement());
        performance.setGoals(performanceDetails.getGoals());
        performance.setEmployeeComments(performanceDetails.getEmployeeComments());
        performance.setReviewerComments(performanceDetails.getReviewerComments());
        performance.setStatus(performanceDetails.getStatus());
        performance.setReviewDate(performanceDetails.getReviewDate());
        performance.setNextReviewDate(performanceDetails.getNextReviewDate());

        Performance savedPerformance = performanceRepository.save(performance);
        logger.info("PERFORMANCE REVIEW UPDATED SUCCESSFULLY - ID: {}", savedPerformance.getId());

        return savedPerformance;
    }

    public Performance submitPerformanceReview(Long id) {
        logger.info("SUBMITTING PERFORMANCE REVIEW - ID: {}", id);

        Optional<Performance> existingPerformance = performanceRepository.findById(id);
        if (existingPerformance.isEmpty()) {
            throw new IllegalArgumentException("Performance review not found with id: " + id);
        }

        Performance performance = existingPerformance.get();
        performance.setStatus("Submitted");
        performance.setReviewDate(LocalDateTime.now());

        Performance savedPerformance = performanceRepository.save(performance);
        logger.info("PERFORMANCE REVIEW SUBMITTED SUCCESSFULLY - ID: {}", savedPerformance.getId());

        return savedPerformance;
    }

    public Performance approvePerformanceReview(Long id, Long approverId) {
        logger.info("APPROVING PERFORMANCE REVIEW - ID: {}, Approver ID: {}", id, approverId);

        Optional<Performance> existingPerformance = performanceRepository.findById(id);
        if (existingPerformance.isEmpty()) {
            throw new IllegalArgumentException("Performance review not found with id: " + id);
        }

        Performance performance = existingPerformance.get();
        performance.setStatus("Approved");
        performance.setReviewDate(LocalDateTime.now());

        Performance savedPerformance = performanceRepository.save(performance);
        logger.info("PERFORMANCE REVIEW APPROVED SUCCESSFULLY - ID: {}", savedPerformance.getId());

        return savedPerformance;
    }

    public List<Performance> getEmployeePerformanceHistory(Long employeeId) {
        logger.info("GETTING EMPLOYEE PERFORMANCE HISTORY - Employee ID: {}", employeeId);
        return performanceRepository.findByEmployeeIdOrderByReviewDateDesc(employeeId);
    }

    public List<Performance> getReviewerAssignments(Long reviewerId) {
        logger.info("GETTING REVIEWER ASSIGNMENTS - Reviewer ID: {}", reviewerId);
        return performanceRepository.findByReviewerIdOrderByReviewDateDesc(reviewerId);
    }

    public Optional<Performance> getPerformanceByEmployeeAndPeriod(Long employeeId, String reviewPeriod) {
        logger.info("GETTING PERFORMANCE BY EMPLOYEE AND PERIOD - Employee ID: {}, Period: {}", employeeId, reviewPeriod);
        return performanceRepository.findByEmployeeIdAndReviewPeriod(employeeId, reviewPeriod);
    }

    public List<Performance> getPerformanceByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        logger.info("GETTING PERFORMANCE BY DATE RANGE - Start: {}, End: {}", startDate, endDate);
        return performanceRepository.findByReviewDateBetween(startDate, endDate);
    }

    public List<Performance> getPendingReviews() {
        logger.info("GETTING PENDING REVIEWS");
        return performanceRepository.findByStatus("Pending");
    }

    public List<Performance> getUpcomingReviews() {
        logger.info("GETTING UPCOMING REVIEWS");
        LocalDateTime thirtyDaysFromNow = LocalDateTime.now().plusDays(30);
        return performanceRepository.findUpcomingReviews(thirtyDaysFromNow);
    }

    public Map<String, Object> getPerformanceStatistics(Long employeeId) {
        logger.info("GETTING PERFORMANCE STATISTICS - Employee ID: {}", employeeId);

        Map<String, Object> stats = new HashMap<>();
        
        Double avgRating = performanceRepository.getAverageOverallRating(employeeId);
        Long pendingCount = performanceRepository.countPendingReviews(employeeId);
        Optional<Performance> latestPerformance = performanceRepository.findLatestPerformance(employeeId);

        stats.put("averageRating", avgRating != null ? avgRating : 0.0);
        stats.put("pendingReviews", pendingCount != null ? pendingCount : 0);
        stats.put("latestPerformance", latestPerformance.orElse(null));

        return stats;
    }

    public Map<String, Object> getOverallPerformanceStatistics() {
        logger.info("GETTING OVERALL PERFORMANCE STATISTICS");

        Map<String, Object> stats = new HashMap<>();
        
        Double avgRating = performanceRepository.getAverageOverallRatingSince(LocalDateTime.now().minusMonths(12));
        List<Object[]> statusStats = performanceRepository.getPerformanceStatsByStatus();
        List<Object[]> ratingDistribution = performanceRepository.getRatingDistribution();

        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] stat : statusStats) {
            statusCounts.put((String) stat[0], (Long) stat[1]);
        }

        Map<Integer, Long> ratingCounts = new HashMap<>();
        for (Object[] stat : ratingDistribution) {
            ratingCounts.put((Integer) stat[0], (Long) stat[1]);
        }

        stats.put("averageRating", avgRating != null ? avgRating : 0.0);
        stats.put("statusCounts", statusCounts);
        stats.put("ratingDistribution", ratingCounts);

        return stats;
    }

    public void deletePerformanceReview(Long id) {
        logger.info("DELETING PERFORMANCE REVIEW - ID: {}", id);

        Optional<Performance> existingPerformance = performanceRepository.findById(id);
        if (existingPerformance.isEmpty()) {
            throw new IllegalArgumentException("Performance review not found with id: " + id);
        }

        performanceRepository.deleteById(id);
        logger.info("PERFORMANCE REVIEW DELETED SUCCESSFULLY - ID: {}", id);
    }

    public Performance addEmployeeComments(Long id, String comments) {
        logger.info("ADDING EMPLOYEE COMMENTS - ID: {}", id);

        Optional<Performance> existingPerformance = performanceRepository.findById(id);
        if (existingPerformance.isEmpty()) {
            throw new IllegalArgumentException("Performance review not found with id: " + id);
        }

        Performance performance = existingPerformance.get();
        performance.setEmployeeComments(comments);
        performance.setStatus("Employee Commented");

        Performance savedPerformance = performanceRepository.save(performance);
        logger.info("EMPLOYEE COMMENTS ADDED SUCCESSFULLY - ID: {}", savedPerformance.getId());

        return savedPerformance;
    }
}
