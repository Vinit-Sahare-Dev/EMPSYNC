package com.spring.restapi.service;

import com.spring.restapi.models.Employee;
import com.spring.restapi.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // ← ADD THIS IMPORT

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional  // ← Now this will work
    public Employee saveEmployee(Employee employee) {
        // Apply business rules
        calculateEmployeeBenefits(employee);
        
        return employeeRepository.save(employee);
    }
    
    private void calculateEmployeeBenefits(Employee employee) {
        Double salary = employee.getSalary();

        // Bonus: 10% if salary > 30000
        if (salary > 30000) {
            employee.setBonus(salary * 0.10);
        } else {
            employee.setBonus(0.0);
        }
        
        // PF: 5% of salary
        employee.setPf(salary * 0.05);
        
        // Tax: 30% of salary
        employee.setTax(salary * 0.30);
    }
}