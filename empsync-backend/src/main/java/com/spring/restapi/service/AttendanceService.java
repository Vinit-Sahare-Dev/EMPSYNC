package com.spring.restapi.service;

import com.spring.restapi.models.Attendance;
import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.AttendanceRepository;
import com.spring.restapi.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AttendanceService {

    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Attendance checkIn(Long employeeId, String location, String notes) {
        logger.info("CHECKING IN EMPLOYEE - ID: {}, Location: {}", employeeId, location);

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty()) {
            throw new IllegalArgumentException("Employee not found with id: " + employeeId);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = now.toLocalDate().atTime(LocalTime.MAX);

        Optional<Attendance> existingAttendance = attendanceRepository
                .findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay)
                .stream()
                .findFirst();

        if (existingAttendance.isPresent()) {
            if (existingAttendance.get().getCheckOut() == null) {
                throw new IllegalStateException("Employee already checked in today");
            } else {
                throw new IllegalStateException("Employee already completed attendance for today");
            }
        }

        Attendance attendance = new Attendance(employeeId, now, now.toLocalDate().atStartOfDay());
        attendance.setLocation(location);
        attendance.setNotes(notes);
        attendance.setStatus("Present");

        Attendance savedAttendance = attendanceRepository.save(attendance);
        logger.info("EMPLOYEE CHECKED IN SUCCESSFULLY - ID: {}, Attendance ID: {}", employeeId, savedAttendance.getId());

        return savedAttendance;
    }

    public Attendance checkOut(Long employeeId, String location, String notes) {
        logger.info("CHECKING OUT EMPLOYEE - ID: {}, Location: {}", employeeId, location);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = now.toLocalDate().atTime(LocalTime.MAX);

        Optional<Attendance> attendanceOpt = attendanceRepository
                .findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay)
                .stream()
                .filter(a -> a.getCheckOut() == null)
                .findFirst();

        if (attendanceOpt.isEmpty()) {
            throw new IllegalStateException("No active check-in found for employee today");
        }

        Attendance attendance = attendanceOpt.get();
        attendance.setCheckOut(now);
        if (location != null) {
            attendance.setLocation(location);
        }
        if (notes != null) {
            attendance.setNotes(notes);
        }

        Attendance savedAttendance = attendanceRepository.save(attendance);
        logger.info("EMPLOYEE CHECKED OUT SUCCESSFULLY - ID: {}, Work Hours: {}, Attendance ID: {}", 
                employeeId, savedAttendance.getWorkHours(), savedAttendance.getId());

        return savedAttendance;
    }

    public List<Attendance> getEmployeeAttendance(Long employeeId) {
        logger.info("GETTING ATTENDANCE FOR EMPLOYEE - ID: {}", employeeId);
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId);
    }

    public List<Attendance> getAttendanceByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        logger.info("GETTING ATTENDANCE BY DATE RANGE - Start: {}, End: {}", startDate, endDate);
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }

    public List<Attendance> getEmployeeAttendanceByDateRange(Long employeeId, LocalDateTime startDate, LocalDateTime endDate) {
        logger.info("GETTING EMPLOYEE ATTENDANCE BY DATE RANGE - Employee ID: {}, Start: {}, End: {}", employeeId, startDate, endDate);
        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
    }

    public Optional<Attendance> getActiveAttendanceByEmployee(Long employeeId) {
        return attendanceRepository.findActiveAttendanceByEmployee(employeeId);
    }

    public Map<String, Object> getAttendanceStats(Long employeeId, LocalDateTime startDate) {
        logger.info("GETTING ATTENDANCE STATS - Employee ID: {}, Start Date: {}", employeeId, startDate);

        Map<String, Object> stats = new HashMap<>();
        
        Long totalDays = attendanceRepository.countAttendanceSince(employeeId, startDate);
        Double avgWorkHours = attendanceRepository.getAverageWorkHours(employeeId, startDate);
        Double totalWorkHours = attendanceRepository.getTotalWorkHours(employeeId, startDate);

        stats.put("totalDays", totalDays != null ? totalDays : 0);
        stats.put("averageWorkHours", avgWorkHours != null ? avgWorkHours : 0.0);
        stats.put("totalWorkHours", totalWorkHours != null ? totalWorkHours : 0.0);

        return stats;
    }

    public Map<String, Object> getOverallAttendanceStats(LocalDateTime startDate) {
        logger.info("GETTING OVERALL ATTENDANCE STATS - Start Date: {}", startDate);

        Map<String, Object> stats = new HashMap<>();
        List<Object[]> attendanceStats = attendanceRepository.getAttendanceStats(startDate);

        Map<String, Long> statusCounts = new HashMap<>();
        for (Object[] stat : attendanceStats) {
            statusCounts.put((String) stat[0], (Long) stat[1]);
        }

        stats.put("statusCounts", statusCounts);
        stats.put("totalRecords", statusCounts.values().stream().mapToLong(Long::longValue).sum());

        return stats;
    }

    public Attendance markAbsent(Long employeeId, String notes) {
        logger.info("MARKING EMPLOYEE ABSENT - ID: {}, Notes: {}", employeeId, notes);

        Optional<Employee> employee = employeeRepository.findById(employeeId);
        if (employee.isEmpty()) {
            throw new IllegalArgumentException("Employee not found with id: " + employeeId);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = now.toLocalDate().atTime(LocalTime.MAX);

        Optional<Attendance> existingAttendance = attendanceRepository
                .findByEmployeeIdAndDateBetween(employeeId, startOfDay, endOfDay)
                .stream()
                .findFirst();

        if (existingAttendance.isPresent()) {
            throw new IllegalStateException("Attendance already recorded for employee today");
        }

        Attendance attendance = new Attendance(employeeId, null, startOfDay);
        attendance.setStatus("Absent");
        attendance.setNotes(notes);

        Attendance savedAttendance = attendanceRepository.save(attendance);
        logger.info("EMPLOYEE MARKED ABSENT SUCCESSFULLY - ID: {}, Attendance ID: {}", employeeId, savedAttendance.getId());

        return savedAttendance;
    }

    public List<Attendance> getAllActiveAttendances() {
        return attendanceRepository.findActiveAttendances();
    }
}
