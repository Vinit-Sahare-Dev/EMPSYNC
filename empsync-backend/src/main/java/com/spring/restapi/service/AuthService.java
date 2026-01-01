package com.spring.restapi.service;

import com.spring.restapi.dto.AuthResponse;
import com.spring.restapi.dto.LoginRequest;
import com.spring.restapi.dto.RegisterRequest;
import com.spring.restapi.models.User;
import com.spring.restapi.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse authenticate(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                if (!user.isEmailVerified() && !"admin".equals(user.getUserType())) {
                    return new AuthResponse(false, "Email not verified. Please check your inbox.", null, null, null, null);
                }
                return new AuthResponse(true, "Login successful", user.getUsername(), user.getName(), user.getRole(), user.getUserType());
            }
        }
        return new AuthResponse(false, "Invalid username or password", null, null, null, null);
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return new AuthResponse(false, "Username already exists", null, null, null, null);
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new AuthResponse(false, "Email already exists", null, null, null, null);
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setName(registerRequest.getName());
        user.setUserType(registerRequest.getUserType());
        user.setRole("admin".equalsIgnoreCase(registerRequest.getUserType()) ? "ADMIN" : "EMPLOYEE");
        
        user.setDepartment(registerRequest.getDepartment());
        user.setPosition(registerRequest.getPosition());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setEmployeeId(registerRequest.getEmployeeId());
        if ("admin".equalsIgnoreCase(registerRequest.getUserType())) {
            user.setAdminLevel(registerRequest.getAdminLevel() != null ? registerRequest.getAdminLevel() : "MANAGER");
            user.setDepartmentAccess(registerRequest.getDepartmentAccess() != null ? registerRequest.getDepartmentAccess() : "ALL");
        } else {
            user.setAdminLevel(null);
            user.setDepartmentAccess(null);
        }
        user.setStatus("ACTIVE");
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            verificationService.createAndSendEmailVerification(savedUser);
            return new AuthResponse(true, "Registration successful! Please verify your email.", savedUser.getUsername(), savedUser.getName(), savedUser.getRole(), savedUser.getUserType());
        } catch (Exception e) {
            logger.error("Failed to send verification email: {}", e.getMessage());
            return new AuthResponse(true, "Registration successful, but failed to send verification email.", savedUser.getUsername(), savedUser.getName(), savedUser.getRole(), savedUser.getUserType());
        }
    }

    public Map<String, Object> getDemoCredentials() {
        Map<String, Object> demoUsers = new HashMap<>();
        
        Map<String, String> admin = new HashMap<>();
        admin.put("username", "admin");
        admin.put("password", "admin123");
        admin.put("role", "ADMIN");
        
        Map<String, String> employee = new HashMap<>();
        employee.put("username", "vinit");
        employee.put("password", "vinit123");
        employee.put("role", "EMPLOYEE");
        
        demoUsers.put("admin", admin);
        demoUsers.put("employee", employee);
        
        return demoUsers;
    }

    @Transactional
    public void initializeDemoUsers() {
        // Initialize Admin
        userRepository.findByUsername("admin").ifPresentOrElse(
            admin -> {
                if (!passwordEncoder.matches("admin123", admin.getPassword())) {
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    userRepository.save(admin);
                    logger.info("Updated admin password to secure hash");
                }
            },
            () -> {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@empsync.com");
                admin.setName("System Administrator");
                admin.setRole("ADMIN");
                admin.setUserType("admin");
                admin.setAdminLevel("SUPER_ADMIN");
                admin.setStatus("ACTIVE");
                admin.setEmailVerified(true);
                userRepository.save(admin);
                logger.info("Demo admin user created with secure hash");
            }
        );

        // Initialize Vinit
        userRepository.findByUsername("vinit").ifPresentOrElse(
            vinit -> {
                if (!passwordEncoder.matches("vinit123", vinit.getPassword())) {
                    vinit.setPassword(passwordEncoder.encode("vinit123"));
                    userRepository.save(vinit);
                    logger.info("Updated vinit password to secure hash");
                }
            },
            () -> {
                User vinit = new User();
                vinit.setUsername("vinit");
                vinit.setPassword(passwordEncoder.encode("vinit123"));
                vinit.setEmail("vinit.sahare@empsync.com");
                vinit.setName("Vinit Sahare");
                vinit.setRole("EMPLOYEE");
                vinit.setUserType("employee");
                vinit.setStatus("ACTIVE");
                vinit.setEmailVerified(true);
                vinit.setDepartment("Engineering");
                userRepository.save(vinit);
                logger.info("Demo employee user created with secure hash");
            }
        );
    }
}
