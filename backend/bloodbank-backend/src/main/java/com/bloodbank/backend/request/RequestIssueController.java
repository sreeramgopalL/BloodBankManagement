package com.bloodbank.backend.request;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/request-issue", "/api/request-issue-service"})
public class RequestIssueController {

    private final RequestIssueService service;

    public RequestIssueController(RequestIssueService service) {
        this.service = service;
    }

    @PostMapping
    public BloodRequest createRequest(@RequestBody BloodRequest request) {
        return service.createRequest(request);
    }

    @GetMapping("/pending")
    public List<BloodRequest> getPendingRequests() {
        return service.getPendingRequests();
    }

    @PutMapping("/{id}/approve")
    public String approveRequest(@PathVariable String id) {
        return service.approveRequest(id);
    }

    @PutMapping("/{id}/reject")
    public String rejectRequest(@PathVariable String id) {
        return service.rejectRequest(id);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<BloodRequest> getRequestsByHospital(@PathVariable String hospitalId) {
        return service.getRequestsByHospital(hospitalId);
    }

    @GetMapping("/all")
    public List<BloodRequest> getAllRequests() {
        return service.getAllRequests();
    }

    @PutMapping("/{id}/cancel")
    public String cancelRequest(@PathVariable String id) {
        return service.cancelRequest(id);
    }
}
