package com.hospital.controller;

import com.hospital.entity.*;
import com.hospital.repository.*;
import com.hospital.service.AdvancedHospitalService;
import com.hospital.service.InvoicePdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/advanced")
@CrossOrigin(origins = "*")
public class AdvancedHospitalController {

    @Autowired private AdvancedHospitalService advancedHospitalService;
    @Autowired private SurgeryRepository surgeryRepository;
    @Autowired private BedRepository bedRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private InsuranceRepository insuranceRepository;
    @Autowired private LabTestRepository labTestRepository;
    @Autowired private PharmacyItemRepository pharmacyItemRepository;
    @Autowired private InvoicePdfService invoicePdfService;

    @GetMapping("/admin/snapshot")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminSnapshot() {
        return ResponseEntity.ok(advancedHospitalService.getAdminSnapshot());
    }

    @PostMapping("/billing/generate")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<Billing> generateBill(
            @RequestBody Billing billing,
            @RequestParam(defaultValue = "300") BigDecimal consultationFee,
            @RequestParam(defaultValue = "0") BigDecimal labCharges,
            @RequestParam(defaultValue = "0") BigDecimal medicineCharges) {
        return ResponseEntity.ok(advancedHospitalService.generateBill(billing, consultationFee, labCharges, medicineCharges));
    }

    @PostMapping("/billing/pay/{billId}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<Map<String, Object>> payBill(@PathVariable Long billId, @RequestParam(defaultValue = "QR") String mode) {
        return ResponseEntity.ok(advancedHospitalService.payBill(billId, mode));
    }

    @GetMapping(value = "/billing/invoice/{billId}", produces = MediaType.TEXT_PLAIN_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT','DOCTOR')")
    public ResponseEntity<String> invoice(@PathVariable Long billId) {
        return ResponseEntity.ok(advancedHospitalService.invoiceText(billId));
    }

    @GetMapping(value = "/billing/invoice-pdf/{billId}", produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT','DOCTOR')")
    public ResponseEntity<byte[]> invoicePdf(@PathVariable Long billId) {
        byte[] bytes = invoicePdfService.generateInvoicePdf(billId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("invoice-" + billId + ".pdf").build());
        return ResponseEntity.ok().headers(headers).body(bytes);
    }

    @PostMapping("/ai/doctor-recommendation")
    public ResponseEntity<Map<String, Object>> doctorRecommendation(@RequestParam String symptoms) {
        return ResponseEntity.ok(advancedHospitalService.recommendDoctor(symptoms));
    }

    @PostMapping("/ai/disease-prediction")
    public ResponseEntity<List<Map<String, Object>>> diseasePrediction(@RequestParam String symptoms) {
        return ResponseEntity.ok(advancedHospitalService.diseasePrediction(symptoms));
    }

    @PostMapping("/ai/prescription-analyzer")
    public ResponseEntity<Map<String, Object>> prescriptionAnalyzer(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(advancedHospitalService.analyzePrescription(body.getOrDefault("text", "")));
    }

    @PostMapping("/ai/prescription-analyzer/upload")
    public ResponseEntity<Map<String, Object>> prescriptionAnalyzerUpload(@RequestParam MultipartFile file) throws Exception {
        String extracted = new String(file.getBytes(), StandardCharsets.UTF_8);
        return ResponseEntity.ok(advancedHospitalService.analyzePrescription(extracted));
    }

    @PostMapping("/ai/report-analyzer")
    public ResponseEntity<Map<String, Object>> reportAnalyzer(@RequestParam String reportType, @RequestParam Double value) {
        return ResponseEntity.ok(advancedHospitalService.analyzeLabReport(reportType, value));
    }

    @PostMapping("/ai/report-analyzer/upload")
    public ResponseEntity<Map<String, Object>> reportAnalyzerUpload(
            @RequestParam String reportType,
            @RequestParam(required = false) Double value,
            @RequestParam MultipartFile file
    ) throws Exception {
        Double effectiveValue = value;
        if (effectiveValue == null) {
            String content = new String(file.getBytes(), StandardCharsets.UTF_8).replaceAll("[^0-9.]", "");
            effectiveValue = content.isBlank() ? 0d : Double.parseDouble(content);
        }
        return ResponseEntity.ok(advancedHospitalService.analyzeLabReport(reportType, effectiveValue));
    }

    @PostMapping("/ai/chatbot")
    public ResponseEntity<Map<String, String>> chatbot(@RequestParam String question) {
        return ResponseEntity.ok(Map.of("reply", advancedHospitalService.chatbotReply(question)));
    }

    @PostMapping("/surgery")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<Surgery> addSurgery(@RequestBody Surgery surgery) {
        return ResponseEntity.ok(surgeryRepository.save(surgery));
    }

    @GetMapping("/surgery")
    public ResponseEntity<List<Surgery>> allSurgery() {
        return ResponseEntity.ok(surgeryRepository.findAll());
    }

    @PostMapping("/beds")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<Bed> addBed(@RequestBody Bed bed) {
        return ResponseEntity.ok(bedRepository.save(bed));
    }

    @GetMapping("/beds")
    public ResponseEntity<List<Bed>> beds() {
        return ResponseEntity.ok(bedRepository.findAll());
    }

    @PostMapping("/feedback")
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackRepository.save(feedback));
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<Feedback>> feedback() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }

    @PostMapping("/insurance")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<Insurance> addInsurance(@RequestBody Insurance insurance) {
        return ResponseEntity.ok(insuranceRepository.save(insurance));
    }

    @PostMapping("/insurance/check/{patientId}")
    public ResponseEntity<Map<String, Object>> checkInsurance(@PathVariable Long patientId, @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(advancedHospitalService.checkInsuranceEligibility(patientId, amount));
    }

    @PostMapping("/lab")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<Map<String, Object>> addLab(@RequestBody LabTest labTest) {
        return ResponseEntity.ok(advancedHospitalService.addLabTestAndRisk(labTest));
    }

    @GetMapping("/lab")
    public ResponseEntity<List<LabTest>> labs() {
        return ResponseEntity.ok(labTestRepository.findAll());
    }

    @PostMapping("/pharmacy")
    @PreAuthorize("hasAnyRole('ADMIN','DOCTOR')")
    public ResponseEntity<PharmacyItem> addPharmacyItem(@RequestBody PharmacyItem pharmacyItem) {
        return ResponseEntity.ok(pharmacyItemRepository.save(pharmacyItem));
    }

    @PostMapping("/pharmacy/dispense")
    public ResponseEntity<Map<String, Object>> dispense(@RequestParam String medicine, @RequestParam Integer units) {
        return ResponseEntity.ok(advancedHospitalService.dispenseMedicine(medicine, units));
    }

    @GetMapping("/pharmacy")
    public ResponseEntity<List<PharmacyItem>> inventory() {
        return ResponseEntity.ok(pharmacyItemRepository.findAll());
    }

    @PostMapping("/queue/display/{doctorId}")
    public ResponseEntity<Map<String, Object>> queueDisplay(@PathVariable Long doctorId) {
        return ResponseEntity.ok(advancedHospitalService.smartQueueDisplay(doctorId));
    }

    @GetMapping("/queue/display/stream/{doctorId}")
    public SseEmitter queueDisplayStream(@PathVariable Long doctorId) {
        return advancedHospitalService.subscribeQueueDisplay(doctorId);
    }

    @PostMapping("/telemedicine/{appointmentId}")
    public ResponseEntity<Map<String, Object>> telemedicine(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(advancedHospitalService.createTelemedicineLink(appointmentId));
    }

    @PostMapping("/kiosk/checkin/{appointmentId}")
    public ResponseEntity<Map<String, Object>> kiosk(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(advancedHospitalService.kioskCheckin(appointmentId));
    }

    @PostMapping("/kiosk/checkin")
    public ResponseEntity<Map<String, Object>> kioskByPatient(
            @RequestParam Long patientId,
            @RequestParam Long doctorId) {
        return ResponseEntity.ok(advancedHospitalService.kioskCheckinByPatient(patientId, doctorId));
    }

    @PostMapping("/family")
    public ResponseEntity<FamilyMember> addFamily(@RequestBody FamilyMember familyMember) {
        return ResponseEntity.ok(advancedHospitalService.addFamilyMember(familyMember));
    }

    @GetMapping("/family/{patientId}")
    public ResponseEntity<List<FamilyMember>> family(@PathVariable Long patientId) {
        return ResponseEntity.ok(advancedHospitalService.getFamilyMembers(patientId));
    }

    @GetMapping("/disclaimer")
    public ResponseEntity<Map<String, String>> disclaimer() {
        return ResponseEntity.ok(Map.of("message", "This system provides assistance only and is not a replacement for professional medical advice."));
    }

    @GetMapping("/records/paperless/{patientId}")
    public ResponseEntity<Map<String, Object>> paperlessRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(advancedHospitalService.paperlessRecords(patientId));
    }
}
