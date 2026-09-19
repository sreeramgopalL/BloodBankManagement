package com.bloodbank.notificationreportservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class NotificationReportServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationReportServiceApplication.class, args);
    }
}
