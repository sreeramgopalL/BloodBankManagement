package com.bloodbank.inventoryservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.bloodbank.inventoryservice.model.BloodTest;

public interface BloodTestRepository
        extends MongoRepository<BloodTest, String> {

}
