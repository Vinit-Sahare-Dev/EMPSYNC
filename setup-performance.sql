-- EMPSYNC Performance Management System Database Setup
-- This script creates the necessary tables and initial data for the performance evaluation system

-- Create performance table
CREATE TABLE IF NOT EXISTS performance (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    review_period VARCHAR(50) NOT NULL,
    reviewer_id BIGINT NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    productivity_rating INTEGER CHECK (productivity_rating >= 1 AND productivity_rating <= 5),
    teamwork_rating INTEGER CHECK (teamwork_rating >= 1 AND teamwork_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    initiative_rating INTEGER CHECK (initiative_rating >= 1 AND initiative_rating <= 5),
    strengths VARCHAR(1000),
    areas_for_improvement VARCHAR(1000),
    goals VARCHAR(1000),
    employee_comments VARCHAR(1000),
    reviewer_comments VARCHAR(1000),
    status VARCHAR(20) DEFAULT 'Draft',
    review_date TIMESTAMP,
    next_review_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_performance_employee 
        FOREIGN KEY (employee_id) 
        REFERENCES employees(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_performance_reviewer 
        FOREIGN KEY (reviewer_id) 
        REFERENCES employees(id) 
        ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_performance_employee_id ON performance(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviewer_id ON performance(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_performance_review_period ON performance(review_period);
CREATE INDEX IF NOT EXISTS idx_performance_status ON performance(status);
CREATE INDEX IF NOT EXISTS idx_performance_review_date ON performance(review_date);
CREATE INDEX IF NOT EXISTS idx_performance_employee_review_period ON performance(employee_id, review_period);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_performance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_performance_updated_at
    BEFORE UPDATE ON performance
    FOR EACH ROW
    EXECUTE FUNCTION update_performance_updated_at();

-- Insert sample performance data for testing
INSERT INTO performance (employee_id, review_period, reviewer_id, overall_rating, quality_rating, productivity_rating, teamwork_rating, communication_rating, initiative_rating, strengths, areas_for_improvement, goals, reviewer_comments, status, review_date) VALUES
-- Assuming employees with IDs 1, 2, 3, 4 exist from the main system
(1, 'Q4 2023', 2, 4, 4, 4, 5, 4, 3, 'Excellent technical skills, strong problem-solving abilities', 'Time management could be improved', 'Develop leadership skills, complete advanced certification', 'Strong performer with room for growth in leadership', 'Approved', '2023-12-15 10:00:00'),

(2, 'Q4 2023', 1, 5, 5, 5, 4, 5, 5, 'Outstanding performance, exceeds expectations in all areas', 'None identified', 'Mentor junior team members, lead next project', 'Exceptional employee, role model for others', 'Approved', '2023-12-14 14:30:00'),

(3, 'Q4 2023', 2, 3, 3, 3, 3, 3, 3, 'Consistent work, reliable team member', 'Could take more initiative', 'Improve technical skills, suggest process improvements', 'Solid performer, encourage more proactive approach', 'Approved', '2023-12-16 09:15:00'),

(4, 'Q4 2023', 1, 4, 4, 4, 4, 4, 4, 'Good analytical skills, detail-oriented', 'Could improve communication with stakeholders', 'Develop presentation skills, lead client meetings', 'Strong analytical abilities, focus on communication', 'Approved', '2023-12-13 16:45:00'),

-- Q1 2024 reviews (some pending)
(1, 'Q1 2024', 2, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, 'Draft', NULL),

(2, 'Q1 2024', 1, 5, 5, 5, 5, 5, 5, 'Consistently outstanding performance', 'Continue current trajectory', 'Take on strategic initiatives', 'Top performer, consider for promotion track', 'Submitted', '2024-03-15 11:00:00'),

(3, 'Q1 2024', 2, 4, 4, 4, 4, 4, 4, 'Significant improvement from last quarter', 'Continue developing leadership skills', 'Lead small project team', 'Great progress, keep momentum', 'Pending', '2024-03-18 13:30:00');

-- Create a view for performance summary statistics
CREATE OR REPLACE VIEW performance_summary AS
SELECT 
    e.id as employee_id,
    e.name as employee_name,
    e.department,
    COUNT(p.id) as total_reviews,
    COUNT(CASE WHEN p.status = 'Approved' THEN 1 END) as completed_reviews,
    COUNT(CASE WHEN p.status = 'Pending' THEN 1 END) as pending_reviews,
    COALESCE(AVG(p.overall_rating), 0) as average_rating,
    COALESCE(MAX(p.review_date), NULL) as last_review_date,
    COALESCE(MIN(p.next_review_date), NULL) as next_review_date
FROM employees e
LEFT JOIN performance p ON e.id = p.employee_id
GROUP BY e.id, e.name, e.department;

-- Create a view for rating distribution
CREATE OR REPLACE VIEW rating_distribution AS
SELECT 
    overall_rating,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM performance 
WHERE overall_rating > 0
GROUP BY overall_rating
ORDER BY overall_rating DESC;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON performance TO your_app_user;
-- GRANT USAGE ON SEQUENCE performance_id_seq TO your_app_user;
-- GRANT SELECT ON performance_summary TO your_app_user;
-- GRANT SELECT ON rating_distribution TO your_app_user;

COMMIT;
