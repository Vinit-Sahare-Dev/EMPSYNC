// src/main/java/com/spring/restapi/service/EmailService.java
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
    
    /**
     * Send simple text email
     */
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("✉️ Simple email sent to: {}", to);
        } catch (Exception e) {
            logger.error("❌ Failed to send simple email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
    
    /**
     * Send HTML email
     */
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("✉️ HTML email sent to: {}", to);
        } catch (MessagingException e) {
            logger.error("❌ Failed to send HTML email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }
    
    /**
     * Send welcome email to new users
     */
    public void sendWelcomeEmail(String to, String userName, String userType) {
        String subject = "Welcome to EmpSync! 🎉";
        
        String htmlContent = buildWelcomeEmailHtml(userName, userType);
        
        sendHtmlEmail(to, subject, htmlContent);
        logger.info("👋 Welcome email sent to: {} ({})", userName, to);
    }
    
    /**
     * Send email verification link
     */
    public void sendVerificationEmail(String to, String userName, String verificationToken) {
        String subject = "Verify Your EmpSync Email Address";
        
        String verificationLink = appUrl + "/verify-email?token=" + verificationToken;
        String htmlContent = buildVerificationEmailHtml(userName, verificationLink);
        
        sendHtmlEmail(to, subject, htmlContent);
        logger.info("🔐 Verification email sent to: {} ({})", userName, to);
    }
    
    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String to, String userName, String resetToken) {
        String subject = "Reset Your EmpSync Password";
        
        String resetLink = appUrl + "/reset-password?token=" + resetToken;
        String htmlContent = buildPasswordResetEmailHtml(userName, resetLink);
        
        sendHtmlEmail(to, subject, htmlContent);
        logger.info("🔑 Password reset email sent to: {} ({})", userName, to);
    }
    
    /**
     * Build HTML content for welcome email
     */
    private String buildWelcomeEmailHtml(String userName, String userType) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                ".button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }" +
                ".footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }" +
                ".emoji { font-size: 48px; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='emoji'>🎉</div>" +
                "<h1>Welcome to EmpSync!</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + userName + "! 👋</h2>" +
                "<p>We're thrilled to have you join our team! Your account has been successfully created as a <strong>" + userType + "</strong>.</p>" +
                "<p>EmpSync is your all-in-one employee management solution. Here's what you can do:</p>" +
                "<ul>" +
                "<li>✅ Manage your profile and personal information</li>" +
                "<li>📊 View analytics and reports</li>" +
                (userType.equalsIgnoreCase("admin") ? 
                    "<li>👥 Manage employee records</li>" +
                    "<li>📈 Access department analytics</li>" :
                    "<li>👤 View your employee information</li>" +
                    "<li>📅 Track your attendance</li>") +
                "</ul>" +
                "<div style='text-align: center;'>" +
                "<a href='" + appUrl + "' class='button'>Get Started</a>" +
                "</div>" +
                "<p>If you have any questions, feel free to reach out to our support team.</p>" +
                "<p>Best regards,<br>The EmpSync Team</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2025 EmpSync. All rights reserved.</p>" +
                "<p>This is an automated message, please do not reply.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    
    /**
     * Build HTML content for email verification
     */
    private String buildVerificationEmailHtml(String userName, String verificationLink) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                ".button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }" +
                ".footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }" +
                ".emoji { font-size: 48px; }" +
                ".warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='emoji'>🔐</div>" +
                "<h1>Verify Your Email</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + userName + "!</h2>" +
                "<p>Thank you for registering with EmpSync. To complete your registration, please verify your email address by clicking the button below:</p>" +
                "<div style='text-align: center;'>" +
                "<a href='" + verificationLink + "' class='button'>Verify Email Address</a>" +
                "</div>" +
                "<p>Or copy and paste this link into your browser:</p>" +
                "<p style='background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;'>" + verificationLink + "</p>" +
                "<div class='warning'>" +
                "<strong>⚠️ Security Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with EmpSync, please ignore this email." +
                "</div>" +
                "<p>Best regards,<br>The EmpSync Team</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2025 EmpSync. All rights reserved.</p>" +
                "<p>This is an automated message, please do not reply.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
    
    /**
     * Build HTML content for password reset
     */
    private String buildPasswordResetEmailHtml(String userName, String resetLink) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }" +
                ".button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }" +
                ".footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }" +
                ".emoji { font-size: 48px; }" +
                ".warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<div class='emoji'>🔑</div>" +
                "<h1>Reset Your Password</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Hello " + userName + "!</h2>" +
                "<p>We received a request to reset your password for your EmpSync account. Click the button below to create a new password:</p>" +
                "<div style='text-align: center;'>" +
                "<a href='" + resetLink + "' class='button'>Reset Password</a>" +
                "</div>" +
                "<p>Or copy and paste this link into your browser:</p>" +
                "<p style='background: #fff; padding: 10px; border: 1px solid #ddd; word-break: break-all;'>" + resetLink + "</p>" +
                "<div class='warning'>" +
                "<strong>⚠️ Security Alert:</strong> This password reset link will expire in 24 hours. If you didn't request a password reset, please ignore this email and your password will remain unchanged." +
                "</div>" +
                "<p>For security reasons, we recommend:</p>" +
                "<ul>" +
                "<li>Using a strong, unique password</li>" +
                "<li>Not sharing your password with anyone</li>" +
                "<li>Changing your password regularly</li>" +
                "</ul>" +
                "<p>Best regards,<br>The EmpSync Team</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>© 2025 EmpSync. All rights reserved.</p>" +
                "<p>This is an automated message, please do not reply.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}
