package com.bloodbank.inventoryservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.bloodbank.inventoryservice.model.BloodBag;

import java.util.List;

public interface BloodBagRepository
        extends MongoRepository<BloodBag, String> {

    List<BloodBag> findByStatus(String status);

    List<BloodBag> findByComponentAndStatus(String component, String status);

    List<BloodBag> findByExpiryDateBefore(java.time.LocalDate date);
}
