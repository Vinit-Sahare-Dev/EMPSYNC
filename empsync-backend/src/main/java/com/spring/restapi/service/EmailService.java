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
        String html = "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>Welcome to EmpSync</title>\n" +
            "</head>\n" +
            "<body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;\">\n" +
            "    <div style=\"max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin-top: 20px; margin-bottom: 20px;\">\n" +
            "        <!-- Header -->\n" +
            "        <div style=\"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;\">\n" +
            "            <div style=\"font-size: 32px; font-weight: bold; color: white; margin-bottom: 8px;\">🚀 EmpSync</div>\n" +
            "            <div style=\"color: rgba(255, 255, 255, 0.9); font-size: 16px;\">Employee Management System</div>\n" +
            "        </div>\n" +
            "        \n" +
            "        <!-- Content -->\n" +
            "        <div style=\"padding: 40px 30px;\">\n" +
            "            <div style=\"text-align: center; margin-bottom: 30px;\">\n" +
            "                <div style=\"font-size: 24px; color: #1f2937; margin-bottom: 10px;\">Welcome aboard, " + name + "! 👋</div>\n" +
            "                <div style=\"color: #6b7280; font-size: 16px; line-height: 1.6;\">We're thrilled to have you join our team</div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;\">\n" +
            "                <div style=\"color: #1e40af; font-weight: 600; margin-bottom: 8px;\">Your Account Details</div>\n" +
            "                <div style=\"color: #374151;\">\n" +
            "                    <div style=\"margin-bottom: 8px;\"><strong>Account Type:</strong> <span style=\"color: #3b82f6;\">" + type + "</span></div>\n" +
            "                    <div style=\"margin-bottom: 8px;\"><strong>Email:</strong> " + to + "</div>\n" +
            "                    <div><strong>Status:</strong> <span style=\"color: #10b981;\">✅ Active</span></div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"text-align: center; margin: 35px 0;\">\n" +
            "                <a href='" + appUrl + "' style=\"display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;\">\n" +
            "                    🎯 Get Started Now\n" +
            "                </a>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"border-top: 1px solid #e5e7eb; padding-top: 25px; margin-top: 30px;\">\n" +
            "                <div style=\"color: #6b7280; font-size: 14px; text-align: center;\">\n" +
            "                    <div style=\"margin-bottom: 15px;\"><strong>What's Next?</strong></div>\n" +
            "                    <div style=\"display: flex; justify-content: space-around; text-align: center;\">\n" +
            "                        <div style=\"flex: 1;\">\n" +
            "                            <div style=\"font-size: 24px; margin-bottom: 8px;\">📊</div>\n" +
            "                            <div style=\"font-size: 12px; color: #9ca3af;\">Dashboard</div>\n" +
            "                        </div>\n" +
            "                        <div style=\"flex: 1;\">\n" +
            "                            <div style=\"font-size: 24px; margin-bottom: 8px;\">👥</div>\n" +
            "                            <div style=\"font-size: 12px; color: #9ca3af;\">Team</div>\n" +
            "                        </div>\n" +
            "                        <div style=\"flex: 1;\">\n" +
            "                            <div style=\"font-size: 24px; margin-bottom: 8px;\">⚙️</div>\n" +
            "                            <div style=\"font-size: 12px; color: #9ca3af;\">Settings</div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        \n" +
            "        <!-- Footer -->\n" +
            "        <div style=\"background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;\">\n" +
            "            <div style=\"color: #6b7280; font-size: 14px; margin-bottom: 15px;\">\n" +
            "                Need help? <a href=\"#\" style=\"color: #3b82f6; text-decoration: none;\">Contact Support</a>\n" +
            "            </div>\n" +
            "            <div style=\"color: #9ca3af; font-size: 12px;\">\n" +
            "                © 2026 EmpSync. All rights reserved. | \n" +
            "                <a href=\"#\" style=\"color: #9ca3af; text-decoration: none;\">Privacy Policy</a> | \n" +
            "                <a href=\"#\" style=\"color: #9ca3af; text-decoration: none;\">Terms of Service</a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>";
        sendHtmlEmail(to, "🎉 Welcome to EmpSync - Your Journey Starts Here!", html);
    }

    public void sendVerificationEmail(String to, String name, String token) {
        String link = appUrl + "/verify-email?token=" + token;
        String html = "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>Verify Your Email - EmpSync</title>\n" +
            "</head>\n" +
            "<body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;\">\n" +
            "    <div style=\"max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin-top: 20px; margin-bottom: 20px;\">\n" +
            "        <!-- Header -->\n" +
            "        <div style=\"background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;\">\n" +
            "            <div style=\"font-size: 32px; font-weight: bold; color: white; margin-bottom: 8px;\">✉️ EmpSync</div>\n" +
            "            <div style=\"color: rgba(255, 255, 255, 0.9); font-size: 16px;\">Email Verification Required</div>\n" +
            "        </div>\n" +
            "        \n" +
            "        <!-- Content -->\n" +
            "        <div style=\"padding: 40px 30px;\">\n" +
            "            <div style=\"text-align: center; margin-bottom: 30px;\">\n" +
            "                <div style=\"font-size: 24px; color: #1f2937; margin-bottom: 10px;\">Hi " + name + ", let's get you verified! 🔐</div>\n" +
            "                <div style=\"color: #6b7280; font-size: 16px; line-height: 1.6;\">One last step to activate your account</div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;\">\n" +
            "                <div style=\"color: #047857; font-weight: 600; margin-bottom: 8px;\">Why verify your email?</div>\n" +
            "                <div style=\"color: #374151; font-size: 14px;\">\n" +
            "                    <div style=\"margin-bottom: 8px;\">✅ Secure your account</div>\n" +
            "                    <div style=\"margin-bottom: 8px;\">✅ Receive important notifications</div>\n" +
            "                    <div>✅ Access all EmpSync features</div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"text-align: center; margin: 35px 0;\">\n" +
            "                <a href='" + link + "' style=\"display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);\">\n" +
            "                    ✅ Verify My Email\n" +
            "                </a>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"text-align: center; margin: 25px 0;\">\n" +
            "                <div style=\"color: #6b7280; font-size: 14px;\">Or copy and paste this link:</div>\n" +
            "                <div style=\"background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; word-break: break-all; color: #374151;\">\n" +
            "                    " + link + "\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 25px 0;\">\n" +
            "                <div style=\"color: #92400e; font-size: 14px;\">\n" +
            "                    <strong>⏰ This link expires in 24 hours</strong><br>\n" +
            "                    If you didn't request this verification, please ignore this email.\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        \n" +
            "        <!-- Footer -->\n" +
            "        <div style=\"background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;\">\n" +
            "            <div style=\"color: #6b7280; font-size: 14px; margin-bottom: 15px;\">\n" +
            "                Need help? <a href=\"#\" style=\"color: #10b981; text-decoration: none;\">Contact Support</a>\n" +
            "            </div>\n" +
            "            <div style=\"color: #9ca3af; font-size: 12px;\">\n" +
            "                © 2026 EmpSync. All rights reserved.\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>";
        sendHtmlEmail(to, "🔐 Verify Your Email - EmpSync", html);
    }

    public void sendPasswordResetEmail(String to, String name, String token) {
        String link = appUrl + "/reset-password?token=" + token;
        String html = "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
            "    <title>Reset Password - EmpSync</title>\n" +
            "</head>\n" +
            "<body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;\">\n" +
            "    <div style=\"max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin-top: 20px; margin-bottom: 20px;\">\n" +
            "        <!-- Header -->\n" +
            "        <div style=\"background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;\">\n" +
            "            <div style=\"font-size: 32px; font-weight: bold; color: white; margin-bottom: 8px;\">🔑 EmpSync</div>\n" +
            "            <div style=\"color: rgba(255, 255, 255, 0.9); font-size: 16px;\">Password Reset Request</div>\n" +
            "        </div>\n" +
            "        \n" +
            "        <!-- Content -->\n" +
            "        <div style=\"padding: 40px 30px;\">\n" +
            "            <div style=\"text-align: center; margin-bottom: 30px;\">\n" +
            "                <div style=\"font-size: 24px; color: #1f2937; margin-bottom: 10px;\">Hi " + name + ", reset your password 🔒</div>\n" +
            "                <div style=\"color: #6b7280; font-size: 16px; line-height: 1.6;\">No worries, it happens to the best of us!</div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;\">\n" +
            "                <div style=\"color: #b91c1c; font-weight: 600; margin-bottom: 8px;\">Security Notice</div>\n" +
            "                <div style=\"color: #374151; font-size: 14px;\">\n" +
            "                    <div style=\"margin-bottom: 8px;\">🔐 This link is only valid for 1 hour</div>\n" +
            "                    <div style=\"margin-bottom: 8px;\">👤 Only you can reset your password</div>\n" +
            "                    <div>🛡️ Your account remains secure</div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"text-align: center; margin: 35px 0;\">\n" +
            "                <a href='" + link + "' style=\"display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);\">\n" +
            "                    🔐 Reset My Password\n" +
            "                </a>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"text-align: center; margin: 25px 0;\">\n" +
            "                <div style=\"color: #6b7280; font-size: 14px;\">Or copy and paste this link:</div>\n" +
            "                <div style=\"background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 12px; word-break: break-all; color: #374151;\">\n" +
            "                    " + link + "\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 25px 0;\">\n" +
            "                <div style=\"color: #92400e; font-size: 14px;\">\n" +
            "                    <strong>🚨 Didn't request this?</strong><br>\n" +
            "                    If you didn't request a password reset, please ignore this email. Your account is still secure.\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            \n" +
            "            <div style=\"text-align: center; margin-top: 30px;\">\n" +
            "                <div style=\"color: #6b7280; font-size: 14px;\">\n" +
            "                    <strong>💡 Password Tips:</strong><br>\n" +
            "                    Use at least 8 characters with a mix of letters, numbers, and symbols\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "        \n" +
            "        <!-- Footer -->\n" +
            "        <div style=\"background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e5e7eb;\">\n" +
            "            <div style=\"color: #6b7280; font-size: 14px; margin-bottom: 15px;\">\n" +
            "                Need help? <a href=\"#\" style=\"color: #ef4444; text-decoration: none;\">Contact Support</a>\n" +
            "            </div>\n" +
            "            <div style=\"color: #9ca3af; font-size: 12px;\">\n" +
            "                © 2026 EmpSync. All rights reserved.\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</body>\n" +
            "</html>";
        sendHtmlEmail(to, "🔐 Reset Your Password - EmpSync", html);
    }
}
