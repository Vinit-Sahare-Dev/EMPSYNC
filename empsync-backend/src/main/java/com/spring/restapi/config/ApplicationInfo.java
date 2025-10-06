package com.spring.restapi.config;

import org.springframework.stereotype.Component;

@Component
public class ApplicationInfo {
    private String name;
    private String version;
    private String description;
    private String environment;
    private String database;
    private String h2ConsolePath;
    
    // Default constructor
    public ApplicationInfo() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }
    
    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }
    
    public String getH2ConsolePath() { return h2ConsolePath; }
    public void setH2ConsolePath(String h2ConsolePath) { this.h2ConsolePath = h2ConsolePath; }
    
    public String getFormattedInfo() {
        return String.format("%s v%s (%s) - %s", 
            name, version, environment, description);
    }
    
    public String getDatabaseInfo() {
        return String.format("Database: %s, H2 Console: %s", database, h2ConsolePath);
    }
}