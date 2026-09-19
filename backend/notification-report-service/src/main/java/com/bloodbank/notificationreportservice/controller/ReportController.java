package com.bloodbank.notificationreportservice.controller;

import com.bloodbank.notificationreportservice.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/pdf")
    public ResponseEntity<InputStreamResource> exportPdf(@RequestParam String reportType) {
        ByteArrayInputStream bis = reportService.generatePdfReport(reportType);

        String filename = "HOSPITAL".equalsIgnoreCase(reportType) ? "Hospital_Report.pdf" : "Donor_Report.pdf";

        HttpHeaders headers = new HttpHeaders();
        // Use setContentDispositionFormData for cleaner header setting
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
