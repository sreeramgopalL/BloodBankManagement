package com.bloodbank.authservice;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@EnableDiscoveryClient
public class AuthserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthserviceApplication.class, args);
    }
}

