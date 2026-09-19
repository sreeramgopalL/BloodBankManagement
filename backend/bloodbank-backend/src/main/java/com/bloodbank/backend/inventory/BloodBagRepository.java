package com.bloodbank.backend.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloodBagRepository extends JpaRepository<BloodBag, String> {
    List<BloodBag> findByStatus(String status);
    List<BloodBag> findByComponentAndStatus(String component, String status);
    List<BloodBag> findByExpiryDateBefore(LocalDate date);
    List<BloodBag> findByDonorId(String donorId);
}
