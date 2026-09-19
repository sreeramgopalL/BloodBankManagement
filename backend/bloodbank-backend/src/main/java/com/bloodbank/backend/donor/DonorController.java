package com.bloodbank.backend.donor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public Donor createDonor(@RequestBody Donor donor) {
        return donorService.saveDonor(donor);
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donor> getDonorById(@PathVariable Long id) {
        Donor donor = donorService.getDonorById(id);
        return donor != null ? ResponseEntity.ok(donor) : ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Donor> getDonorByEmail(@PathVariable String email) {
        Donor donor = donorService.getDonorByEmail(email);
        return donor != null ? ResponseEntity.ok(donor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Donor> updateDonor(@PathVariable Long id, @RequestBody Donor donorUpdates) {
        Donor existing = donorService.getDonorById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        if (donorUpdates.getName() != null) existing.setName(donorUpdates.getName());
        if (donorUpdates.getEmail() != null) existing.setEmail(donorUpdates.getEmail());
        if (donorUpdates.getBloodGroup() != null) existing.setBloodGroup(donorUpdates.getBloodGroup());
        if (donorUpdates.getCity() != null) existing.setCity(donorUpdates.getCity());
        if (donorUpdates.getPhone() != null) existing.setPhone(donorUpdates.getPhone());
        if (donorUpdates.getAvailable() != null) existing.setAvailable(donorUpdates.getAvailable());
        if (donorUpdates.getStatus() != null) existing.setStatus(donorUpdates.getStatus());
        if (donorUpdates.getHealthStatus() != null) existing.setHealthStatus(donorUpdates.getHealthStatus());
        if (donorUpdates.getAge() != null) existing.setAge(donorUpdates.getAge());
        if (donorUpdates.getWeight() != null) existing.setWeight(donorUpdates.getWeight());
        if (donorUpdates.getMedicalHistory() != null) existing.setMedicalHistory(donorUpdates.getMedicalHistory());
        if (donorUpdates.getHemoglobin() != null) existing.setHemoglobin(donorUpdates.getHemoglobin());
        if (donorUpdates.getLastDonationDate() != null) existing.setLastDonationDate(donorUpdates.getLastDonationDate());
        if (donorUpdates.getRejectionReason() != null) existing.setRejectionReason(donorUpdates.getRejectionReason());
        return ResponseEntity.ok(donorService.saveDonor(existing));
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Donor> verifyDonor(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String healthStatus,
            @RequestParam(required = false) Double hemoglobin,
            @RequestParam(required = false) String rejectionReason) {
        Donor existing = donorService.getDonorById(id);
        if (existing == null) return ResponseEntity.notFound().build();
        if (status != null) existing.setStatus(status.toUpperCase());
        if (healthStatus != null) existing.setHealthStatus(healthStatus);
        if (hemoglobin != null) existing.setHemoglobin(hemoglobin);
        if (rejectionReason != null) existing.setRejectionReason(rejectionReason);
        return ResponseEntity.ok(donorService.saveDonor(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
        return ResponseEntity.ok().build();
    }
}
