package com.bloodbank.backend.inventory;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/inventory", "/api/inventory-service"})
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/bloodbag")
    public BloodBag addBloodBag(@RequestBody BloodBag bag) {
        return inventoryService.addBloodBag(bag);
    }

    @PutMapping("/bloodbag/{id}/test")
    public String updateBloodTest(@PathVariable String id, @RequestBody BloodTest test) {
        return inventoryService.updateBloodTest(id, test);
    }

    @GetMapping("/available")
    public List<BloodBag> getAvailableBlood() {
        return inventoryService.getAvailableBlood();
    }

    @GetMapping("/available/{component}")
    public List<BloodBag> getAvailableByComponent(@PathVariable String component) {
        return inventoryService.getAvailableByComponent(component);
    }

    @GetMapping("/expired")
    public List<BloodBag> getExpiredBlood() {
        return inventoryService.getExpiredBlood();
    }

    @PutMapping("/bloodbag/{id}/issue")
    public String issueBloodBag(@PathVariable String id) {
        return inventoryService.markAsIssued(id);
    }

    @DeleteMapping("/bloodbag/{id}")
    public void deleteBloodBag(@PathVariable String id) {
        inventoryService.deleteBloodBag(id);
    }

    @PutMapping("/bloodbag/{id}/approve")
    public String approveBloodBag(@PathVariable String id) {
        return inventoryService.approveBloodBag(id);
    }

    @GetMapping("/tests")
    public List<BloodTest> getAllTests() {
        return inventoryService.getAllBloodTests();
    }

    @GetMapping("/donor/{donorId}")
    public List<BloodBag> getDonationsByDonor(@PathVariable String donorId) {
        return inventoryService.getDonationsByDonor(donorId);
    }

    @PatchMapping("/bloodbag/{id}")
    public BloodBag updateBloodBagUnitsPatch(
            @PathVariable String id,
            @RequestParam(required = false) Integer units,
            @RequestBody(required = false) BloodBag body) {
        int finalUnits = (units != null) ? units : (body != null && body.getUnits() != null ? body.getUnits() : 1);
        return inventoryService.updateUnits(id, finalUnits);
    }

    @PutMapping("/bloodbag/{id}")
    public BloodBag updateBloodBagUnitsPut(
            @PathVariable String id,
            @RequestParam(required = false) Integer units,
            @RequestBody(required = false) BloodBag body) {
        int finalUnits = (units != null) ? units : (body != null && body.getUnits() != null ? body.getUnits() : 1);
        return inventoryService.updateUnits(id, finalUnits);
    }
}
