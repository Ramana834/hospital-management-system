package com.hospital.service;

import com.hospital.entity.Billing;
import com.hospital.repository.BillingRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

@Service
public class InvoicePdfService {

    private final BillingRepository billingRepository;

    public InvoicePdfService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public byte[] generateInvoicePdf(Long billId) {
        Billing bill = billingRepository.findById(billId).orElseThrow();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            document.add(new Paragraph("MahaLakshmi Multi Speciality Hospital", titleFont));
            document.add(new Paragraph("Invoice", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("Generated At: " + LocalDateTime.now(), bodyFont));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Bill ID: " + bill.getId(), bodyFont));
            document.add(new Paragraph("Patient: " + (bill.getPatient() != null ? bill.getPatient().getName() : "N/A"), bodyFont));
            document.add(new Paragraph("Amount: " + bill.getAmount(), bodyFont));
            document.add(new Paragraph("Status: " + bill.getStatus(), bodyFont));
            document.add(new Paragraph("Description: " + bill.getDescription(), bodyFont));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Disclaimer: This system provides assistance only and is not a replacement for professional medical advice.", bodyFont));

            document.close();
            return out.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to generate invoice PDF", ex);
        }
    }
}
