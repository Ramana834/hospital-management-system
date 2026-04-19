package com.hospital.service;

import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Patient registerPatient(Patient patient) {
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        patient.setRole("PATIENT");
        if (patient.getCreatedAt() == null) {
            patient.setCreatedAt(LocalDateTime.now());
        }
        return patientRepository.save(patient);
    }

    public Optional<Patient> findByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public boolean authenticate(String email, String password) {
        Optional<Patient> patient = findByEmail(email);
        return patient.isPresent() && passwordEncoder.matches(password, patient.get().getPassword());
    }

    public Patient updateProfile(Long id, Patient update) {
        Patient patient = patientRepository.findById(id).orElseThrow();
        patient.setName(update.getName());
        patient.setAge(update.getAge());
        patient.setGender(update.getGender());
        patient.setContact(update.getContact());
        patient.setAddress(update.getAddress());
        return patientRepository.save(patient);
    }

    public List<Patient> searchPatients(String query) {
        return patientRepository.findByNameContainingIgnoreCaseOrContactContaining(query, query);
    }
}
