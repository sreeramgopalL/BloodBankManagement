package com.bloodbank.backend.request;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestIssueService {

    private final BloodRequestRepository requestRepository;

    public RequestIssueService(BloodRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    public BloodRequest createRequest(BloodRequest request) {
        request.setStatus("PENDING");
        request.setRequestedAt(LocalDateTime.now());
        return requestRepository.save(request);
    }

    public List<BloodRequest> getPendingRequests() {
        return requestRepository.findByStatus("PENDING");
    }

    public String approveRequest(String requestId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("APPROVED");
        request.setProcessedAt(LocalDateTime.now());
        requestRepository.save(request);

        return "Blood Request Approved and Issued";
    }

    public String rejectRequest(String requestId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("REJECTED");
        request.setProcessedAt(LocalDateTime.now());
        requestRepository.save(request);

        return "Blood Request Rejected";
    }

    public List<BloodRequest> getRequestsByHospital(String hospitalId) {
        return requestRepository.findByHospitalId(hospitalId);
    }

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public String cancelRequest(String requestId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("CANCELLED");
        request.setProcessedAt(LocalDateTime.now());
        requestRepository.save(request);

        return "Blood Request Cancelled";
    }
}
