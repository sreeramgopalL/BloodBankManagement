package com.bloodbank.backend.report;

import com.bloodbank.backend.inventory.BloodBag;
import com.bloodbank.backend.inventory.BloodBagRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ReportService {

    private final BloodBagRepository bloodBagRepository;

    public ReportService(BloodBagRepository bloodBagRepository) {
        this.bloodBagRepository = bloodBagRepository;
    }

    public ByteArrayInputStream generatePdfReport(String reportType) {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Add Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.RED);
            String titleText = "HOSPITAL".equalsIgnoreCase(reportType) ? "Hospital Blood Supply Report" : "Donor Blood Inventory Report";
            Paragraph title = new Paragraph(titleText, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Add Generation Time
            Font subFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.GRAY);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Paragraph subtitle = new Paragraph("Generated on: " + timestamp, subFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Fetch data
            List<BloodBag> bloodBags = "HOSPITAL".equalsIgnoreCase(reportType)
                    ? bloodBagRepository.findByStatus("ISSUED")
                    : bloodBagRepository.findByStatus("AVAILABLE");

            if (bloodBags.isEmpty()) {
                bloodBags = bloodBagRepository.findAll();
            }

            // Add Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);

            // Add Header
            Stream.of("Bag ID", "Blood Group", "Component", "Units", "Expiry Date")
                    .forEach(columnTitle -> {
                        PdfPCell header = new PdfPCell();
                        header.setBackgroundColor(BaseColor.LIGHT_GRAY);
                        header.setBorderWidth(1);
                        header.setPhrase(new Phrase(columnTitle));
                        header.setHorizontalAlignment(Element.ALIGN_CENTER);
                        header.setPadding(6);
                        table.addCell(header);
                    });

            // Add Data Rows
            for (BloodBag item : bloodBags) {
                table.addCell(item.getId() != null ? (item.getId().length() > 8 ? item.getId().substring(0, 8) + "..." : item.getId()) : "N/A");
                table.addCell(item.getBloodGroup() != null ? item.getBloodGroup() : "N/A");
                table.addCell(item.getComponent() != null ? item.getComponent() : "N/A");
                table.addCell(String.valueOf(item.getUnits() != null ? item.getUnits() : 1));
                table.addCell(item.getExpiryDate() != null ? item.getExpiryDate().toString() : "N/A");
            }

            document.add(table);
            document.close();

        } catch (DocumentException ex) {
            ex.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
