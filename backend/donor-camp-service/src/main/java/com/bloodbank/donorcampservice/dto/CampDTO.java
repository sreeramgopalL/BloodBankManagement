package com.bloodbank.donorcampservice.dto;

public class CampDTO {

    private Long id;
    private String campName;
    private String location;
    private String campDate; // String for API
    private String organizer;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCampName() { return campName; }
    public void setCampName(String campName) { this.campName = campName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCampDate() { return campDate; }
    public void setCampDate(String campDate) { this.campDate = campDate; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
}
