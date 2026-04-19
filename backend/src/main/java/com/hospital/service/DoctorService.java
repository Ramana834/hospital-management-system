package com.hospital.service;

import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Doctor registerDoctor(Doctor doctor) {
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));
        doctor.setRole("DOCTOR");
        if (doctor.getCreatedAt() == null) {
            doctor.setCreatedAt(LocalDateTime.now());
        }
        return doctorRepository.save(doctor);
    }

    public Optional<Doctor> findByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationIgnoreCase(specialization);
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public boolean authenticate(String email, String password) {
        Optional<Doctor> doctor = findByEmail(email);
        return doctor.isPresent() && passwordEncoder.matches(password, doctor.get().getPassword());
    }

    public Doctor updateProfile(Long id, Doctor update) {
        Doctor doctor = doctorRepository.findById(id).orElseThrow();
        doctor.setName(update.getName());
        doctor.setContact(update.getContact());
        doctor.setSpecialization(update.getSpecialization());
        doctor.setAvailableSlots(update.getAvailableSlots());
        return doctorRepository.save(doctor);
    }

    public List<Patient> getAssignedPatients(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(a -> a.getPatient())
                .filter(p -> p != null)
                .collect(Collectors.toMap(Patient::getId, p -> p, (p1, p2) -> p1))
                .values()
                .stream()
                .toList();
    }
}
