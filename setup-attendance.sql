-- EMPSYNC Attendance System Database Setup
-- This script creates the necessary tables and initial data for the attendance tracking system

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'Present',
    work_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0.0,
    location VARCHAR(100),
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_attendance_employee 
        FOREIGN KEY (employee_id) 
        REFERENCES employees(id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_updated_at();

-- Create trigger to calculate work hours automatically
CREATE OR REPLACE FUNCTION calculate_work_hours()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.check_in IS NOT NULL AND NEW.check_out IS NOT NULL THEN
        -- Calculate work hours in decimal format
        NEW.work_hours = EXTRACT(EPOCH FROM (NEW.check_out - NEW.check_in)) / 3600.0;
        
        -- Calculate overtime (hours beyond 8 hours)
        IF NEW.work_hours > 8.0 THEN
            NEW.overtime_hours = NEW.work_hours - 8.0;
        ELSE
            NEW.overtime_hours = 0.0;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_calculate_work_hours
    BEFORE INSERT OR UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION calculate_work_hours();

-- Insert sample attendance data for testing
INSERT INTO attendance (employee_id, check_in, check_out, date, status, location, notes) VALUES
-- Assuming employees with IDs 1, 2, 3, 4 exist from the main system
(1, '2024-01-15 09:00:00', '2024-01-15 17:30:00', '2024-01-15 00:00:00', 'Present', 'Office', 'Regular work day'),
(2, '2024-01-15 08:45:00', '2024-01-15 17:15:00', '2024-01-15 00:00:00', 'Present', 'Office', 'Regular work day'),
(3, '2024-01-15 09:15:00', '2024-01-15 18:00:00', '2024-01-15 00:00:00', 'Present', 'Remote', 'Working from home'),
(4, '2024-01-15 00:00:00', NULL, '2024-01-15 00:00:00', 'Absent', NULL, 'Sick leave'),

(1, '2024-01-16 08:55:00', '2024-01-16 17:00:00', '2024-01-16 00:00:00', 'Present', 'Office', 'Regular work day'),
(2, '2024-01-16 09:30:00', '2024-01-16 18:30:00', '2024-01-16 00:00:00', 'Late', 'Office', 'Late due to traffic'),
(3, '2024-01-16 09:00:00', '2024-01-16 13:00:00', '2024-01-16 00:00:00', 'Half Day', 'Office', 'Half day - personal appointment'),
(4, '2024-01-16 08:45:00', '2024-01-16 17:15:00', '2024-01-16 00:00:00', 'Present', 'Office', 'Regular work day'),

(1, '2024-01-17 09:00:00', NULL, '2024-01-17 00:00:00', 'Present', 'Office', 'Currently working'),
(2, '2024-01-17 08:50:00', NULL, '2024-01-17 00:00:00', 'Present', 'Remote', 'Working from home'),
(3, '2024-01-17 00:00:00', NULL, '2024-01-17 00:00:00', 'Absent', NULL, 'Vacation'),
(4, '2024-01-17 09:05:00', NULL, '2024-01-17 00:00:00', 'Present', 'Office', 'Currently working');

-- Create a view for attendance summary statistics
CREATE OR REPLACE VIEW attendance_summary AS
SELECT 
    e.id as employee_id,
    e.name as employee_name,
    e.department,
    COUNT(a.id) as total_days,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as present_days,
    COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absent_days,
    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) as late_days,
    COUNT(CASE WHEN a.status = 'Half Day' THEN 1 END) as half_days,
    COALESCE(AVG(a.work_hours), 0) as avg_work_hours,
    COALESCE(SUM(a.work_hours), 0) as total_work_hours,
    COALESCE(SUM(a.overtime_hours), 0) as total_overtime_hours
FROM employees e
LEFT JOIN attendance a ON e.id = a.employee_id
WHERE a.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY e.id, e.name, e.department;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON attendance TO your_app_user;
-- GRANT USAGE ON SEQUENCE attendance_id_seq TO your_app_user;
-- GRANT SELECT ON attendance_summary TO your_app_user;

COMMIT;
