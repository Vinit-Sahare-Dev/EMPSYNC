package com.spring.restapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.context.WebServerInitializedEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

@Configuration
public class ServerInfoConfig {

    private int serverPort;

    @Value("${server.port:8080}")
    private int configuredPort;

    @Value("${spring.application.name:EMPSYNC}")
    private String appName;

    @EventListener
    public void onApplicationEvent(WebServerInitializedEvent event) {
        this.serverPort = event.getWebServer().getPort();
    }

    @Bean
    public ServerInfo serverInfo() {
        ServerInfo serverInfo = new ServerInfo();
        serverInfo.setPort(serverPort);
        serverInfo.setConfiguredPort(configuredPort);
        serverInfo.setContextPath("/");
        serverInfo.setProtocol("HTTP");
        serverInfo.setHost(getServerHost());
        serverInfo.setApplicationName(appName);
        serverInfo.setStartupTime(java.time.LocalDateTime.now());
        return serverInfo;
    }

    private String getServerHost() {
        try {
            return java.net.InetAddress.getLocalHost().getHostAddress();
        } catch (java.net.UnknownHostException e) {
            return "localhost";
        }
    }
}