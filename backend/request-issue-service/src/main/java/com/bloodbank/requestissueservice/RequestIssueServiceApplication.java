package com.bloodbank.requestissueservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class RequestIssueServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(RequestIssueServiceApplication.class, args);
    }
}
