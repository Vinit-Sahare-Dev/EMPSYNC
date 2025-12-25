// src/main/java/com/spring/restapi/RestApiApplication.java
package com.spring.restapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.spring.restapi.service.AuthService;

@SpringBootApplication
@EnableScheduling  // ADD THIS to enable scheduled tasks for token cleanup
public class RestApiApplication {

    private static final Logger logger = LoggerFactory.getLogger(RestApiApplication.class);

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(RestApiApplication.class, args);
        Environment env = context.getEnvironment();

        String appName = env.getProperty("spring.application.name", "REST API Application");
        String port = env.getProperty("server.port", "8080");
        String profiles = String.join(", ", env.getActiveProfiles());

        logger.trace(" [TRACE] Application started in TRACE mode (if enabled).");
        logger.debug(" [DEBUG] Debugging startup sequence...");
        logger.info(" [INFO] {} started successfully!", appName);
        logger.info(" Active Profiles: {}", profiles.isEmpty() ? "default" : profiles);
        logger.info(" Running on: http://localhost:{}", port);

        logger.info(" [INFO] {} started successfully!", appName);
        logger.info(" Active Profiles: {}", profiles.isEmpty() ? "default" : profiles);
        logger.info(" Running on: http://localhost:{}", port);

        logger.info(" [INFO] {} started successfully!", appName);
        logger.info(" Active Profiles: {}", profiles.isEmpty() ? "default" : profiles);
        logger.info(" Running on: http://localhost:{}", port);

        logger.info(" Swagger UI: http://localhost:{}/swagger-ui.html", port);
        logger.info(" API Docs: http://localhost:{}/v3/api-docs", port);

        logger.info(" Health Check: http://localhost:{}/actuator/health", port);
        logger.info(" Metrics: http://localhost:{}/actuator/metrics", port);
        
        // Email service info
        logger.info(" Email Service: Enabled");
        logger.info(" Email Verification: Enabled");

        logger.info(" Ready to handle requests!");
        
        // Initialize demo users
        try {
            logger.info(" Initializing demo users...");
            // Get the AuthService bean and initialize demo users
            AuthService authService = context.getBean(AuthService.class);
            if (authService != null) {
                authService.initializeDemoUsers();
                logger.info(" Demo users initialized successfully");
            } else {
                logger.warn(" AuthService bean not found, demo users not initialized");
            }
        } catch (Exception e) {
            logger.error(" Error initializing demo users: {}", e.getMessage());
        }
        
        Runtime.getRuntime().addShutdownHook(new Thread(() ->
            logger.info(" {} is shutting down gracefully...", appName)
        ));
    }
}