-- ==========================================================
-- EMPSYNC DATABASE SEEDING
-- ==========================================================

-- 1. Seed Departments
INSERT INTO departments (name, manager_name, description, budget)
SELECT * FROM (SELECT 'Engineering', 'Vinit Sahare', 'Software developement and infrastructure', 5000000.00) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM departments WHERE name = 'Engineering'
) LIMIT 1;

INSERT INTO departments (name, manager_name, description, budget)
SELECT * FROM (SELECT 'HR', 'Anjali Sharma', 'Human resources and recruitment', 1000000.00) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM departments WHERE name = 'HR'
) LIMIT 1;

INSERT INTO departments (name, manager_name, description, budget)
SELECT * FROM (SELECT 'Marketing', 'Priya Iyer', 'Brand management and growth', 2000000.00) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM departments WHERE name = 'Marketing'
) LIMIT 1;

INSERT INTO departments (name, manager_name, description, budget)
SELECT * FROM (SELECT 'Finance', 'Aditya Gupta', 'Financial planning and accounting', 3000000.00) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM departments WHERE name = 'Finance'
) LIMIT 1;

INSERT INTO departments (name, manager_name, description, budget)
SELECT * FROM (SELECT 'IT', 'Sneha Patil', 'Internal IT support and security', 1500000.00) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM departments WHERE name = 'IT'
) LIMIT 1;

INSERT INTO departments (name, manager_name, description, budget)
SELECT * FROM (SELECT 'Sales', 'Amit Patel', 'Direct sales and relationship management', 4000000.00) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM departments WHERE name = 'Sales'
) LIMIT 1;

-- 2. Seed Company Settings
INSERT INTO company_settings (id, company_name, contact_email, contact_phone, address, fiscal_year_start)
SELECT 1, 'EMPSYNC Global Solutions', 'contact@empsync.com', '+91 22 1234 5678', 'BKC, Mumbai, Maharashtra, India', '2023-04-01'
WHERE NOT EXISTS (SELECT id FROM company_settings WHERE id = 1);

-- 3. Seed Users (Admin & Vinit) are handled by AuthService usually, but let's ensure them
-- Using dummy password hashes if we insert directly, but AuthService does it properly
-- Skipping users to avoid conflict with AuthService.initializeDemoUsers()

-- 4. Seed Employees (27 total)
INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Vinit Sahare', 'vinit.sahare@empsync.com', '9876543210', 'Engineering', 'Senior Developer', 120000.00, 'Male', '2023-01-10', 'Pune, Maharashtra', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'vinit.sahare@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Anjali Sharma', 'anjali.sharma@empsync.com', '9890123456', 'HR', 'HR Head', 95000.00, 'Female', '2022-05-15', 'Mumbai, Maharashtra', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'anjali.sharma@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Rahul Verma', 'rahul.verma@empsync.com', '9823456789', 'Engineering', 'Software Engineer', 85000.00, 'Male', '2023-03-20', 'Bangalore, Karnataka', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'rahul.verma@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Priya Iyer', 'priya.iyer@empsync.com', '9123456780', 'Marketing', 'Marketing Manager', 78000.00, 'Female', '2023-06-01', 'Chennai, Tamil Nadu', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'priya.iyer@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Aditya Gupta', 'aditya.gupta@empsync.com', '9988776655', 'Finance', 'Finance Analyst', 72000.00, 'Male', '2022-11-12', 'Delhi, NCR', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'aditya.gupta@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Sneha Patil', 'sneha.patil@empsync.com', '8877665544', 'IT', 'Systems Admin', 65000.00, 'Female', '2023-02-28', 'Nagpur, Maharashtra', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'sneha.patil@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Arjun Reddy', 'arjun.reddy@empsync.com', '7766554433', 'Engineering', 'QA Engineer', 68000.00, 'Male', '2023-08-15', 'Hyderabad, Telangana', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'arjun.reddy@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Amit Patel', 'amit.patel@empsync.com', '9900112233', 'Sales', 'Sales Lead', 90000.00, 'Male', '2022-04-10', 'Ahmedabad, Gujarat', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'amit.patel@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Sunita Gupta', 'sunita.gupta@empsync.com', '9911223344', 'HR', 'Recruiter', 55000.00, 'Female', '2023-05-12', 'Delhi, Delhi', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'sunita.gupta@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Vikram Singh', 'vikram.singh@empsync.com', '9922334455', 'Engineering', 'Backend Developer', 82000.00, 'Male', '2023-02-14', 'Jaipur, Rajasthan', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'vikram.singh@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Kavita Rao', 'kavita.rao@empsync.com', '9933445566', 'Marketing', 'SEO Specialist', 62000.00, 'Female', '2023-07-01', 'Hyderabad, Telangana', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'kavita.rao@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Rajesh Kumar', 'rajesh.kumar@empsync.com', '9944556677', 'Sales', 'Account Executive', 68000.00, 'Male', '2023-01-20', 'Patna, Bihar', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'rajesh.kumar@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Deepa Nair', 'deepa.nair@empsync.com', '9955667788', 'Finance', 'Tax Consultant', 75000.00, 'Female', '2022-09-18', 'Kochi, Kerala', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'deepa.nair@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Suresh Babu', 'suresh.babu@empsync.com', '9966778899', 'Engineering', 'Fullstack Developer', 88000.00, 'Male', '2023-04-22', 'Chennai, Tamil Nadu', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'suresh.babu@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Manoj Tiwari', 'manoj.tiwari@empsync.com', '9977889900', 'Marketing', 'Content Writer', 58000.00, 'Male', '2023-05-30', 'Lucknow, Uttar Pradesh', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'manoj.tiwari@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Ananya Das', 'ananya.das@empsync.com', '9988990011', 'IT', 'Network Engineer', 72000.00, 'Female', '2022-12-05', 'Kolkata, West Bengal', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'ananya.das@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Rohan Deshmukh', 'rohan.deshmukh@empsync.com', '9999001122', 'Engineering', 'Project Manager', 110000.00, 'Male', '2022-03-15', 'Mumbai, Maharashtra', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'rohan.deshmukh@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Shalini Pandey', 'shalini.pandey@empsync.com', '9000112233', 'Finance', 'Auditor', 80000.00, 'Female', '2023-01-05', 'Varanasi, Uttar Pradesh', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'shalini.pandey@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Karthik S', 'karthik.s@empsync.com', '9011223344', 'Engineering', 'Frontend Developer', 78000.00, 'Male', '2023-06-18', 'Bangalore, Karnataka', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'karthik.s@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Neha Agarwal', 'neha.agarwal@empsync.com', '9022334455', 'HR', 'Learning & Dev', 60000.00, 'Female', '2023-04-10', 'Gurgaon, Haryana', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'neha.agarwal@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Arjun Malhotra', 'arjun.malhotra@empsync.com', '9033445566', 'Sales', 'Field Sales', 65000.00, 'Male', '2023-02-25', 'Chandigarh, Punjab', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'arjun.malhotra@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Swati Kulkarni', 'swati.kulkarni@empsync.com', '9044556677', 'Engineering', 'Database Lead', 95000.00, 'Female', '2022-08-30', 'Pune, Maharashtra', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'swati.kulkarni@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Vijay Chauhan', 'vijay.chauhan@empsync.com', '9055667788', 'IT', 'Security Analyst', 85000.00, 'Male', '2023-03-05', 'Indore, Madhya Pradesh', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'vijay.chauhan@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Megha Sharma', 'megha.sharma@empsync.com', '9066778899', 'Marketing', 'Events Lead', 67000.00, 'Female', '2023-01-25', 'Bhopal, Madhya Pradesh', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'megha.sharma@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Santosh Jha', 'santosh.jha@empsync.com', '9077889900', 'Finance', 'Payroll Specialist', 64000.00, 'Male', '2023-05-18', 'Ranchi, Jharkhand', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'santosh.jha@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Pooja Mehta', 'pooja.mehta@empsync.com', '9088990011', 'Sales', 'Tele-Sales', 52000.00, 'Female', '2023-07-22', 'Surat, Gujarat', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'pooja.mehta@empsync.com') LIMIT 1;

INSERT INTO employees (name, email, phone, department, position, salary, gender, join_date, address, status)
SELECT * FROM (SELECT 'Ishaan Bhatt', 'ishaan.bhatt@empsync.com', '9099001122', 'Engineering', 'Intern', 35000.00, 'Male', '2024-01-02', 'Dehradun, Uttarakhand', 'Active') AS tmp
WHERE NOT EXISTS (SELECT email FROM employees WHERE email = 'ishaan.bhatt@empsync.com') LIMIT 1;

