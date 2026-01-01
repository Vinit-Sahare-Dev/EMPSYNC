package com.spring.restapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${empsync.email.from}")
    private String fromEmail;

    @Value("${empsync.app.url}")
    private String appUrl;

    public void sendSimpleEmail(String to, String subject, String text) {
        logger.info("📧 Sending simple email to: {}, Subject: {}", to, subject);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            logger.info("✅ Email sent successfully to {}", to);
        } catch (Exception e) {
            logger.error("❌ Failed to send simple email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Email failed: " + e.getMessage());
        }
    }

    public void sendHtmlEmail(String to, String subject, String html) {
        logger.info("📧 Sending HTML email to: {}, Subject: {}", to, subject);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            logger.info("✅ HTML email sent successfully to {}", to);
        } catch (MessagingException e) {
            logger.error("❌ Failed to send HTML email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Email failed: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String to, String name, String type) {
        String html = "<div style='font-family:sans-serif;padding:20px;'>" +
                "<h1>Welcome to EmpSync, " + name + "!</h1>" +
                "<p>Your account is ready as: <b>" + type + "</b></p>" +
                "<a href='" + appUrl
                + "' style='padding:10px 20px;background:#3b82f6;color:white;text-decoration:none;border-radius:5px;'>Login Now</a>"
                +
                "</div>";
        sendHtmlEmail(to, "Welcome to EmpSync", html);
    }

    public void sendVerificationEmail(String to, String name, String token) {
        String link = appUrl + "/verify-email?token=" + token;
        String html = "<div style='font-family:sans-serif;padding:20px;'>" +
                "<h1>Verify Your Email</h1>" +
                "<p>Hi " + name + ", please click below to verify:</p>" +
                "<a href='" + link
                + "' style='padding:10px 20px;background:#3b82f6;color:white;text-decoration:none;border-radius:5px;'>Verify Email</a>"
                +
                "</div>";
        sendHtmlEmail(to, "Email Verification", html);
    }

    public void sendPasswordResetEmail(String to, String name, String token) {
        String link = appUrl + "/reset-password?token=" + token;
        String html = "<div style='font-family:sans-serif;padding:20px;'>" +
                "<h1>Password Reset</h1>" +
                "<p>Click below to reset your password:</p>" +
                "<a href='" + link
                + "' style='padding:10px 20px;background:#3b82f6;color:white;text-decoration:none;border-radius:5px;'>Reset Password</a>"
                +
                "</div>";
        sendHtmlEmail(to, "Password Reset", html);
    }
}
