// src/main/java/com/spring/restapi/service/VerificationService.java
package com.spring.restapi.service;

import com.spring.restapi.models.User;
import com.spring.restapi.models.VerificationToken;
import com.spring.restapi.repository.UserRepository;
import com.spring.restapi.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationService {
    
    private static final Logger logger = LoggerFactory.getLogger(VerificationService.class);
    
    @Autowired
    private VerificationTokenRepository tokenRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${empsync.email.verification.expiry-hours:24}")
    private int tokenExpiryHours;
    
    /**
     * Create and send email verification token
     */
    @Transactional
    public void createAndSendEmailVerification(User user) {
        try {
            // Generate unique token
            String token = UUID.randomUUID().toString();
            
            // Create verification token
            VerificationToken verificationToken = new VerificationToken(
                token, user, "EMAIL_VERIFICATION", tokenExpiryHours
            );
            
            tokenRepository.save(verificationToken);
            
            // Update user's verification sent time
            user.setVerificationSentAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Send verification email
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
            
            logger.info("✅ Email verification sent to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("❌ Failed to send verification email to {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }
    
    /**
     * Verify email with token
     */
    @Transactional
    public boolean verifyEmail(String token) {
        Optional<VerificationToken> verificationTokenOpt = tokenRepository.findByToken(token);
        
        if (verificationTokenOpt.isEmpty()) {
            logger.warn("❌ Invalid verification token: {}", token);
            return false;
        }
        
        VerificationToken verificationToken = verificationTokenOpt.get();
        
        // Check if token is expired
        if (verificationToken.isExpired()) {
            logger.warn("❌ Verification token expired: {}", token);
            return false;
        }
        
        // Check if token is already used
        if (verificationToken.isUsed()) {
            logger.warn("❌ Verification token already used: {}", token);
            return false;
        }
        
        // Mark user as verified
        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        
        // Mark token as used
        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);
        
        logger.info("✅ Email verified successfully for user: {}", user.getEmail());
        return true;
    }
    
    /**
     * Create and send password reset token
     */
    @Transactional
    public void createAndSendPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            logger.warn("❌ Password reset requested for non-existent email: {}", email);
            // Don't reveal that email doesn't exist for security
            return;
        }
        
        User user = userOpt.get();
        
        try {
            // Generate unique token
            String token = UUID.randomUUID().toString();
            
            // Create password reset token
            VerificationToken resetToken = new VerificationToken(
                token, user, "PASSWORD_RESET", tokenExpiryHours
            );
            
            tokenRepository.save(resetToken);
            
            // Send password reset email
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            
            logger.info("✅ Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("❌ Failed to send password reset email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }
    
    /**
     * Verify password reset token
     */
    public Optional<User> verifyPasswordResetToken(String token) {
        Optional<VerificationToken> verificationTokenOpt = tokenRepository.findByToken(token);
        
        if (verificationTokenOpt.isEmpty()) {
            logger.warn("❌ Invalid password reset token: {}", token);
            return Optional.empty();
        }
        
        VerificationToken verificationToken = verificationTokenOpt.get();
        
        // Check if token is expired
        if (verificationToken.isExpired()) {
            logger.warn("❌ Password reset token expired: {}", token);
            return Optional.empty();
        }
        
        // Check if token is already used
        if (verificationToken.isUsed()) {
            logger.warn("❌ Password reset token already used: {}", token);
            return Optional.empty();
        }
        
        // Check if token type is correct
        if (!"PASSWORD_RESET".equals(verificationToken.getTokenType())) {
            logger.warn("❌ Wrong token type for password reset: {}", token);
            return Optional.empty();
        }
        
        return Optional.of(verificationToken.getUser());
    }
    
    /**
     * Reset password with token
     */
    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = verifyPasswordResetToken(token);
        
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // Update password (in production, hash this!)
        user.setPassword(newPassword);
        userRepository.save(user);
        
        // Mark token as used
        Optional<VerificationToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isPresent()) {
            VerificationToken verificationToken = tokenOpt.get();
            verificationToken.setUsed(true);
            tokenRepository.save(verificationToken);
        }
        
        logger.info("✅ Password reset successfully for user: {}", user.getEmail());
        return true;
    }
    
    /**
     * Resend verification email
     */
    @Transactional
    public void resendVerificationEmail(User user) {
        // Delete old verification tokens for this user
        Optional<VerificationToken> oldTokenOpt = 
            tokenRepository.findValidTokenByUserAndType(user, "EMAIL_VERIFICATION", LocalDateTime.now());
        
        oldTokenOpt.ifPresent(tokenRepository::delete);
        
        // Create and send new verification
        createAndSendEmailVerification(user);
        
        logger.info("✅ Verification email resent to: {}", user.getEmail());
    }
    
    /**
     * Clean up expired tokens (runs daily at midnight)
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        logger.info("🧹 Starting cleanup of expired verification tokens...");
        
        try {
            tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
            logger.info("✅ Expired tokens cleanup completed");
        } catch (Exception e) {
            logger.error("❌ Failed to cleanup expired tokens: {}", e.getMessage());
        }
    }
}