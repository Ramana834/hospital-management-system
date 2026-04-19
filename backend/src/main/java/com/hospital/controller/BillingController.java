package com.hospital.controller;

import com.hospital.entity.Billing;
import com.hospital.repository.BillingRepository;
import com.hospital.service.AdvancedHospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {

    private final BillingRepository billingRepository;
    private final AdvancedHospitalService advancedHospitalService;

    public BillingController(BillingRepository billingRepository, AdvancedHospitalService advancedHospitalService) {
        this.billingRepository = billingRepository;
        this.advancedHospitalService = advancedHospitalService;
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Billing> generateBill(
            @RequestBody Billing billing,
            @RequestParam BigDecimal consultationFee,
            @RequestParam BigDecimal labCharges,
            @RequestParam BigDecimal medicineCharges) {
        return ResponseEntity.ok(advancedHospitalService.generateBill(billing, consultationFee, labCharges, medicineCharges));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<List<Billing>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(billingRepository.findByPatientId(patientId));
    }

    @PutMapping("/pay/{billId}")
    @PreAuthorize("hasAnyRole('ADMIN','PATIENT')")
    public ResponseEntity<?> payBill(@PathVariable Long billId, @RequestParam String mode) {
        return ResponseEntity.ok(advancedHospitalService.payBill(billId, mode));
    }
}
