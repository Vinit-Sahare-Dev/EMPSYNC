package com.spring.restapi.controller;

import com.spring.restapi.models.Attendance;
import com.spring.restapi.service.AttendanceService;
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
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceController.class);

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, Object> checkInData) {
        logger.info("CHECK-IN REQUEST - Data: {}", checkInData);

        try {
            Long employeeId = ((Number) checkInData.get("employeeId")).longValue();
            String location = (String) checkInData.get("location");
            String notes = (String) checkInData.get("notes");

            Attendance attendance = attendanceService.checkIn(employeeId, location, notes);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Check-in successful");
            response.put("attendance", attendance);

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
            errorResponse.put("message", "Error during check-in: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestBody Map<String, Object> checkOutData) {
        logger.info("CHECK-OUT REQUEST - Data: {}", checkOutData);

        try {
            Long employeeId = ((Number) checkOutData.get("employeeId")).longValue();
            String location = (String) checkOutData.get("location");
            String notes = (String) checkOutData.get("notes");

            Attendance attendance = attendanceService.checkOut(employeeId, location, notes);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Check-out successful");
            response.put("attendance", attendance);

            return ResponseEntity.ok(response);

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
            errorResponse.put("message", "Error during check-out: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Map<String, Object>> getEmployeeAttendance(@PathVariable Long employeeId) {
        logger.info("GET EMPLOYEE ATTENDANCE REQUEST - Employee ID: {}", employeeId);

        List<Attendance> attendances = attendanceService.getEmployeeAttendance(employeeId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", attendances.size());
        response.put("attendances", attendances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/active")
    public ResponseEntity<Map<String, Object>> getActiveAttendance(@PathVariable Long employeeId) {
        logger.info("GET ACTIVE ATTENDANCE REQUEST - Employee ID: {}", employeeId);

        Optional<Attendance> attendance = attendanceService.getActiveAttendanceByEmployee(employeeId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("hasActiveAttendance", attendance.isPresent());
        response.put("attendance", attendance.orElse(null));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getAttendanceByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        logger.info("GET ATTENDANCE BY DATE RANGE REQUEST - Start: {}, End: {}", startDate, endDate);

        List<Attendance> attendances = attendanceService.getAttendanceByDateRange(startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", attendances.size());
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("attendances", attendances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/date-range")
    public ResponseEntity<Map<String, Object>> getEmployeeAttendanceByDateRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        logger.info("GET EMPLOYEE ATTENDANCE BY DATE RANGE REQUEST - Employee ID: {}, Start: {}, End: {}", employeeId, startDate, endDate);

        List<Attendance> attendances = attendanceService.getEmployeeAttendanceByDateRange(employeeId, startDate, endDate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", attendances.size());
        response.put("employeeId", employeeId);
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("attendances", attendances);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}/stats")
    public ResponseEntity<Map<String, Object>> getEmployeeAttendanceStats(
            @PathVariable Long employeeId,
            @RequestParam(defaultValue = "30") int days) {
        logger.info("GET EMPLOYEE ATTENDANCE STATS REQUEST - Employee ID: {}, Days: {}", employeeId, days);

        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        Map<String, Object> stats = attendanceService.getAttendanceStats(employeeId, startDate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("employeeId", employeeId);
        response.put("statsPeriod", days + " days");
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOverallAttendanceStats(
            @RequestParam(defaultValue = "30") int days) {
        logger.info("GET OVERALL ATTENDANCE STATS REQUEST - Days: {}", days);

        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        Map<String, Object> stats = attendanceService.getOverallAttendanceStats(startDate);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("statsPeriod", days + " days");
        response.put("stats", stats);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/mark-absent")
    public ResponseEntity<?> markAbsent(@RequestBody Map<String, Object> absentData) {
        logger.info("MARK ABSENT REQUEST - Data: {}", absentData);

        try {
            Long employeeId = ((Number) absentData.get("employeeId")).longValue();
            String notes = (String) absentData.get("notes");

            Attendance attendance = attendanceService.markAbsent(employeeId, notes);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Employee marked as absent");
            response.put("attendance", attendance);

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
            errorResponse.put("message", "Error marking absent: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getAllActiveAttendances() {
        logger.info("GET ALL ACTIVE ATTENDANCES REQUEST");

        List<Attendance> activeAttendances = attendanceService.getAllActiveAttendances();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", activeAttendances.size());
        response.put("activeAttendances", activeAttendances);

        return ResponseEntity.ok(response);
    }
}
