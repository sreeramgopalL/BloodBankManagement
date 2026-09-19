package com.bloodbank.backend.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodTestRepository extends JpaRepository<BloodTest, String> {
    Optional<BloodTest> findByBloodBagId(String bloodBagId);
}
