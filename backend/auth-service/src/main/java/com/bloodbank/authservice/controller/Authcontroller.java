package com.bloodbank.authservice.controller;

import com.bloodbank.authservice.dto.Authresponse;
import com.bloodbank.authservice.dto.Loginrequest;
import com.bloodbank.authservice.dto.RegisterRequest;
import com.bloodbank.authservice.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;   // ✅ ADD THIS
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class Authcontroller {

    private final AuthService authService;

    public Authcontroller(AuthService authService) {
        this.authService = authService;
    }

    // ✅ CURRENT USER API
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(authentication.getName());
    }

    // 🔐 REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    // 🔐 LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody Loginrequest request) {
        Authresponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
