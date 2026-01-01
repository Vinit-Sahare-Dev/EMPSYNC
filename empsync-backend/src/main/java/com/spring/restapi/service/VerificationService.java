package com.spring.restapi.service;

import com.spring.restapi.models.User;
import com.spring.restapi.models.VerificationToken;
import com.spring.restapi.repository.UserRepository;
import com.spring.restapi.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationService {

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${empsync.email.verification.expiry-hours:24}")
    private int tokenExpiryHours;

    @Transactional
    public void createAndSendEmailVerification(User user) {
        try {
            String token = UUID.randomUUID().toString();
            tokenRepository.save(new VerificationToken(token, user, "EMAIL_VERIFICATION", tokenExpiryHours));
            user.setVerificationSentAt(LocalDateTime.now());
            userRepository.save(user);
            emailService.sendVerificationEmail(user.getEmail(), user.getName(), token);
        } catch (Exception e) {
            throw new RuntimeException("Verification failed: " + e.getMessage());
        }
    }

    @Transactional
    public boolean verifyEmail(String token) {
        Optional<VerificationToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().isExpired() || tokenOpt.get().isUsed())
            return false;

        VerificationToken vt = tokenOpt.get();
        User user = vt.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        vt.setUsed(true);
        tokenRepository.save(vt);
        return true;
    }

    @Transactional
    public void createAndSendPasswordReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            try {
                String token = UUID.randomUUID().toString();
                tokenRepository.save(new VerificationToken(token, user, "PASSWORD_RESET", tokenExpiryHours));
                emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
            } catch (Exception e) {
                throw new RuntimeException("Reset failed: " + e.getMessage());
            }
        });
    }

    public Optional<User> verifyPasswordResetToken(String token) {
        return tokenRepository.findByToken(token)
                .filter(t -> !t.isExpired() && !t.isUsed() && "PASSWORD_RESET".equals(t.getTokenType()))
                .map(VerificationToken::getUser);
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        return verifyPasswordResetToken(token).map(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            tokenRepository.findByToken(token).ifPresent(t -> {
                t.setUsed(true);
                tokenRepository.save(t);
            });
            return true;
        }).orElse(false);
    }

    @Transactional
    public void resendVerificationEmail(User user) {
        // Delete old verification tokens
        tokenRepository.deleteByUserAndTokenType(user, "EMAIL_VERIFICATION");
        createAndSendEmailVerification(user);
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
    }
}