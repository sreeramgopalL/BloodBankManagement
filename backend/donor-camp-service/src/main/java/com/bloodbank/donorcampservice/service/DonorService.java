package com.bloodbank.donorcampservice.service;

import com.bloodbank.donorcampservice.entity.Donor;
import com.bloodbank.donorcampservice.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor saveDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {
        return donorRepository.findById(id).orElse(null);
    }

    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }

    public Donor getDonorByEmail(String email) {
        return donorRepository.findByEmail(email).orElse(null);
    }
    
}
