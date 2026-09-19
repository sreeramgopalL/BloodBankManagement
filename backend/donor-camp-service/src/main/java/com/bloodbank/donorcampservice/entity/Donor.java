package com.bloodbank.donorcampservice.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "DONORS")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "donor_seq")
    @SequenceGenerator(name = "donor_seq", sequenceName = "DONOR_SEQ", allocationSize = 1)
    private Long id;

    private String name;

    private String email;

    @Column(name = "BLOOD_GROUP")
    private String bloodGroup;

    private String city;

    private String phone;

    @Column(name = "AVAILABLE")
    private Boolean available;

    @Column(name = "STATUS")
    private String status = "PENDING";

    @Column(name = "HEALTH_STATUS")
    private String healthStatus = "Good";

    @Column(name = "AGE")
    private Integer age;

    @Column(name = "WEIGHT")
    private Double weight;

    @Column(name = "MEDICAL_HISTORY")
    private String medicalHistory;

    @Column(name = "HEMOGLOBIN")
    private Double hemoglobin;

    @Column(name = "LAST_DONATION_DATE")
    private String lastDonationDate;

    @Column(name = "REJECTION_REASON")
    private String rejectionReason;

    // 👉 Default constructor
    public Donor() {
    }

    // 👉 All args constructor
    public Donor(Long id, String name, String bloodGroup, String city, String phone, Boolean available) {
        this.id = id;
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.city = city;
        this.phone = phone;
        this.available = available;
    }

    // 👉 Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public String getStatus() {
        return status != null ? status : "PENDING";
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getHealthStatus() {
        return healthStatus != null ? healthStatus : "Good";
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getMedicalHistory() {
        return medicalHistory;
    }

    public void setMedicalHistory(String medicalHistory) {
        this.medicalHistory = medicalHistory;
    }

    public Double getHemoglobin() {
        return hemoglobin;
    }

    public void setHemoglobin(Double hemoglobin) {
        this.hemoglobin = hemoglobin;
    }

    public String getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(String lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
