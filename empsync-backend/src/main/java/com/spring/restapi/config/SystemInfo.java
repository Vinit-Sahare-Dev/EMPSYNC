package com.spring.restapi.config;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
public class SystemInfo {
    private String operatingSystem;
    private String javaVersion;
    private String javaVendor;
    private String jvmVersion;
    private String jvmVendor;
    private int availableProcessors;
    private String maxMemory;
    private String allocatedMemory;
    private String freeMemory;
    private String systemArchitecture;
    private String userTimezone;
    private String fileEncoding;
    private int cpuCores;
    private int threadCount;
    private String startupTime;
    private String workingDirectory;
    private String tempDirectory;
    private String userName;
    private String userHome;
    
    // Default constructor
    public SystemInfo() {}
    
    // Getters and Setters
    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }
    
    public String getJavaVersion() { return javaVersion; }
    public void setJavaVersion(String javaVersion) { this.javaVersion = javaVersion; }
    
    public String getJavaVendor() { return javaVendor; }
    public void setJavaVendor(String javaVendor) { this.javaVendor = javaVendor; }
    
    public String getJvmVersion() { return jvmVersion; }
    public void setJvmVersion(String jvmVersion) { this.jvmVersion = jvmVersion; }
    
    public String getJvmVendor() { return jvmVendor; }
    public void setJvmVendor(String jvmVendor) { this.jvmVendor = jvmVendor; }
    
    public int getAvailableProcessors() { return availableProcessors; }
    public void setAvailableProcessors(int availableProcessors) { this.availableProcessors = availableProcessors; }
    
    public String getMaxMemory() { return maxMemory; }
    public void setMaxMemory(String maxMemory) { this.maxMemory = maxMemory; }
    
    public String getAllocatedMemory() { return allocatedMemory; }
    public void setAllocatedMemory(String allocatedMemory) { this.allocatedMemory = allocatedMemory; }
    
    public String getFreeMemory() { return freeMemory; }
    public void setFreeMemory(String freeMemory) { this.freeMemory = freeMemory; }
    
    public String getSystemArchitecture() { return systemArchitecture; }
    public void setSystemArchitecture(String systemArchitecture) { this.systemArchitecture = systemArchitecture; }
    
    public String getUserTimezone() { return userTimezone; }
    public void setUserTimezone(String userTimezone) { this.userTimezone = userTimezone; }
    
    public String getFileEncoding() { return fileEncoding; }
    public void setFileEncoding(String fileEncoding) { this.fileEncoding = fileEncoding; }
    
    public int getCpuCores() { return cpuCores; }
    public void setCpuCores(int cpuCores) { this.cpuCores = cpuCores; }
    
    public int getThreadCount() { return threadCount; }
    public void setThreadCount(int threadCount) { this.threadCount = threadCount; }
    
    public String getStartupTime() { return startupTime; }
    public void setStartupTime(String startupTime) { this.startupTime = startupTime; }
    
    public String getWorkingDirectory() { return workingDirectory; }
    public void setWorkingDirectory(String workingDirectory) { this.workingDirectory = workingDirectory; }
    
    public String getTempDirectory() { return tempDirectory; }
    public void setTempDirectory(String tempDirectory) { this.tempDirectory = tempDirectory; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserHome() { return userHome; }
    public void setUserHome(String userHome) { this.userHome = userHome; }
    
    // Utility methods to get dynamic system information
    public static String getDynamicMaxMemory() {
        long maxMemory = Runtime.getRuntime().maxMemory();
        return formatMemory(maxMemory);
    }
    
    public static String getDynamicAllocatedMemory() {
        long totalMemory = Runtime.getRuntime().totalMemory();
        return formatMemory(totalMemory);
    }
    
    public static String getDynamicFreeMemory() {
        long freeMemory = Runtime.getRuntime().freeMemory();
        return formatMemory(freeMemory);
    }
    
    public static int getDynamicAvailableProcessors() {
        return Runtime.getRuntime().availableProcessors();
    }
    
    public static int getDynamicThreadCount() {
        return Thread.activeCount();
    }
    
    public static String getDynamicJavaVersion() {
        return System.getProperty("java.version");
    }
    
    public static String getDynamicJavaVendor() {
        return System.getProperty("java.vendor");
    }
    
    public static String getDynamicJvmVersion() {
        return System.getProperty("java.vm.version");
    }
    
    public static String getDynamicJvmVendor() {
        return System.getProperty("java.vm.vendor");
    }
    
    public static String getDynamicOsName() {
        return System.getProperty("os.name");
    }
    
    public static String getDynamicOsArch() {
        return System.getProperty("os.arch");
    }
    
    public static String getDynamicUserTimezone() {
        return System.getProperty("user.timezone");
    }
    
    public static String getDynamicFileEncoding() {
        return System.getProperty("file.encoding");
    }
    
    public static String getDynamicWorkingDirectory() {
        return System.getProperty("user.dir");
    }
    
    public static String getDynamicTempDirectory() {
        return System.getProperty("java.io.tmpdir");
    }
    
    public static String getDynamicUserName() {
        return System.getProperty("user.name");
    }
    
    public static String getDynamicUserHome() {
        return System.getProperty("user.home");
    }
    
    private static String formatMemory(long memory) {
        if (memory < 1024) {
            return memory + " B";
        } else if (memory < 1024 * 1024) {
            return (memory / 1024) + " KB";
        } else if (memory < 1024 * 1024 * 1024) {
            return (memory / (1024 * 1024)) + " MB";
        } else {
            return (memory / (1024 * 1024 * 1024)) + " GB";
        }
    }
    
    public String getFormattedSystemInfo() {
        return String.format("System: %s | Java: %s | Processors: %d | Memory: %s", 
               operatingSystem, javaVersion, availableProcessors, maxMemory);
    }
    
    public Map<String, Object> getDetailedSystemInfo() {
        Map<String, Object> details = new HashMap<>();
        details.put("operatingSystem", operatingSystem);
        details.put("javaVersion", javaVersion);
        details.put("javaVendor", javaVendor);
        details.put("jvmVersion", jvmVersion);
        details.put("jvmVendor", jvmVendor);
        details.put("availableProcessors", availableProcessors);
        details.put("maxMemory", maxMemory);
        details.put("allocatedMemory", allocatedMemory);
        details.put("freeMemory", freeMemory);
        details.put("systemArchitecture", systemArchitecture);
        details.put("userTimezone", userTimezone);
        details.put("fileEncoding", fileEncoding);
        details.put("cpuCores", cpuCores);
        details.put("threadCount", threadCount);
        details.put("startupTime", startupTime);
        details.put("workingDirectory", workingDirectory);
        details.put("tempDirectory", tempDirectory);
        details.put("userName", userName);
        details.put("userHome", userHome);
        return details;
    }
}