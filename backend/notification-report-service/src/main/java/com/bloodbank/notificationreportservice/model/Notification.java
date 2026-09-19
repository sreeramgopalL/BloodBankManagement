package com.bloodbank.notificationreportservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String type;
    private String message;
    private LocalDateTime createdAt;

    public Notification() {}

    public Notification(String type, String message) {
        this.type = type;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setType(String type) { this.type = type; }
    public void setMessage(String message) { this.message = message; }
}
