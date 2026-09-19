package com.bloodbank.requestissueservice.controller;

import org.springframework.web.bind.annotation.*;

import com.bloodbank.requestissueservice.model.BloodRequest;
import com.bloodbank.requestissueservice.service.RequestIssueService;

import java.util.List;

@RestController
@RequestMapping({"/api/request-issue", "/api/request-issue-service"})
public class RequestIssueController {

    private final RequestIssueService service;

    public RequestIssueController(RequestIssueService service) {
        this.service = service;
    }

    // 1️⃣ Hospital raises blood request
    @PostMapping
    public BloodRequest createRequest(@RequestBody BloodRequest request) {
        return service.createRequest(request);
    }

    // 2️⃣ Admin views pending requests
    @GetMapping("/pending")
    public List<BloodRequest> getPendingRequests() {
        return service.getPendingRequests();
    }

    // 3️⃣ Admin approves request
    @PutMapping("/{id}/approve")
    public String approveRequest(@PathVariable String id) {
        return service.approveRequest(id);
    }

    // 4️⃣ Admin rejects request
    @PutMapping("/{id}/reject")
    public String rejectRequest(@PathVariable String id) {
        return service.rejectRequest(id);
    }

    // 5️⃣ Hospital views their requests
    @GetMapping("/hospital/{hospitalId}")
    public List<BloodRequest> getRequestsByHospital(@PathVariable String hospitalId) {
        return service.getRequestsByHospital(hospitalId);
    }

    // 6️⃣ View all requests
    @GetMapping("/all")
    public List<BloodRequest> getAllRequests() {
        return service.getAllRequests();
    }

    // 7️⃣ Cancel request
    @PutMapping("/{id}/cancel")
    public String cancelRequest(@PathVariable String id) {
        return service.cancelRequest(id);
    }
}
