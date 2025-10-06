package com.spring.restapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class ApplicationInfoConfig {

    @Value("${spring.application.name:EMPSYNC}")
    private String applicationName;

    private final Environment environment;

    public ApplicationInfoConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public ApplicationInfo applicationInfo() {
        ApplicationInfo appInfo = new ApplicationInfo();
        appInfo.setName(applicationName);
        appInfo.setVersion("1.0.0");
        appInfo.setDescription("REST API for managing employee data with H2 database");
        appInfo.setEnvironment(getEnvironment());
        appInfo.setDatabase("H2 In-Memory Database");
        appInfo.setH2ConsolePath("/h2-console");
        return appInfo;
    }

    private String getEnvironment() {
        String[] activeProfiles = environment.getActiveProfiles();
        if (activeProfiles.length > 0) {
            return activeProfiles[0];
        }
        return "development";
    }
}
