package com.spring.restapi.controller;

import com.spring.restapi.models.Performance;
import com.spring.restapi.service.PerformanceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    private static final Logger logger = LoggerFactory.getLogger(PerformanceController.class);

    @Autowired
    private PerformanceService performanceService;

    @PostMapping
    public ResponseEntity<?> createPerformanceReview(@RequestBody Performance performance) {
        logger.info("CREATE PERFORMANCE REVIEW REQUEST - Employee ID: {}, Review Period: {}", 
                performance.getEmployeeId(), performance.getReviewPeriod());

        try {
            Performance savedPerformance = performanceService.createPerformanceReview(performance);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Performance review created successfully");
            response.put("performance", savedPerformance);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (IllegalStateException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error creating performance review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePerformanceReview(@PathVariable Long id, @RequestBody Performance performanceDetails) {
        logger.info("UPDATE PERFORMANCE REVIEW REQUEST - ID: {}", id);

        try {
            Performance updatedPerformance = performanceService.updatePerformanceReview(id, performanceDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Performance review updated successfully");
            response.put("performance", updatedPerformance);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error updating performance review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitPerformanceReview(@PathVariable Long id) {
        logger.info("SUBMIT PERFORMANCE REVIEW REQUEST - ID: {}", id);

        try {
            Performance submittedPerformance = performanceService.submitPerformanceReview(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Performance review submitted successfully");
            response.put("performance", submittedPerformance);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error submitting performance review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approvePerformanceReview(@PathVariable Long id, @RequestParam Long approverId) {
        logger.info("APPROVE PERFORMANCE REVIEW REQUEST - ID: {}, Approver ID: {}", id, approverId);

        try {
            Performance approvedPerformance = performanceService.approvePerformanceReview(id, approverId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Performance review approved successfully");
            response.put("performance", approvedPerformance);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error approving performance review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Map<String, Object>> getEmployeePerformanceHistory(@PathVariable Long employeeId) {
        logger.info("GET EMPLOYEE PERFORMANCE HISTORY REQUEST - Employee ID: {}", employeeId);

        List<Performance> performances = performanceService.getEmployeePerformanceHistory(employeeId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", performances.size());
        response.put("performances", performances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/reviewer/{reviewerId}")
    public ResponseEntity<Map<String, Object>> getReviewerAssignments(@PathVariable Long reviewerId) {
        logger.info("GET REVIEWER ASSIGNMENTS REQUEST - Reviewer ID: {}", reviewerId);

        List<Performance> performances = performanceService.getReviewerAssignments(reviewerId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", performances.size());
        response.put("performances", performances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/period/{reviewPeriod}")
    public ResponseEntity<Map<String, Object>> getPerformanceByEmployeeAndPeriod(
            @PathVariable Long employeeId, 
            @PathVariable String reviewPeriod) {
        logger.info("GET PERFORMANCE BY EMPLOYEE AND PERIOD REQUEST - Employee ID: {}, Period: {}", employeeId, reviewPeriod);

        Optional<Performance> performance = performanceService.getPerformanceByEmployeeAndPeriod(employeeId, reviewPeriod);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("performance", performance.orElse(null));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getPerformanceByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        logger.info("GET PERFORMANCE BY DATE RANGE REQUEST - Start: {}, End: {}", startDate, endDate);

        List<Performance> performances = performanceService.getPerformanceByDateRange(startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", performances.size());
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("performances", performances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPendingReviews() {
        logger.info("GET PENDING REVIEWS REQUEST");

        List<Performance> performances = performanceService.getPendingReviews();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", performances.size());
        response.put("performances", performances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Map<String, Object>> getUpcomingReviews() {
        logger.info("GET UPCOMING REVIEWS REQUEST");

        List<Performance> performances = performanceService.getUpcomingReviews();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", performances.size());
        response.put("performances", performances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/stats")
    public ResponseEntity<Map<String, Object>> getEmployeePerformanceStats(@PathVariable Long employeeId) {
        logger.info("GET EMPLOYEE PERFORMANCE STATS REQUEST - Employee ID: {}", employeeId);

        Map<String, Object> stats = performanceService.getPerformanceStatistics(employeeId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("employeeId", employeeId);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOverallPerformanceStats() {
        logger.info("GET OVERALL PERFORMANCE STATS REQUEST");

        Map<String, Object> stats = performanceService.getOverallPerformanceStatistics();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/employee-comments")
    public ResponseEntity<?> addEmployeeComments(@PathVariable Long id, @RequestBody Map<String, String> request) {
        logger.info("ADD EMPLOYEE COMMENTS REQUEST - ID: {}", id);

        try {
            String comments = request.get("comments");
            Performance performance = performanceService.addEmployeeComments(id, comments);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee comments added successfully");
            response.put("performance", performance);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error adding employee comments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePerformanceReview(@PathVariable Long id) {
        logger.info("DELETE PERFORMANCE REVIEW REQUEST - ID: {}", id);

        try {
            performanceService.deletePerformanceReview(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Performance review deleted successfully");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error deleting performance review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
