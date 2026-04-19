package com.hospital.controller;

import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.EmergencyCase;
import com.hospital.entity.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.EmergencyCaseRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.service.AdvancedHospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminManagementController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final EmergencyCaseRepository emergencyCaseRepository;
    private final AdvancedHospitalService advancedHospitalService;

    public AdminManagementController(PatientRepository patientRepository,
                                     DoctorRepository doctorRepository,
                                     AppointmentRepository appointmentRepository,
                                     EmergencyCaseRepository emergencyCaseRepository,
                                     AdvancedHospitalService advancedHospitalService) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.emergencyCaseRepository = emergencyCaseRepository;
        this.advancedHospitalService = advancedHospitalService;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(advancedHospitalService.getAdminSnapshot());
    }

    @GetMapping("/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Patient>> allPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @DeleteMapping("/patients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deletePatient(@PathVariable Long id) {
        patientRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Patient deleted", "id", id));
    }

    @GetMapping("/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Doctor>> allDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    @DeleteMapping("/doctors/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted", "id", id));
    }

    @GetMapping("/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> allAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @DeleteMapping("/appointments/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteAppointment(@PathVariable Long id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted", "id", id));
    }

    @GetMapping("/emergency")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EmergencyCase>> allEmergencyCases() {
        return ResponseEntity.ok(emergencyCaseRepository.findAll());
    }

    @GetMapping("/reports/department")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> departmentReport() {
        Map<String, Long> departmentCount = new LinkedHashMap<>();
        doctorRepository.findAll().forEach(doc -> {
            String key = doc.getSpecialization() == null ? "General" : doc.getSpecialization();
            departmentCount.put(key, departmentCount.getOrDefault(key, 0L) + 1L);
        });

        List<Map<String, Object>> report = departmentCount.entrySet().stream()
                .map(e -> Map.<String, Object>of("department", e.getKey(), "doctorCount", e.getValue()))
                .toList();

        return ResponseEntity.ok(report);
    }
}
