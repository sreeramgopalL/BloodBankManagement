package com.bloodbank.requestissueservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.bloodbank.requestissueservice.model.BloodRequest;

import java.util.List;

public interface BloodRequestRepository 
        extends MongoRepository<BloodRequest, String> {

    // Admin view pending requests
    List<BloodRequest> findByStatus(String status);

    // Hospital view their requests
    List<BloodRequest> findByHospitalId(String hospitalId);
}
