package com.spring.restapi.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Employee ID is required")
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;
    
    @Column(name = "check_in", nullable = false)
    private LocalDateTime checkIn;
    
    @Column(name = "check_out")
    private LocalDateTime checkOut;
    
    @Column(name = "date", nullable = false)
    private LocalDateTime date;
    
    @Column(name = "status", length = 20)
    private String status = "Present";
    
    @Column(name = "work_hours", precision = 5, scale = 2)
    private Double workHours;
    
    @Column(name = "overtime_hours", precision = 5, scale = 2)
    private Double overtimeHours = 0.0;
    
    @Column(name = "location", length = 100)
    private String location;
    
    @Column(name = "notes", length = 500)
    private String notes;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Attendance() {}
    
    public Attendance(Long employeeId, LocalDateTime checkIn, LocalDateTime date) {
        this.employeeId = employeeId;
        this.checkIn = checkIn;
        this.date = date;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.date == null) {
            this.date = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateWorkHours();
    }
    
    private void calculateWorkHours() {
        if (checkIn != null && checkOut != null) {
            long minutes = java.time.Duration.between(checkIn, checkOut).toMinutes();
            this.workHours = minutes / 60.0;
            
            if (this.workHours > 8.0) {
                this.overtimeHours = this.workHours - 8.0;
            }
        }
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    
    public LocalDateTime getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDateTime checkIn) { this.checkIn = checkIn; }
    
    public LocalDateTime getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDateTime checkOut) { this.checkOut = checkOut; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Double getWorkHours() { return workHours; }
    public void setWorkHours(Double workHours) { this.workHours = workHours; }
    
    public Double getOvertimeHours() { return overtimeHours; }
    public void setOvertimeHours(Double overtimeHours) { this.overtimeHours = overtimeHours; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @Override
    public String toString() {
        return "Attendance{" +
                "id=" + id +
                ", employeeId=" + employeeId +
                ", checkIn=" + checkIn +
                ", checkOut=" + checkOut +
                ", workHours=" + workHours +
                ", status='" + status + '\'' +
                '}';
    }
}
