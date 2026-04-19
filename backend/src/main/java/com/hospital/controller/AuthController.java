package com.hospital.controller;

import com.hospital.dto.AuthRequest;
import com.hospital.dto.AuthResponse;
import com.hospital.dto.RegisterDoctorRequest;
import com.hospital.dto.RegisterPatientRequest;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/patients/register")
    public ResponseEntity<Patient> registerPatient(@RequestBody RegisterPatientRequest req) {
        return ResponseEntity.ok(authService.registerPatient(req));
    }

    @PostMapping("/doctors/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody RegisterDoctorRequest req) {
        return ResponseEntity.ok(authService.registerDoctor(req));
    }

    @PostMapping("/patients/login")
    public ResponseEntity<AuthResponse> patientLogin(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.loginPatient(req));
    }

    @PostMapping("/doctors/login")
    public ResponseEntity<AuthResponse> doctorLogin(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.loginDoctor(req));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(authService.loginAdmin(req));
    }

    @GetMapping("/disclaimer")
    public ResponseEntity<Map<String, String>> disclaimer() {
        return ResponseEntity.ok(Map.of(
                "message",
                "This system provides assistance only and is not a replacement for professional medical advice."
        ));
    }
}
