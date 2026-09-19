package com.bloodbank.requestissueservice.service;

import org.springframework.stereotype.Service;

import com.bloodbank.requestissueservice.model.BloodRequest;
import com.bloodbank.requestissueservice.model.IssueTransaction;
import com.bloodbank.requestissueservice.repository.BloodRequestRepository;
import com.bloodbank.requestissueservice.repository.IssueTransactionRepository;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class RequestIssueService {

    private final BloodRequestRepository requestRepository;
    private final IssueTransactionRepository issueRepository;

    public RequestIssueService(BloodRequestRepository requestRepository,
            IssueTransactionRepository issueRepository) {
        this.requestRepository = requestRepository;
        this.issueRepository = issueRepository;
    }

    // 1️⃣ Hospital raises blood request
    public BloodRequest createRequest(BloodRequest request) {
        request.setStatus("PENDING");
        return requestRepository.save(request);
    }

    // 2️⃣ Admin view pending requests
    public List<BloodRequest> getPendingRequests() {
        return requestRepository.findByStatus("PENDING");
    }

    // 3️⃣ Admin approves request
    public String approveRequest(String requestId) {

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("APPROVED");
        request.setProcessedAt(LocalDateTime.now());
        requestRepository.save(request);

        IssueTransaction issue = new IssueTransaction();
        issue.setRequestId(request.getId());
        issue.setHospitalId(request.getHospitalId());
        issue.setBloodGroup(request.getBloodGroup());
        issue.setComponent(request.getComponent());
        issue.setUnitsIssued(request.getUnits());

        issueRepository.save(issue);

        return "Blood Request Approved and Issued";
    }

    // 4️⃣ Admin rejects request
    public String rejectRequest(String requestId) {

        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("REJECTED");
        request.setProcessedAt(LocalDateTime.now());
        requestRepository.save(request);

        return "Blood Request Rejected";
    }

    // 5️⃣ Hospital views their requests
    public List<BloodRequest> getRequestsByHospital(String hospitalId) {
        return requestRepository.findByHospitalId(hospitalId);
    }

    // 6️⃣ View all requests
    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    // 7️⃣ Cancel request
    public String cancelRequest(String requestId) {
        BloodRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("CANCELLED");
        request.setProcessedAt(LocalDateTime.now());
        requestRepository.save(request);

        return "Blood Request Cancelled";
    }
}
