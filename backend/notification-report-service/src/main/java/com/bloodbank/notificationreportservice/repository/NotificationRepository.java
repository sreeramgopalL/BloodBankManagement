package com.bloodbank.notificationreportservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.bloodbank.notificationreportservice.model.Notification;

public interface NotificationRepository 
        extends MongoRepository<Notification, String> {

}
