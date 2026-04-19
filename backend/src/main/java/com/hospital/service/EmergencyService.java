package com.hospital.service;

import com.hospital.entity.Appointment;
import com.hospital.entity.EmergencyCase;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.EmergencyCaseRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class EmergencyService {

    private final EmergencyCaseRepository emergencyCaseRepository;
    private final AppointmentRepository appointmentRepository;
    private final PriorityQueue<EmergencyCase> emergencyQueue;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public EmergencyService(EmergencyCaseRepository emergencyCaseRepository, AppointmentRepository appointmentRepository) {
        this.emergencyCaseRepository = emergencyCaseRepository;
        this.appointmentRepository = appointmentRepository;
        this.emergencyQueue = new PriorityQueue<>(
                Comparator.comparingInt(EmergencyCase::getPriority).reversed()
                        .thenComparing(EmergencyCase::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()))
        );
    }

    @PostConstruct
    public void initQueue() {
        emergencyQueue.clear();
        emergencyQueue.addAll(emergencyCaseRepository.findByStatus("active"));
    }

    public EmergencyCase addEmergencyCase(EmergencyCase emergencyCase) {
        if (emergencyCase.getCreatedAt() == null) {
            emergencyCase.setCreatedAt(LocalDateTime.now());
        }
        if (emergencyCase.getStatus() == null || emergencyCase.getStatus().isBlank()) {
            emergencyCase.setStatus("active");
        }
        EmergencyCase saved = emergencyCaseRepository.save(emergencyCase);
        emergencyQueue.add(saved);
        pushQueueUpdate();
        return saved;
    }

    public EmergencyCase getNextEmergency() {
        EmergencyCase next = emergencyQueue.poll();
        if (next != null) {
            pushQueueUpdate();
        }
        return next;
    }

    public List<EmergencyCase> getActiveEmergencies() {
        return emergencyCaseRepository.findByStatus("active").stream()
                .sorted(Comparator.comparingInt(EmergencyCase::getPriority).reversed())
                .toList();
    }

    public void resolveEmergency(Long id) {
        EmergencyCase emergency = emergencyCaseRepository.findById(id).orElseThrow();
        emergency.setStatus("resolved");
        emergencyCaseRepository.save(emergency);
        emergencyQueue.removeIf(e -> Objects.equals(e.getId(), id));
        pushQueueUpdate();
    }

    public Map<String, Object> triggerEmergencyMode(Long doctorId, String reason) {
        List<Appointment> affected = appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(a -> "scheduled".equalsIgnoreCase(a.getStatus()))
                .toList();

        for (Appointment appointment : affected) {
            appointment.setStatus("rescheduled_due_to_emergency");
            appointmentRepository.save(appointment);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("doctorId", doctorId);
        response.put("emergencyReason", reason);
        response.put("affectedAppointments", affected.size());
        response.put("notification", "SMS/Email alert simulation sent to affected patients.");
        response.put("timestamp", LocalDateTime.now());
        pushQueueUpdate();
        return response;
    }

    public SseEmitter subscribeQueueUpdates() {
        SseEmitter emitter = new SseEmitter(0L);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((ex) -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data(Map.of("message", "Emergency stream connected")));
            emitter.send(SseEmitter.event().name("queue").data(queueState()));
        } catch (IOException ex) {
            emitters.remove(emitter);
        }
        return emitter;
    }

    public Map<String, Object> queueState() {
        List<EmergencyCase> active = getActiveEmergencies();
        EmergencyCase top = active.isEmpty() ? null : active.get(0);

        Map<String, Object> state = new LinkedHashMap<>();
        state.put("activeCount", active.size());
        state.put("highestPriorityCase", top);
        state.put("queue", active);
        state.put("generatedAt", LocalDateTime.now());
        return state;
    }

    private void pushQueueUpdate() {
        Map<String, Object> snapshot = queueState();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("queue").data(snapshot));
            } catch (IOException ex) {
                emitter.complete();
                emitters.remove(emitter);
            }
        }
    }
}
