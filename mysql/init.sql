-- ==========================================================
-- EMPSYNC DATABASE INITIALIZATION SCRIPT
-- ==========================================================

-- 1. Setup Database
CREATE DATABASE IF NOT EXISTS employee_management_system;
USE employee_management_system;

-- 2. Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    manager_name VARCHAR(100),
    description VARCHAR(255),
    budget DECIMAL(15, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'EMPLOYEE',
    user_type VARCHAR(20) DEFAULT 'employee',
    department VARCHAR(50),
    position VARCHAR(50),
    phone_number VARCHAR(15),
    employee_id VARCHAR(20),
    admin_level VARCHAR(20) DEFAULT 'MANAGER',
    department_access VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. Create Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    gender VARCHAR(10),
    join_date DATE NOT NULL,
    address VARCHAR(500),
    status VARCHAR(10) DEFAULT 'Active',
    bonus DECIMAL(10, 2) DEFAULT 0.00,
    pf DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Create Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) DEFAULT 'Present', -- Present, Absent, Late, On-Leave
    notes VARCHAR(255),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 6. Create Leave Requests Table
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type VARCHAR(50) NOT NULL, -- Sick, Vacation, Personal, Maternity
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Pending', -- Pending, Approved, Rejected
    applied_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 7. Create Verification Tokens Table
CREATE TABLE IF NOT EXISTS verification_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Create Company Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(15),
    address VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'INR',
    fiscal_year_start DATE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. Seed Departments
INSERT INTO departments (name, manager_name, description, budget)
VALUES 
('Engineering', 'Vinit Sahare', 'Software developement and infrastructure', 5000000.00),
('HR', 'Anjali Sharma', 'Human resources and recruitment', 1000000.00),
('Marketing', 'Priya Iyer', 'Brand management and growth', 2000000.00),
('Finance', 'Aditya Gupta', 'Financial planning and accounting', 3000000.00),
('IT', 'Sneha Patil', 'Internal IT support and security', 1500000.00),
('Sales', 'Amit Patel', 'Direct sales and relationship management', 4000000.00);

-- 10. Seed Company Settings
INSERT INTO company_settings (id, company_name, contact_email, contact_phone, address, fiscal_year_start)
VALUES (1, 'EMPSYNC Global Solutions', 'contact@empsync.com', '+91 22 1234 5678', 'BKC, Mumbai, Maharashtra, India', '2023-04-01');

-- 11. Seed Admin User
INSERT INTO users (username, password, email, name, role, user_type, admin_level, status, email_verified)
SELECT 'admin', 'admin123', 'admin@empsync.com', 'System Administrator', 'ADMIN', 'admin', 'SUPER_ADMIN', 'ACTIVE', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

INSERT INTO users (username, password, email, name, role, user_type, status, email_verified, department)
SELECT 'vinit', 'vinit123', 'vinit.sahare@empsync.com', 'Vinit Sahare', 'EMPLOYEE', 'employee', 'ACTIVE', TRUE, 'Engineering'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'vinit');

-- 10. Seed Sample Employees (27 total)
INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
VALUES 
('Vinit Sahare', 'vinit.sahare@empsync.com', '9876543210', 'Engineering', 'Senior Developer', 120000.00, 'Male', '2023-01-10', 'Pune, Maharashtra', 'Active'),
('Anjali Sharma', 'anjali.sharma@empsync.com', '9890123456', 'HR', 'HR Head', 95000.00, 'Female', '2022-05-15', 'Mumbai, Maharashtra', 'Active'),
('Rahul Verma', 'rahul.verma@empsync.com', '9823456789', 'Engineering', 'Software Engineer', 85000.00, 'Male', '2023-03-20', 'Bangalore, Karnataka', 'Active'),
('Priya Iyer', 'priya.iyer@empsync.com', '9123456780', 'Marketing', 'Marketing Manager', 78000.00, 'Female', '2023-06-01', 'Chennai, Tamil Nadu', 'Active'),
('Aditya Gupta', 'aditya.gupta@empsync.com', '9988776655', 'Finance', 'Finance Analyst', 72000.00, 'Male', '2022-11-12', 'Delhi, NCR', 'Active'),
('Sneha Patil', 'sneha.patil@empsync.com', '8877665544', 'IT', 'Systems Admin', 65000.00, 'Female', '2023-02-28', 'Nagpur, Maharashtra', 'Active'),
('Arjun Reddy', 'arjun.reddy@empsync.com', '7766554433', 'Engineering', 'QA Engineer', 68000.00, 'Male', '2023-08-15', 'Hyderabad, Telangana', 'Active'),
('Amit Patel', 'amit.patel@empsync.com', '9900112233', 'Sales', 'Sales Lead', 90000.00, 'Male', '2022-04-10', 'Ahmedabad, Gujarat', 'Active'),
('Sunita Gupta', 'sunita.gupta@empsync.com', '9911223344', 'HR', 'Recruiter', 55000.00, 'Female', '2023-05-12', 'Delhi, Delhi', 'Active'),
('Vikram Singh', 'vikram.singh@empsync.com', '9922334455', 'Engineering', 'Backend Developer', 82000.00, 'Male', '2023-02-14', 'Jaipur, Rajasthan', 'Active'),
('Kavita Rao', 'kavita.rao@empsync.com', '9933445566', 'Marketing', 'SEO Specialist', 62000.00, 'Female', '2023-07-01', 'Hyderabad, Telangana', 'Active'),
('Rajesh Kumar', 'rajesh.kumar@empsync.com', '9944556677', 'Sales', 'Account Executive', 68000.00, 'Male', '2023-01-20', 'Patna, Bihar', 'Active'),
('Deepa Nair', 'deepa.nair@empsync.com', '9955667788', 'Finance', 'Tax Consultant', 75000.00, 'Female', '2022-09-18', 'Kochi, Kerala', 'Active'),
('Suresh Babu', 'suresh.babu@empsync.com', '9966778899', 'Engineering', 'Fullstack Developer', 88000.00, 'Male', '2023-04-22', 'Chennai, Tamil Nadu', 'Active'),
('Manoj Tiwari', 'manoj.tiwari@empsync.com', '9977889900', 'Marketing', 'Content Writer', 58000.00, 'Male', '2023-05-30', 'Lucknow, Uttar Pradesh', 'Active'),
('Ananya Das', 'ananya.das@empsync.com', '9988990011', 'IT', 'Network Engineer', 72000.00, 'Female', '2022-12-05', 'Kolkata, West Bengal', 'Active'),
('Rohan Deshmukh', 'rohan.deshmukh@empsync.com', '9999001122', 'Engineering', 'Project Manager', 110000.00, 'Male', '2022-03-15', 'Mumbai, Maharashtra', 'Active'),
('Shalini Pandey', 'shalini.pandey@empsync.com', '9000112233', 'Finance', 'Auditor', 80000.00, 'Female', '2023-01-05', 'Varanasi, Uttar Pradesh', 'Active'),
('Karthik S', 'karthik.s@empsync.com', '9011223344', 'Engineering', 'Frontend Developer', 78000.00, 'Male', '2023-06-18', 'Bangalore, Karnataka', 'Active'),
('Neha Agarwal', 'neha.agarwal@empsync.com', '9022334455', 'HR', 'Learning & Dev', 60000.00, 'Female', '2023-04-10', 'Gurgaon, Haryana', 'Active'),
('Arjun Malhotra', 'arjun.malhotra@empsync.com', '9033445566', 'Sales', 'Field Sales', 65000.00, 'Male', '2023-02-25', 'Chandigarh, Punjab', 'Active'),
('Swati Kulkarni', 'swati.kulkarni@empsync.com', '9044556677', 'Engineering', 'Database Lead', 95000.00, 'Female', '2022-08-30', 'Pune, Maharashtra', 'Active'),
('Vijay Chauhan', 'vijay.chauhan@empsync.com', '9055667788', 'IT', 'Security Analyst', 85000.00, 'Male', '2023-03-05', 'Indore, Madhya Pradesh', 'Active'),
('Megha Sharma', 'megha.sharma@empsync.com', '9066778899', 'Marketing', 'Events Lead', 67000.00, 'Female', '2023-01-25', 'Bhopal, Madhya Pradesh', 'Active'),
('Santosh Jha', 'santosh.jha@empsync.com', '9077889900', 'Finance', 'Payroll Specialist', 64000.00, 'Male', '2023-05-18', 'Ranchi, Jharkhand', 'Active'),
('Pooja Mehta', 'pooja.mehta@empsync.com', '9088990011', 'Sales', 'Tele-Sales', 52000.00, 'Female', '2023-07-22', 'Surat, Gujarat', 'Active'),
('Ishaan Bhatt', 'ishaan.bhatt@empsync.com', '9099001122', 'Engineering', 'Intern', 35000.00, 'Male', '2024-01-02', 'Dehradun, Uttarakhand', 'Active');

-- 11. Seed some Attendance records
INSERT INTO attendance (employee_id, date, check_in, check_out, status)
VALUES 
(1, CURDATE(), '09:00:00', '18:00:00', 'Present'),
(2, CURDATE(), '09:15:00', '18:15:00', 'Present'),
(3, CURDATE(), '08:45:00', '17:45:00', 'Present'),
(4, CURDATE(), NULL, NULL, 'On-Leave'),
(5, CURDATE(), '10:00:00', '19:00:00', 'Late');
