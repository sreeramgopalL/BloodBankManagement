package com.bloodbank.notificationreportservice.service;

import com.bloodbank.notificationreportservice.model.Inventory;
import com.bloodbank.notificationreportservice.repository.InventoryRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ReportService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public ByteArrayInputStream generatePdfReport(String reportType) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Add Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.RED);
            String titleText = "HOSPITAL".equalsIgnoreCase(reportType) ? "Hospital Report" : "Donor Report";
            Paragraph title = new Paragraph(titleText, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Add Generation Time
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Paragraph subtitle = new Paragraph("Generated on: " + timestamp, subFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Fetch Data from MongoDB
            boolean issuedStatus = "HOSPITAL".equalsIgnoreCase(reportType);
            List<Inventory> inventoryList = inventoryRepository.findByIssued(issuedStatus);

            // Add Table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);

            // Add Header
            addTableHeader(table);

            // Add Data Rows
            for (Inventory item : inventoryList) {
                table.addCell(item.getId() != null ? item.getId() : "N/A");
                table.addCell(item.getBloodGroup());
                table.addCell(item.getComponent());
                table.addCell(item.getExpiryDate() != null ? item.getExpiryDate().toString() : "N/A");
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addTableHeader(PdfPTable table) {
        Stream.of("ID", "Blood Group", "Component", "Expiry Date")
                .forEach(columnTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(Color.LIGHT_GRAY);
                    header.setBorderWidth(2);
                    header.setPhrase(new Phrase(columnTitle));
                    header.setHorizontalAlignment(Element.ALIGN_CENTER);
                    header.setPadding(5);
                    table.addCell(header);
                });
    }
}
