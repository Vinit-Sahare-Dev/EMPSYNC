// src/main/java/com/spring/restapi/controller/AuthController.java
package com.spring.restapi.controller;

import com.spring.restapi.dto.LoginRequest;
import com.spring.restapi.dto.RegisterRequest;
import com.spring.restapi.dto.AuthResponse;
import com.spring.restapi.models.User;
import com.spring.restapi.repository.UserRepository;
import com.spring.restapi.service.AuthService;
import com.spring.restapi.service.VerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private VerificationService verificationService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("🔐 Login request for user: {}", loginRequest.getUsername());

            AuthResponse response = authService.authenticate(loginRequest);

            if (response.isSuccess()) {
                logger.info("✅ Login successful for user: {}", loginRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("❌ Login failed for user: {}", loginRequest.getUsername());
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Login error for user {}: {}", loginRequest.getUsername(), e.getMessage());
            AuthResponse errorResponse = new AuthResponse(false, "Login failed: " + e.getMessage(), null, null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/register/employee")
    public ResponseEntity<AuthResponse> registerEmployee(@RequestBody RegisterRequest registerRequest) {
        try {
            registerRequest.setUserType("employee");
            logger.info("👤 Employee registration: {}", registerRequest.getUsername());

            AuthResponse response = authService.register(registerRequest);

            if (response.isSuccess()) {
                logger.info("✅ Employee registered successfully: {}", registerRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("❌ Employee registration failed: {}", registerRequest.getUsername());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Employee registration error: {}", e.getMessage());
            AuthResponse errorResponse = new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AuthResponse> registerAdmin(@RequestBody RegisterRequest registerRequest) {
        try {
            registerRequest.setUserType("admin");
            logger.info("👑 Admin registration: {}", registerRequest.getUsername());

            AuthResponse response = authService.register(registerRequest);

            if (response.isSuccess()) {
                logger.info("✅ Admin registered successfully: {}", registerRequest.getUsername());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("❌ Admin registration failed: {}", registerRequest.getUsername());
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Admin registration error: {}", e.getMessage());
            AuthResponse errorResponse = new AuthResponse(false, "Registration failed: " + e.getMessage(), null, null, null, null);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Verify Email
    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestParam String token) {
        try {
            logger.info("📧 Email verification request with token: {}", token.substring(0, 8) + "...");

            boolean verified = verificationService.verifyEmail(token);

            Map<String, Object> response = new HashMap<>();
            if (verified) {
                response.put("success", true);
                response.put("message", "Email verified successfully! You can now log in.");
                logger.info("✅ Email verified successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired verification token");
                logger.warn("❌ Email verification failed");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Email verification error: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Verification failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Resend Verification Email
    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Object>> resendVerification(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            logger.info("📧 Resend verification request for: {}", email);

            Optional<User> userOpt = userRepository.findByEmail(email);

            Map<String, Object> response = new HashMap<>();
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();

            if (user.isEmailVerified()) {
                response.put("success", false);
                response.put("message", "Email is already verified");
                return ResponseEntity.badRequest().body(response);
            }

            verificationService.resendVerificationEmail(user);

            response.put("success", true);
            response.put("message", "Verification email sent successfully");
            logger.info("✅ Verification email resent to: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("🚨 Resend verification error: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to resend verification: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Forgot Password
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            logger.info("🔑 Forgot password request for: {}", email);

            verificationService.createAndSendPasswordReset(email);

            // Always return success to prevent email enumeration
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "If the email exists, password reset instructions have been sent");

            logger.info("✅ Password reset email processed for: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("🚨 Forgot password error: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to process request: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // NEW ENDPOINT: Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            logger.info("🔑 Password reset request with token: {}", token.substring(0, 8) + "...");

            boolean reset = verificationService.resetPassword(token, newPassword);

            Map<String, Object> response = new HashMap<>();
            if (reset) {
                response.put("success", true);
                response.put("message", "Password reset successfully! You can now log in with your new password.");
                logger.info("✅ Password reset successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired reset token");
                logger.warn("❌ Password reset failed");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            logger.error("🚨 Password reset error: {}", e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Password reset failed: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/demo-credentials")
    public ResponseEntity<Map<String, Object>> getDemoCredentials() {
        try {
            Map<String, Object> demoCreds = authService.getDemoCredentials();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("demoUsers", demoCreds);
            response.put("message", "Use these credentials for testing:");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get demo credentials: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<AuthResponse> status() {
        AuthResponse response = new AuthResponse(true, "Auth service is running", null, null, null, null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        AuthResponse response = new AuthResponse(true, "Logout successful", null, null, null, null);
        return ResponseEntity.ok(response);
    }
}