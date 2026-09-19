package com.bloodbank.backend.inventory;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InventoryService {

    private final BloodBagRepository bloodBagRepository;
    private final BloodTestRepository bloodTestRepository;

    public InventoryService(BloodBagRepository bloodBagRepository,
                            BloodTestRepository bloodTestRepository) {
        this.bloodBagRepository = bloodBagRepository;
        this.bloodTestRepository = bloodTestRepository;
    }

    public BloodBag addBloodBag(BloodBag bag) {
        bag.setStatus("AVAILABLE");
        if (bag.getTestStatus() == null) {
            bag.setTestStatus("PASSED");
        }
        if (bag.getCollectedDate() == null) {
            bag.setCollectedDate(LocalDate.now());
        }
        if (bag.getUnits() == null) {
            bag.setUnits(1);
        }

        if (bag.getExpiryDate() == null) {
            if ("RBC".equalsIgnoreCase(bag.getComponent())) {
                bag.setExpiryDate(bag.getCollectedDate().plusDays(42));
            } else if ("PLASMA".equalsIgnoreCase(bag.getComponent())) {
                bag.setExpiryDate(bag.getCollectedDate().plusDays(365));
            } else if ("PLATELETS".equalsIgnoreCase(bag.getComponent())) {
                bag.setExpiryDate(bag.getCollectedDate().plusDays(5));
            } else {
                bag.setExpiryDate(bag.getCollectedDate().plusDays(42));
            }
        }

        return bloodBagRepository.save(bag);
    }

    public String updateBloodTest(String bloodBagId, BloodTest test) {
        BloodBag bag = bloodBagRepository.findById(bloodBagId)
                .orElseThrow(() -> new RuntimeException("Blood bag not found with ID: " + bloodBagId));

        test.setBloodBagId(bloodBagId);
        if (test.getBloodGroup() == null) test.setBloodGroup(bag.getBloodGroup());
        if (test.getCollectionDate() == null && bag.getCollectedDate() != null) {
            test.setCollectionDate(bag.getCollectedDate().toString());
        }

        if (test.isHiv() || test.isHbv() || test.isHcv() || test.isSyphilis() || test.isMalaria()) {
            test.setResult("FAILED");
            test.setTestStatus("FAILED");
            bag.setTestStatus("FAILED");
            bag.setStatus("EXPIRED");
        } else {
            test.setResult("PASSED");
            test.setTestStatus("SAFE");
            bag.setTestStatus("PASSED");
        }

        bloodTestRepository.save(test);
        bloodBagRepository.save(bag);
        return "Blood test updated";
    }

    public List<BloodBag> getAvailableBlood() {
        return bloodBagRepository.findByStatus("AVAILABLE");
    }

    public List<BloodBag> getAvailableByComponent(String component) {
        return bloodBagRepository.findByComponentAndStatus(component, "AVAILABLE");
    }

    public List<BloodBag> getExpiredBlood() {
        return bloodBagRepository.findByExpiryDateBefore(LocalDate.now());
    }

    public String markAsIssued(String bloodBagId) {
        BloodBag bag = bloodBagRepository.findById(bloodBagId)
                .orElseThrow(() -> new RuntimeException("Blood bag not found"));
        bag.setStatus("ISSUED");
        bloodBagRepository.save(bag);
        return "Blood bag issued";
    }

    public void deleteBloodBag(String id) {
        bloodBagRepository.deleteById(id);
    }

    public List<BloodTest> getAllBloodTests() {
        List<BloodTest> tests = bloodTestRepository.findAll();
        for (BloodTest t : tests) {
            if (t.getBloodBagId() != null) {
                bloodBagRepository.findById(t.getBloodBagId()).ifPresent(bag -> {
                    if (t.getBloodGroup() == null) {
                        t.setBloodGroup(bag.getBloodGroup());
                    }
                    if (t.getCollectionDate() == null && bag.getCollectedDate() != null) {
                        t.setCollectionDate(bag.getCollectedDate().toString());
                    }
                });
            }
        }
        return tests;
    }

    public String approveBloodBag(String id) {
        BloodBag bag = bloodBagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood bag not found"));
        bag.setStatus("AVAILABLE");
        bag.setTestStatus("PASSED");
        bloodBagRepository.save(bag);

        List<BloodTest> tests = bloodTestRepository.findAll();
        for (BloodTest t : tests) {
            if (id.equals(t.getBloodBagId())) {
                t.setTestStatus("APPROVED");
                t.setResult("PASSED");
                bloodTestRepository.save(t);
            }
        }
        return "Blood bag approved";
    }

    public BloodBag updateUnits(String bloodBagId, int units) {
        BloodBag bag = bloodBagRepository.findById(bloodBagId)
                .orElseThrow(() -> new RuntimeException("Blood bag not found"));
        bag.setUnits(units);
        return bloodBagRepository.save(bag);
    }

    public List<BloodBag> getDonationsByDonor(String donorId) {
        return bloodBagRepository.findByDonorId(donorId);
    }
}
