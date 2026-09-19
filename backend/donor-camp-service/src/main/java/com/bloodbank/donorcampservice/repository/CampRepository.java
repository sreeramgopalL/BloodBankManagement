package com.bloodbank.donorcampservice.repository;

import com.bloodbank.donorcampservice.entity.Camp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampRepository extends JpaRepository<Camp, Long> {
}
