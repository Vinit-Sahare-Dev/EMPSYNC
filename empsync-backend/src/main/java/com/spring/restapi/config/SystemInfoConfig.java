package com.spring.restapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:system-info.properties")
public class SystemInfoConfig {

    @Bean
    public SystemInfo systemInfo(
            @Value("#{T(java.lang.System).getProperty('os.name')}") String operatingSystem,
            @Value("#{T(java.lang.System).getProperty('java.version')}") String javaVersion,
            @Value("#{T(java.lang.System).getProperty('java.vendor')}") String javaVendor,
            @Value("#{T(java.lang.System).getProperty('java.vm.version')}") String jvmVersion,
            @Value("#{T(java.lang.System).getProperty('java.vm.vendor')}") String jvmVendor,
            @Value("#{T(java.lang.Runtime).getRuntime().availableProcessors()}") int availableProcessors,
            @Value("#{T(com.spring.restapi.config.SystemInfoConfig).formatMemory(T(java.lang.Runtime).getRuntime().maxMemory())}") String maxMemory,
            @Value("#{T(com.spring.restapi.config.SystemInfoConfig).formatMemory(T(java.lang.Runtime).getRuntime().totalMemory())}") String allocatedMemory,
            @Value("#{T(com.spring.restapi.config.SystemInfoConfig).formatMemory(T(java.lang.Runtime).getRuntime().freeMemory())}") String freeMemory,
            @Value("#{T(java.lang.System).getProperty('os.arch')}") String systemArchitecture,
            @Value("#{T(java.lang.System).getProperty('user.timezone')}") String userTimezone,
            @Value("#{T(java.lang.System).getProperty('file.encoding')}") String fileEncoding,
            @Value("#{T(java.lang.Thread).activeCount()}") int threadCount,
            @Value("#{T(java.time.LocalDateTime).now().format(T(java.time.format.DateTimeFormatter).ofPattern('yyyy-MM-dd HH:mm:ss'))}") String startupTime,
            @Value("#{T(java.lang.System).getProperty('user.dir')}") String workingDirectory,
            @Value("#{T(java.lang.System).getProperty('java.io.tmpdir')}") String tempDirectory,
            @Value("#{T(java.lang.System).getProperty('user.name')}") String userName,
            @Value("#{T(java.lang.System).getProperty('user.home')}") String userHome) {
        
        SystemInfo systemInfo = new SystemInfo();
        
        systemInfo.setOperatingSystem(operatingSystem);
        systemInfo.setJavaVersion(javaVersion);
        systemInfo.setJavaVendor(javaVendor);
        systemInfo.setJvmVersion(jvmVersion);
        systemInfo.setJvmVendor(jvmVendor);
        systemInfo.setAvailableProcessors(availableProcessors);
        systemInfo.setMaxMemory(maxMemory);
        systemInfo.setAllocatedMemory(allocatedMemory);
        systemInfo.setFreeMemory(freeMemory);
        systemInfo.setSystemArchitecture(systemArchitecture);
        systemInfo.setUserTimezone(userTimezone);
        systemInfo.setFileEncoding(fileEncoding);
        systemInfo.setCpuCores(availableProcessors); // Same as available processors
        systemInfo.setThreadCount(threadCount);
        systemInfo.setStartupTime(startupTime);
        systemInfo.setWorkingDirectory(workingDirectory);
        systemInfo.setTempDirectory(tempDirectory);
        systemInfo.setUserName(userName);
        systemInfo.setUserHome(userHome);
        
        return systemInfo;
    }

    public static String formatMemory(long memory) {
        if (memory == Long.MAX_VALUE) {
            return "Unlimited";
        }
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