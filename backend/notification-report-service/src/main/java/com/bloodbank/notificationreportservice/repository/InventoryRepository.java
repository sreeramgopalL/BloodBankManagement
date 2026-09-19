package com.bloodbank.notificationreportservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.bloodbank.notificationreportservice.model.Inventory;

import java.util.List;

public interface InventoryRepository 
        extends MongoRepository<Inventory, String> {

    List<Inventory> findByIssued(boolean issued);
}
