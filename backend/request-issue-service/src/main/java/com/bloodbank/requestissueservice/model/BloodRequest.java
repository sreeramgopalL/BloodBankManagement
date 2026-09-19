package com.bloodbank.requestissueservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "blood_requests")
public class BloodRequest {

    @Id
    private String id;

    private String hospitalId;
    private String bloodGroup;
    private String component;
    private int units;

    // PENDING / APPROVED / REJECTED
    private String status;

    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;

    public BloodRequest() {
        this.status = "PENDING";
        this.requestedAt = LocalDateTime.now();
    }

    public String getId() { return id; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }

    public int getUnits() { return units; }
    public void setUnits(int units) { this.units = units; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}
