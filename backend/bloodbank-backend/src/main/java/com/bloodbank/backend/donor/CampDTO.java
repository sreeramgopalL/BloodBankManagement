package com.bloodbank.backend.donor;

public class CampDTO {
    private Long id;
    private String campName;
    private String location;
    private String campDate;
    private String organizer;

    public CampDTO() {}

    public CampDTO(Long id, String campName, String location, String campDate, String organizer) {
        this.id = id;
        this.campName = campName;
        this.location = location;
        this.campDate = campDate;
        this.organizer = organizer;
    }

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
