package com.spring.restapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
@PropertySource("classpath:system-info.properties")
public class SystemInfoConfig {

    @Bean
    public SystemInfo systemInfo() {
        SystemInfo systemInfo = new SystemInfo();
        
        // Set all values dynamically from system properties
        systemInfo.setOperatingSystem(System.getProperty("os.name"));
        systemInfo.setJavaVersion(System.getProperty("java.version"));
        systemInfo.setJavaVendor(System.getProperty("java.vendor"));
        systemInfo.setJvmVersion(System.getProperty("java.vm.version"));
        systemInfo.setJvmVendor(System.getProperty("java.vm.vendor"));
        systemInfo.setAvailableProcessors(Runtime.getRuntime().availableProcessors());
        systemInfo.setMaxMemory(formatMemory(Runtime.getRuntime().maxMemory()));
        systemInfo.setAllocatedMemory(formatMemory(Runtime.getRuntime().totalMemory()));
        systemInfo.setFreeMemory(formatMemory(Runtime.getRuntime().freeMemory()));
        systemInfo.setSystemArchitecture(System.getProperty("os.arch"));
        systemInfo.setUserTimezone(System.getProperty("user.timezone"));
        systemInfo.setFileEncoding(System.getProperty("file.encoding"));
        systemInfo.setCpuCores(Runtime.getRuntime().availableProcessors());
        systemInfo.setThreadCount(Thread.activeCount());
        systemInfo.setStartupTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        systemInfo.setWorkingDirectory(System.getProperty("user.dir"));
        systemInfo.setTempDirectory(System.getProperty("java.io.tmpdir"));
        systemInfo.setUserName(System.getProperty("user.name"));
        systemInfo.setUserHome(System.getProperty("user.home"));
        
        return systemInfo;
    }

    private String formatMemory(long memory) {
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
}