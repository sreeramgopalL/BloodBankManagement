package com.bloodbank.backend.request;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "BLOOD_REQUESTS")
public class BloodRequest {

    @Id
    private String id;

    private String hospitalId;
    private String bloodGroup;
    private String component;
    private int units;

    // PENDING / APPROVED / REJECTED / CANCELLED / FULFILLED
    private String status;

    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;

    public BloodRequest() {
        this.id = UUID.randomUUID().toString();
        this.status = "PENDING";
        this.requestedAt = LocalDateTime.now();
    }

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.requestedAt == null) {
            this.requestedAt = LocalDateTime.now();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
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
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}
