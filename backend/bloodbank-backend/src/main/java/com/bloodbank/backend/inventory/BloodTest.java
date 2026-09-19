package com.bloodbank.backend.inventory;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "BLOOD_TESTS")
public class BloodTest {

    @Id
    private String id;

    private String bloodBagId;

    private boolean hiv;
    private boolean hbv;
    private boolean hcv;
    private boolean syphilis;
    private boolean malaria;

    private String bloodGroup;
    private String donorName;
    private String collectionDate;

    // PENDING / SAFE / APPROVED / FAILED
    private String testStatus = "PENDING";

    // PASSED / FAILED
    private String result = "PENDING";

    public BloodTest() {
        this.id = UUID.randomUUID().toString();
    }

    @PrePersist
    public void ensureId() {
        if (this.id == null || this.id.trim().isEmpty()) {
            this.id = UUID.randomUUID().toString();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBloodBagId() { return bloodBagId; }
    public void setBloodBagId(String bloodBagId) { this.bloodBagId = bloodBagId; }
    public boolean isHiv() { return hiv; }
    public void setHiv(boolean hiv) { this.hiv = hiv; }
    public boolean isHbv() { return hbv; }
    public void setHbv(boolean hbv) { this.hbv = hbv; }
    public boolean isHcv() { return hcv; }
    public void setHcv(boolean hcv) { this.hcv = hcv; }
    public boolean isSyphilis() { return syphilis; }
    public void setSyphilis(boolean syphilis) { this.syphilis = syphilis; }
    public boolean isMalaria() { return malaria; }
    public void setMalaria(boolean malaria) { this.malaria = malaria; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public String getCollectionDate() { return collectionDate; }
    public void setCollectionDate(String collectionDate) { this.collectionDate = collectionDate; }
    public String getTestStatus() { return testStatus; }
    public void setTestStatus(String testStatus) { this.testStatus = testStatus; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
}
