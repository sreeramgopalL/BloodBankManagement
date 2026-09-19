package com.bloodbank.notificationreportservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.bloodbank.notificationreportservice.model.Notification;
import com.bloodbank.notificationreportservice.repository.NotificationRepository;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    @Value("${twilio.enabled:false}")
    private boolean twilioEnabled;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public String sendEmergencyAlert(String phone, String message) {

        // Send SMS using Twilio if enabled
        if (twilioEnabled) {
            Message.creator(
                    new PhoneNumber(phone),
                    new PhoneNumber("YOUR_TWILIO_PHONE_NUMBER"),
                    message).create();
        }

        // Save notification log in MongoDB
        Notification notification = new Notification("EMERGENCY", message);
        repository.save(notification);

        return "Emergency Alert Sent Successfully";
    }

    public String broadcastCamp(String message) {

        Notification notification = new Notification("CAMP", message);
        repository.save(notification);

        return "Camp Notification Saved Successfully";
    }
}
