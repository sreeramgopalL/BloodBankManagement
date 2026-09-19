package com.bloodbank.donorcampservice.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "CAMPS")
public class Camp {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "camp_seq")
    @SequenceGenerator(name = "camp_seq", sequenceName = "CAMP_SEQ", allocationSize = 1)
    private Long id;

    private String campName;
    private String location;
    private LocalDate campDate;
    private String organizer;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCampName() { return campName; }
    public void setCampName(String campName) { this.campName = campName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getCampDate() { return campDate; }
    public void setCampDate(LocalDate campDate) { this.campDate = campDate; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
}
