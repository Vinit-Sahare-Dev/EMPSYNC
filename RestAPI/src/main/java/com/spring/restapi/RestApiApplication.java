package com.spring.restapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RestApiApplication {
    
    private static final Logger logger = LoggerFactory.getLogger(RestApiApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(RestApiApplication.class, args);
        
        logger.trace("🔍 [TRACE] Starting up in TRACE mode."); 
        logger.debug("🐛 [DEBUG] Application initialization details."); 
        logger.info("🎉 [INFO] REST API Application started successfully!"); 
        logger.warn("⚠️ [WARN] Ensure all environment variables are set."); 
        logger.error("🔥 [ERROR] (Sample error) No real error at start."); 

        logger.info("🌟 Ready to handle requests!"); 
        logger.info("📊 Swagger UI: http://localhost:8080/swagger-ui.html");
        logger.info("📚 API Docs: http://localhost:8080/v3/api-docs"); // 
    }
}
