package com.bloodbank.notificationreportservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "inventory")
public class Inventory {

    @Id
    private String id;

    private String bloodGroup;
    private String component;
    private LocalDate expiryDate;
    private boolean issued;

    public String getId() { return id; }
    public String getBloodGroup() { return bloodGroup; }
    public String getComponent() { return component; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public boolean isIssued() { return issued; }

    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public void setComponent(String component) { this.component = component; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public void setIssued(boolean issued) { this.issued = issued; }
}
