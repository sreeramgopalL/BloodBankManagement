package com.bloodbank.requestissueservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "issue_transactions")
public class IssueTransaction {

    @Id
    private String id;

    private String requestId;
    private String hospitalId;
    private String bloodGroup;
    private String component;
    private int unitsIssued;

    private LocalDateTime issuedAt;

    public IssueTransaction() {
        this.issuedAt = LocalDateTime.now();
    }

    public String getId() { return id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getComponent() { return component; }
    public void setComponent(String component) { this.component = component; }

    public int getUnitsIssued() { return unitsIssued; }
    public void setUnitsIssued(int unitsIssued) { this.unitsIssued = unitsIssued; }

    public LocalDateTime getIssuedAt() { return issuedAt; }
}
