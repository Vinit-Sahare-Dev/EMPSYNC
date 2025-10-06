package com.spring.restapi.config;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ServerInfo {
    private int port;
    private int configuredPort;
    private String contextPath;
    private String protocol;
    private String host;
    private String applicationName;
    private LocalDateTime startupTime;
    
    // Default constructor
    public ServerInfo() {
        this.startupTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    
    public int getConfiguredPort() { return configuredPort; }
    public void setConfiguredPort(int configuredPort) { this.configuredPort = configuredPort; }
    
    public String getContextPath() { return contextPath; }
    public void setContextPath(String contextPath) { this.contextPath = contextPath; }
    
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    
    public String getApplicationName() { return applicationName; }
    public void setApplicationName(String applicationName) { this.applicationName = applicationName; }
    
    public LocalDateTime getStartupTime() { return startupTime; }
    public void setStartupTime(LocalDateTime startupTime) { this.startupTime = startupTime; }
    
    public String getServerUrl() {
        return String.format("%s://%s:%d%s", protocol, host, port, contextPath);
    }
    
    public String getFormattedStartupTime() {
        return startupTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    
    public String getFormattedInfo() {
        return String.format("%s running at %s (Started: %s)", 
            applicationName, getServerUrl(), getFormattedStartupTime());
    }
    
    public long getUptimeInSeconds() {
        return java.time.Duration.between(startupTime, LocalDateTime.now()).getSeconds();
    }
    
    public String getPortInfo() {
        return String.format("Configured: %d, Actual: %d", configuredPort, port);
    }
}