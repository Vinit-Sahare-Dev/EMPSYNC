
CREATE DATABASE employee_management_system;


\c employee_management_system;

e
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
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
    status VARCHAR(20) DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    gender VARCHAR(10),
    join_date DATE NOT NULL,
    address VARCHAR(500),
    status VARCHAR(10) DEFAULT 'Active',
    bonus DECIMAL(10,2) DEFAULT 0.00,
    pf DECIMAL(10,2) DEFAULT 0.00,
    tax DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE verification_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    expiry_date TIMESTAMP NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE performance (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id),
    review_period VARCHAR(20) NOT NULL,
    reviewer_id BIGINT NOT NULL REFERENCES employees(id),
    overall_rating DECIMAL(2,1) NOT NULL,
    quality_rating DECIMAL(2,1) NOT NULL,
    productivity_rating DECIMAL(2,1) NOT NULL,
    teamwork_rating DECIMAL(2,1) NOT NULL,
    communication_rating DECIMAL(2,1) NOT NULL,
    initiative_rating DECIMAL(2,1) NOT NULL,
    strengths TEXT NOT NULL,
    areas_for_improvement TEXT NOT NULL,
    goals TEXT NOT NULL,
    reviewer_comments TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    review_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status, bonus, pf, tax) VALUES
('Rajesh Kumar', 'rajesh.kumar@company.com', '+91-9876543210', 'IT', 'Senior Software Engineer', 850000.00, 'Male', '2022-01-15', '123 MG Road, Bangalore, Karnataka', 'Active', 50000.00, 85000.00, 102000.00),
('Priya Sharma', 'priya.sharma@company.com', '+91-9876543211', 'HR', 'HR Manager', 750000.00, 'Female', '2021-06-10', '456 Brigade Road, Bangalore, Karnataka', 'Active', 45000.00, 75000.00, 90000.00),
('Amit Patel', 'amit.patel@company.com', '+91-9876543212', 'Finance', 'Senior Accountant', 650000.00, 'Male', '2022-03-20', '789 Residency Road, Bangalore, Karnataka', 'Active', 35000.00, 65000.00, 78000.00),
('Sneha Reddy', 'sneha.reddy@company.com', '+91-9876543213', 'IT', 'Software Engineer', 600000.00, 'Female', '2022-07-01', '321 Commercial Street, Bangalore, Karnataka', 'Active', 30000.00, 60000.00, 72000.00),
('Vikram Singh', 'vikram.singh@company.com', '+91-9876543214', 'Sales', 'Sales Manager', 700000.00, 'Male', '2021-09-15', '654 Infantry Road, Bangalore, Karnataka', 'Active', 40000.00, 70000.00, 84000.00),
('Anjali Nair', 'anjali.nair@company.com', '+91-9876543215', 'Marketing', 'Marketing Executive', 550000.00, 'Female', '2022-11-10', '987 Church Street, Bangalore, Karnataka', 'Active', 25000.00, 55000.00, 66000.00),
('Rahul Verma', 'rahul.verma@company.com', '+91-9876543216', 'IT', 'DevOps Engineer', 680000.00, 'Male', '2022-02-28', '147 Cunningham Road, Bangalore, Karnataka', 'Active', 38000.00, 68000.00, 81600.00),
('Kavita Menon', 'kavita.menon@company.com', '+91-9876543217', 'Operations', 'Operations Manager', 720000.00, 'Female', '2021-12-05', '258 UB City, Bangalore, Karnataka', 'Active', 42000.00, 72000.00, 86400.00),
('Arjun Joshi', 'arjun.joshi@company.com', '+91-9876543218', 'IT', 'QA Engineer', 520000.00, 'Male', '2023-01-10', '369 Lavelle Road, Bangalore, Karnataka', 'Active', 22000.00, 52000.00, 62400.00),
('Divya Iyer', 'divya.iyer@company.com', '+91-9876543219', 'HR', 'HR Executive', 480000.00, 'Female', '2023-03-15', '741 Vittal Mallya Road, Bangalore, Karnataka', 'Active', 18000.00, 48000.00, 57600.00);


INSERT INTO users (username, password, email, name, role, user_type, department, position, phone_number, employee_id, status, email_verified) VALUES
('rajesh.kumar', '$2a$10$YourHashedPasswordHere', 'rajesh.kumar@company.com', 'Rajesh Kumar', 'EMPLOYEE', 'employee', 'IT', 'Senior Software Engineer', '+91-9876543210', 'EMP001', 'ACTIVE', TRUE),
('priya.sharma', '$2a$10$YourHashedPasswordHere', 'priya.sharma@company.com', 'Priya Sharma', 'MANAGER', 'employee', 'HR', 'HR Manager', '+91-9876543211', 'EMP002', 'ACTIVE', TRUE),
('amit.patel', '$2a$10$YourHashedPasswordHere', 'amit.patel@company.com', 'Amit Patel', 'EMPLOYEE', 'employee', 'Finance', 'Senior Accountant', '+91-9876543212', 'EMP003', 'ACTIVE', TRUE),
('sneha.reddy', '$2a$10$YourHashedPasswordHere', 'sneha.reddy@company.com', 'Sneha Reddy', 'EMPLOYEE', 'employee', 'IT', 'Software Engineer', '+91-9876543213', 'EMP004', 'ACTIVE', TRUE),
('vikram.singh', '$2a$10$YourHashedPasswordHere', 'vikram.singh@company.com', 'Vikram Singh', 'MANAGER', 'employee', 'Sales', 'Sales Manager', '+91-9876543214', 'EMP005', 'ACTIVE', TRUE),
('anjali.nair', '$2a$10$YourHashedPasswordHere', 'anjali.nair@company.com', 'Anjali Nair', 'EMPLOYEE', 'employee', 'Marketing', 'Marketing Executive', '+91-9876543215', 'EMP006', 'ACTIVE', TRUE),
('rahul.verma', '$2a$10$YourHashedPasswordHere', 'rahul.verma@company.com', 'Rahul Verma', 'EMPLOYEE', 'employee', 'IT', 'DevOps Engineer', '+91-9876543216', 'EMP007', 'ACTIVE', TRUE),
('kavita.menon', '$2a$10$YourHashedPasswordHere', 'kavita.menon@company.com', 'Kavita Menon', 'MANAGER', 'employee', 'Operations', 'Operations Manager', '+91-9876543217', 'EMP008', 'ACTIVE', TRUE),
('arjun.joshi', '$2a$10$YourHashedPasswordHere', 'arjun.joshi@company.com', 'Arjun Joshi', 'EMPLOYEE', 'employee', 'IT', 'QA Engineer', '+91-9876543218', 'EMP009', 'ACTIVE', TRUE),
('divya.iyer', '$2a$10$YourHashedPasswordHere', 'divya.iyer@company.com', 'Divya Iyer', 'EMPLOYEE', 'employee', 'HR', 'HR Executive', '+91-9876543219', 'EMP010', 'ACTIVE', TRUE);


INSERT INTO users (username, password, email, name, role, user_type, department, position, phone_number, employee_id, status, email_verified) VALUES
('admin', '$2a$10$YourHashedPasswordHere', 'admin@company.com', 'System Administrator', 'ADMIN', 'admin', 'IT', 'Administrator', '+91-9876543220', 'ADMIN001', 'ACTIVE', TRUE);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX idx_verification_tokens_user_id ON verification_tokens(user_id);



COMMIT;
