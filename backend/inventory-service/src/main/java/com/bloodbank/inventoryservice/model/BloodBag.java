package com.bloodbank.inventoryservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "blood_bags")
public class BloodBag {

    @Id
    private String id;

    private String bloodGroup;      // O+, A-, etc
    private String component;       // RBC, Plasma, Platelets

    private LocalDate collectedDate;
    private LocalDate expiryDate;

    // PASSED / FAILED / PENDING
    private String testStatus;

    // AVAILABLE / ISSUED / EXPIRED
    private String status;

    private Integer units = 1;
    private String location;

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
}
