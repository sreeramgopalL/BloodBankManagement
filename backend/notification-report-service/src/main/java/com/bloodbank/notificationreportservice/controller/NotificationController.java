package com.bloodbank.notificationreportservice.controller;

import org.springframework.web.bind.annotation.*;
import com.bloodbank.notificationreportservice.model.NotificationRequest;

@RestController
@RequestMapping("/api/notification-report-service")
public class NotificationController {

    @GetMapping("/test")
    public String test() {
        return "Notification service is working";
    }

    @PostMapping("/send")
    public String sendNotification(@RequestBody NotificationRequest request) {
        return "Notification sent to " + request.getEmail();
    }
}
