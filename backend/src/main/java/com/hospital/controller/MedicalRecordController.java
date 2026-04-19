package com.hospital.controller;

import com.hospital.entity.MedicalRecord;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "*")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<MedicalRecord> addRecord(@RequestBody MedicalRecord record) {
        record.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(medicalRecordRepository.save(record));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> byPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordRepository.findByPatientId(patientId));
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecord>> all() {
        return ResponseEntity.ok(medicalRecordRepository.findAll());
    }

    @PostMapping("/upload-report")
    public ResponseEntity<Map<String, Object>> uploadReport(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam(required = false, defaultValue = "") String diagnosis,
            @RequestParam(required = false, defaultValue = "") String prescription,
            @RequestParam MultipartFile file) throws Exception {

        Path uploadDir = Paths.get("uploads", "reports");
        Files.createDirectories(uploadDir);
        String storedName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadDir.resolve(storedName);
        Files.copy(file.getInputStream(), filePath);

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patientRepository.findById(patientId).orElseThrow());
        record.setDoctor(doctorRepository.findById(doctorId).orElseThrow());
        record.setDiagnosis(diagnosis);
        record.setPrescription(prescription);
        record.setReports(filePath.toString().replace("\\", "/"));
        record.setCreatedAt(LocalDateTime.now());
        MedicalRecord saved = medicalRecordRepository.save(record);

        return ResponseEntity.ok(Map.of(
                "recordId", saved.getId(),
                "message", "Report uploaded successfully",
                "storedPath", saved.getReports()
        ));
    }
}
