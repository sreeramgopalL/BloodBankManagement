package com.bloodbank.backend.request;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, String> {
    List<BloodRequest> findByStatus(String status);
    List<BloodRequest> findByHospitalId(String hospitalId);
}
