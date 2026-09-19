package com.bloodbank.authservice.controller;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class Testcontroller {

    @GetMapping("/hello")
    public String hello() {
        return "Hello secured API";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin API Success";
    }

    @GetMapping("/donor")
    @PreAuthorize("hasRole('DONOR')")
    public String donorAccess() {
        return "Donor API Success";
    }

    @GetMapping("/hospital")
    @PreAuthorize("hasRole('HOSPITAL')")
    public String hospitalAccess() {
        return "Hospital API Success";
    }
}
