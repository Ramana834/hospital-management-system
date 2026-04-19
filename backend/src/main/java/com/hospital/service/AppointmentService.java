package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationGatewayService notificationService;

    public Appointment bookAppointment(Appointment appointment) {
        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            throw new IllegalArgumentException("Doctor is required");
        }
        if (appointment.getPatient() == null || appointment.getPatient().getId() == null) {
            throw new IllegalArgumentException("Patient is required");
        }
        
        // Ensure patient and doctor are fully loaded for notification details
        Patient patient = patientRepository.findById(appointment.getPatient().getId()).orElseThrow();
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElseThrow();
        
        boolean alreadyBooked = appointmentRepository.findByAppointmentDateAndDoctorId(
                        appointment.getAppointmentDate(),
                        appointment.getDoctor().getId()
                ).stream()
                .anyMatch(a -> !"cancelled".equalsIgnoreCase(a.getStatus())
                        && appointment.getAppointmentTime().equals(a.getAppointmentTime()));
        if (alreadyBooked) {
            throw new IllegalArgumentException("Selected time slot is already booked");
        }

        List<Appointment> existing = appointmentRepository.findByAppointmentDateAndDoctorId(
                appointment.getAppointmentDate(),
                appointment.getDoctor().getId()
        ).stream().filter(a -> !"cancelled".equalsIgnoreCase(a.getStatus())).toList();
        
        appointment.setTokenNumber(existing.size() + 1);
        if (appointment.getStatus() == null || appointment.getStatus().isBlank()) {
            appointment.setStatus("scheduled");
        }

        // Set payment details from doctor's fee if not already set
        if (appointment.getPaymentAmount() == null) {
            appointment.setPaymentAmount(doctor.getConsultationFee());
        }
        
        Appointment saved = appointmentRepository.save(appointment);
        
        // Trigger Notifications
        String message = String.format("Dear %s, your appointment with %s is confirmed for %s at %s. Token: %d",
                patient.getName(), doctor.getName(), saved.getAppointmentDate(), saved.getAppointmentTime(), saved.getTokenNumber());
        
        // Send Email (Disabled as per user request)
        // notificationService.sendEmail(patient.getEmail(), "Appointment Confirmed - MahaLakshmi Hospital", message);
        
        // Send SMS (Pass contact number)
        if (patient.getContact() != null) {
            notificationService.sendSms(patient.getContact(), message);
        }
        
        return saved;
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void cancelAppointment(Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointment.get().setStatus("cancelled");
            appointmentRepository.save(appointment.get());
        }
    }

    public Appointment rescheduleAppointment(Long id, LocalDate newDate, LocalTime newTime) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        boolean conflict = appointmentRepository.findByAppointmentDateAndDoctorId(newDate, appointment.getDoctor().getId())
                .stream()
                .anyMatch(a -> !a.getId().equals(id)
                        && !"cancelled".equalsIgnoreCase(a.getStatus())
                        && newTime.equals(a.getAppointmentTime()));
        if (conflict) {
            throw new IllegalArgumentException("Requested time is unavailable");
        }
        appointment.setAppointmentDate(newDate);
        appointment.setAppointmentTime(newTime);
        appointment.setStatus("scheduled");
        List<Appointment> existing = appointmentRepository.findByAppointmentDateAndDoctorId(newDate, appointment.getDoctor().getId())
                .stream()
                .filter(a -> !a.getId().equals(id))
                .toList();
        appointment.setTokenNumber(existing.size() + 1);
        return appointmentRepository.save(appointment);
    }

    public Map<String, Object> checkSlotAvailability(Long doctorId, LocalDate date) {
        List<Appointment> booked = appointmentRepository.findByAppointmentDateAndDoctorId(date, doctorId)
                .stream()
                .filter(a -> !"cancelled".equalsIgnoreCase(a.getStatus()))
                .toList();
        int capacity = 30;
        int available = Math.max(0, capacity - booked.size());
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("doctorId", doctorId);
        response.put("date", date);
        response.put("bookedSlots", booked.size());
        response.put("availableSlots", available);
        response.put("realTimeStatus", available > 0 ? "OPEN" : "FULL");
        return response;
    }
}
