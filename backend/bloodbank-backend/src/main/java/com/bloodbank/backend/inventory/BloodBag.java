package com.bloodbank.backend.inventory;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "BLOOD_BAGS")
public class BloodBag {

    @Id
    private String id;

    private String bloodGroup;
    private String component;

    private LocalDate collectedDate;
    private LocalDate expiryDate;

    private String testStatus = "PENDING";
    private String status = "AVAILABLE";

    private Integer units = 1;
    private String location;
    private String donorId;

    public BloodBag() {
        this.id = UUID.randomUUID().toString();
        this.collectedDate = LocalDate.now();
        this.expiryDate = LocalDate.now().plusDays(35);
    }

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.collectedDate == null) {
            this.collectedDate = LocalDate.now();
        }
        if (this.expiryDate == null) {
            this.expiryDate = LocalDate.now().plusDays(35);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }
    public LocalDate getCollectedDate() { return collectedDate; }
    public void setCollectedDate(LocalDate collectedDate) { this.collectedDate = collectedDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getTestStatus() { return testStatus; }
    public void setTestStatus(String testStatus) { this.testStatus = testStatus; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getUnits() { return units != null ? units : 1; }
    public void setUnits(Integer units) { this.units = units; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDonorId() { return donorId; }
    public void setDonorId(String donorId) { this.donorId = donorId; }
}
