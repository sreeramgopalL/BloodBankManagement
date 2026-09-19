package com.bloodbank.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> status = new HashMap<>();
        status.put("service", "BloodBank Management Backend");
        status.put("status", "UP");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }
}
