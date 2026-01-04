package com.spring.restapi.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance")
public class Performance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Employee ID is required")
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;
    
    @NotNull(message = "Review period is required")
    @Column(name = "review_period", nullable = false, length = 50)
    private String reviewPeriod;
    
    @NotNull(message = "Reviewer ID is required")
    @Column(name = "reviewer_id", nullable = false)
    private Long reviewerId;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "overall_rating", nullable = false)
    private Integer overallRating;
    
    @Min(value = 1, message = "Quality rating must be at least 1")
    @Max(value = 5, message = "Quality rating must be at most 5")
    @Column(name = "quality_rating")
    private Integer qualityRating;
    
    @Min(value = 1, message = "Productivity rating must be at least 1")
    @Max(value = 5, message = "Productivity rating must be at most 5")
    @Column(name = "productivity_rating")
    private Integer productivityRating;
    
    @Min(value = 1, message = "Teamwork rating must be at least 1")
    @Max(value = 5, message = "Teamwork rating must be at most 5")
    @Column(name = "teamwork_rating")
    private Integer teamworkRating;
    
    @Min(value = 1, message = "Communication rating must be at least 1")
    @Max(value = 5, message = "Communication rating must be at most 5")
    @Column(name = "communication_rating")
    private Integer communicationRating;
    
    @Min(value = 1, message = "Initiative rating must be at least 1")
    @Max(value = 5, message = "Initiative rating must be at most 5")
    @Column(name = "initiative_rating")
    private Integer initiativeRating;
    
    @Column(name = "strengths", length = 1000)
    private String strengths;
    
    @Column(name = "areas_for_improvement", length = 1000)
    private String areasForImprovement;
    
    @Column(name = "goals", length = 1000)
    private String goals;
    
    @Column(name = "employee_comments", length = 1000)
    private String employeeComments;
    
    @Column(name = "reviewer_comments", length = 1000)
    private String reviewerComments;
    
    @Column(name = "status", length = 20)
    private String status = "Draft";
    
    @Column(name = "review_date")
    private LocalDateTime reviewDate;
    
    @Column(name = "next_review_date")
    private LocalDateTime nextReviewDate;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public Performance() {}
    
    public Performance(Long employeeId, String reviewPeriod, Long reviewerId, Integer overallRating) {
        this.employeeId = employeeId;
        this.reviewPeriod = reviewPeriod;
        this.reviewerId = reviewerId;
        this.overallRating = overallRating;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reviewDate == null) {
            this.reviewDate = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public Double calculateAverageRating() {
        int count = 0;
        double sum = 0;
        
        if (qualityRating != null) { sum += qualityRating; count++; }
        if (productivityRating != null) { sum += productivityRating; count++; }
        if (teamworkRating != null) { sum += teamworkRating; count++; }
        if (communicationRating != null) { sum += communicationRating; count++; }
        if (initiativeRating != null) { sum += initiativeRating; count++; }
        
        return count > 0 ? sum / count : 0.0;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    
    public String getReviewPeriod() { return reviewPeriod; }
    public void setReviewPeriod(String reviewPeriod) { this.reviewPeriod = reviewPeriod; }
    
    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }
    
    public Integer getOverallRating() { return overallRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
    
    public Integer getQualityRating() { return qualityRating; }
    public void setQualityRating(Integer qualityRating) { this.qualityRating = qualityRating; }
    
    public Integer getProductivityRating() { return productivityRating; }
    public void setProductivityRating(Integer productivityRating) { this.productivityRating = productivityRating; }
    
    public Integer getTeamworkRating() { return teamworkRating; }
    public void setTeamworkRating(Integer teamworkRating) { this.teamworkRating = teamworkRating; }
    
    public Integer getCommunicationRating() { return communicationRating; }
    public void setCommunicationRating(Integer communicationRating) { this.communicationRating = communicationRating; }
    
    public Integer getInitiativeRating() { return initiativeRating; }
    public void setInitiativeRating(Integer initiativeRating) { this.initiativeRating = initiativeRating; }
    
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    
    public String getAreasForImprovement() { return areasForImprovement; }
    public void setAreasForImprovement(String areasForImprovement) { this.areasForImprovement = areasForImprovement; }
    
    public String getGoals() { return goals; }
    public void setGoals(String goals) { this.goals = goals; }
    
    public String getEmployeeComments() { return employeeComments; }
    public void setEmployeeComments(String employeeComments) { this.employeeComments = employeeComments; }
    
    public String getReviewerComments() { return reviewerComments; }
    public void setReviewerComments(String reviewerComments) { this.reviewerComments = reviewerComments; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDateTime reviewDate) { this.reviewDate = reviewDate; }
    
    public LocalDateTime getNextReviewDate() { return nextReviewDate; }
    public void setNextReviewDate(LocalDateTime nextReviewDate) { this.nextReviewDate = nextReviewDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @Override
    public String toString() {
        return "Performance{" +
                "id=" + id +
                ", employeeId=" + employeeId +
                ", reviewPeriod='" + reviewPeriod + '\'' +
                ", overallRating=" + overallRating +
                ", status='" + status + '\'' +
                '}';
    }
}
