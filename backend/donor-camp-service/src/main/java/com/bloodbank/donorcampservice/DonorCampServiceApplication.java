package com.bloodbank.donorcampservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DonorCampServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DonorCampServiceApplication.class, args);
    }
}

