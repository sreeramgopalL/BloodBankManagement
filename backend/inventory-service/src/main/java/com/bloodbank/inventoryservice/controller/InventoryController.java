package com.bloodbank.inventoryservice.controller;

import org.springframework.web.bind.annotation.*;

import com.bloodbank.inventoryservice.model.BloodBag;
import com.bloodbank.inventoryservice.model.BloodTest;
import com.bloodbank.inventoryservice.service.InventoryService;

import java.util.List;

@RestController
@RequestMapping({"/api/inventory", "/api/inventory-service"})
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // 1️⃣ Add blood bag
    @PostMapping("/bloodbag")
    public BloodBag addBloodBag(@RequestBody BloodBag bag) {
        return inventoryService.addBloodBag(bag);
    }

    // 2️⃣ Update blood test
    @PutMapping("/bloodbag/{id}/test")
    public String updateBloodTest(
            @PathVariable String id,
            @RequestBody BloodTest test) {
        return inventoryService.updateBloodTest(id, test);
    }

    // 3️⃣ View available blood
    @GetMapping("/available")
    public List<BloodBag> getAvailableBlood() {
        return inventoryService.getAvailableBlood();
    }

    // 4️⃣ View component-wise available blood
    @GetMapping("/available/{component}")
    public List<BloodBag> getAvailableByComponent(
            @PathVariable String component) {
        return inventoryService.getAvailableByComponent(component);
    }

    // 5️⃣ View expired blood
    @GetMapping("/expired")
    public List<BloodBag> getExpiredBlood() {
        return inventoryService.getExpiredBlood();
    }

    // 6️⃣ Mark blood bag as issued
    @PutMapping("/bloodbag/{id}/issue")
    public String issueBloodBag(@PathVariable String id) {
        return inventoryService.markAsIssued(id);
    }

    // 7️⃣ Delete blood bag
    @DeleteMapping("/bloodbag/{id}")
    public void deleteBloodBag(@PathVariable String id) {
        inventoryService.deleteBloodBag(id);
    }

    // 8️⃣ Approve blood bag
    @PutMapping("/bloodbag/{id}/approve")
    public String approveBloodBag(@PathVariable String id) {
        return inventoryService.approveBloodBag(id);
    }

    // 9️⃣ View blood tests
    @GetMapping("/tests")
    public List<BloodTest> getAllTests() {
        return inventoryService.getAllBloodTests();
    }

    // 🔟 View donations by donor
    @GetMapping("/donor/{donorId}")
    public List<BloodBag> getDonationsByDonor(@PathVariable String donorId) {
        return List.of();
    }

    // 1️⃣1️⃣ Update blood bag units (supports PATCH & PUT)
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
