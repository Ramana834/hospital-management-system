package com.hospital.service;

import com.hospital.auth.JwtService;
import com.hospital.dto.AuthRequest;
import com.hospital.dto.AuthResponse;
import com.hospital.dto.RegisterDoctorRequest;
import com.hospital.dto.RegisterPatientRequest;
import com.hospital.entity.Admin;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.repository.AdminRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(PatientRepository patientRepository,
                       DoctorRepository doctorRepository,
                       AdminRepository adminRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Patient registerPatient(RegisterPatientRequest req) {
        patientRepository.findByEmail(req.getEmail()).ifPresent(p -> {
            throw new IllegalArgumentException("Patient email already exists");
        });

        Patient patient = new Patient();
        patient.setName(req.getName());
        patient.setAge(req.getAge());
        patient.setGender(req.getGender());
        patient.setContact(req.getContact());
        patient.setAddress(req.getAddress());
        patient.setEmail(req.getEmail());
        patient.setPassword(passwordEncoder.encode(req.getPassword()));
        patient.setRole("PATIENT");
        patient.setCreatedAt(LocalDateTime.now());
        return patientRepository.save(patient);
    }

    public Doctor registerDoctor(RegisterDoctorRequest req) {
        doctorRepository.findByEmail(req.getEmail()).ifPresent(d -> {
            throw new IllegalArgumentException("Doctor email already exists");
        });

        Doctor doctor = new Doctor();
        doctor.setName(req.getName());
        doctor.setSpecialization(req.getSpecialization());
        doctor.setContact(req.getContact());
        doctor.setEmail(req.getEmail());
        doctor.setPassword(passwordEncoder.encode(req.getPassword()));
        doctor.setAvailableSlots(req.getAvailableSlots());
        doctor.setRole("DOCTOR");
        doctor.setCreatedAt(LocalDateTime.now());
        return doctorRepository.save(doctor);
    }

    public AuthResponse loginPatient(AuthRequest req) {
        Patient patient = patientRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        validatePassword(req.getPassword(), patient.getPassword());
        return tokenResponse(patient.getId(), patient.getEmail(), patient.getRole(), patient.getName());
    }

    public AuthResponse loginDoctor(AuthRequest req) {
        Doctor doctor = doctorRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        validatePassword(req.getPassword(), doctor.getPassword());
        return tokenResponse(doctor.getId(), doctor.getEmail(), doctor.getRole(), doctor.getName());
    }

    public AuthResponse loginAdmin(AuthRequest req) {
        Admin admin = adminRepository.findByUsername(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        validatePassword(req.getPassword(), admin.getPassword());
        return tokenResponse(admin.getId(), admin.getUsername(), admin.getRole(), admin.getUsername());
    }

    private void validatePassword(String raw, String hashed) {
        if (!passwordEncoder.matches(raw, hashed)) {
            throw new IllegalArgumentException("Invalid credentials");
        }
    }

    private AuthResponse tokenResponse(Long id, String subject, String role, String displayName) {
        String token = jwtService.generateToken(subject, Map.of("role", role, "userId", id));
        return new AuthResponse(token, id, role, displayName);
    }
}
