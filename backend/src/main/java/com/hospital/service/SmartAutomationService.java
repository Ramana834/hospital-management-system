package com.hospital.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class SmartAutomationService {

    private final NotificationGatewayService notificationGatewayService;
    private LocalDateTime lastReminderRun;
    private final ScheduledExecutorService streamScheduler = Executors.newScheduledThreadPool(2);
    private final Map<SseEmitter, Long> vitalEmitters = new LinkedHashMap<>();
    private final Map<SseEmitter, String> ambulanceEmitters = new LinkedHashMap<>();

    public SmartAutomationService(NotificationGatewayService notificationGatewayService) {
        this.notificationGatewayService = notificationGatewayService;
        streamScheduler.scheduleAtFixedRate(this::pushVitals, 0, 5, TimeUnit.SECONDS);
        streamScheduler.scheduleAtFixedRate(this::pushAmbulance, 0, 4, TimeUnit.SECONDS);
    }

    @Scheduled(cron = "0 */30 * * * *")
    public void medicineReminderScheduler() {
        lastReminderRun = LocalDateTime.now();
    }

    public Map<String, Object> getReminderStatus() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("scheduler", "medicineReminderScheduler");
        result.put("lastRun", lastReminderRun);
        result.put("status", lastReminderRun == null ? "waiting" : "active");
        result.put("message", "Appointment reminder and medicine reminder simulation enabled.");
        return result;
    }

    public Map<String, Object> healthMonitoringSimulation(Long patientId) {
        ThreadLocalRandom r = ThreadLocalRandom.current();
        int heartRate = r.nextInt(68, 110);
        int systolic = r.nextInt(105, 155);
        int oxygen = r.nextInt(92, 100);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("patientId", patientId);
        response.put("heartRate", heartRate);
        response.put("bloodPressure", systolic + "/80");
        response.put("oxygenLevel", oxygen);
        response.put("riskAlert", (heartRate > 100 || systolic > 140 || oxygen < 94) ? "Attention needed" : "Stable");
        response.put("capturedAt", LocalDateTime.now());
        return response;
    }

    public Map<String, Object> ambulanceTrackingSimulation(String ambulanceId) {
        ThreadLocalRandom r = ThreadLocalRandom.current();
        double lat = 17.385 + r.nextDouble(-0.02, 0.02);
        double lng = 78.486 + r.nextDouble(-0.02, 0.02);
        int eta = r.nextInt(4, 20);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ambulanceId", ambulanceId);
        response.put("latitude", lat);
        response.put("longitude", lng);
        response.put("etaMinutes", eta);
        response.put("status", "En route");
        response.put("updatedAt", LocalDateTime.now());
        return response;
    }

    public Map<String, Object> notificationSimulation(String type, String target) {
        Map<String, Object> response = new LinkedHashMap<>(notificationGatewayService.send(type, target));
        response.put("type", type);
        return response;
    }

    public SseEmitter subscribeVitals(Long patientId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitter.onCompletion(() -> synchronizedRemoveVital(emitter));
        emitter.onTimeout(() -> synchronizedRemoveVital(emitter));
        emitter.onError((ex) -> synchronizedRemoveVital(emitter));

        Map<String, Object> bootstrap = new LinkedHashMap<>();
        bootstrap.put("patientId", patientId);
        bootstrap.put("connectedAt", LocalDateTime.now());
        bootstrap.put("message", "Vitals stream connected");

        synchronized (vitalEmitters) {
            vitalEmitters.put(emitter, patientId);
        }

        try {
            emitter.send(SseEmitter.event().name("connected").data(bootstrap));
            emitter.send(SseEmitter.event().name("vitals").data(healthMonitoringSimulation(patientId)));
        } catch (Exception ex) {
            emitter.completeWithError(ex);
            synchronizedRemoveVital(emitter);
        }
        return emitter;
    }

    public SseEmitter subscribeAmbulance(String ambulanceId) {
        SseEmitter emitter = new SseEmitter(0L);
        emitter.onCompletion(() -> synchronizedRemoveAmbulance(emitter));
        emitter.onTimeout(() -> synchronizedRemoveAmbulance(emitter));
        emitter.onError((ex) -> synchronizedRemoveAmbulance(emitter));

        Map<String, Object> bootstrap = new LinkedHashMap<>();
        bootstrap.put("ambulanceId", ambulanceId);
        bootstrap.put("connectedAt", LocalDateTime.now());
        bootstrap.put("message", "Ambulance stream connected");

        synchronized (ambulanceEmitters) {
            ambulanceEmitters.put(emitter, ambulanceId);
        }
        try {
            emitter.send(SseEmitter.event().name("connected").data(bootstrap));
            emitter.send(SseEmitter.event().name("tracking").data(ambulanceTrackingSimulation(ambulanceId)));
        } catch (Exception ex) {
            emitter.completeWithError(ex);
            synchronizedRemoveAmbulance(emitter);
        }
        return emitter;
    }

    private void pushVitals() {
        List<Map.Entry<SseEmitter, Long>> emitters;
        synchronized (vitalEmitters) {
            emitters = new CopyOnWriteArrayList<>(vitalEmitters.entrySet());
        }
        for (Map.Entry<SseEmitter, Long> entry : emitters) {
            SseEmitter emitter = entry.getKey();
            Long patientId = entry.getValue();
            try {
                emitter.send(SseEmitter.event().name("vitals").data(healthMonitoringSimulation(patientId)));
            } catch (Exception ex) {
                emitter.complete();
                synchronizedRemoveVital(emitter);
            }
        }
    }

    private void pushAmbulance() {
        List<Map.Entry<SseEmitter, String>> emitters;
        synchronized (ambulanceEmitters) {
            emitters = new CopyOnWriteArrayList<>(ambulanceEmitters.entrySet());
        }
        for (Map.Entry<SseEmitter, String> entry : emitters) {
            SseEmitter emitter = entry.getKey();
            String ambulanceId = entry.getValue();
            try {
                emitter.send(SseEmitter.event().name("tracking").data(ambulanceTrackingSimulation(ambulanceId)));
            } catch (Exception ex) {
                emitter.complete();
                synchronizedRemoveAmbulance(emitter);
            }
        }
    }

    private void synchronizedRemoveVital(SseEmitter emitter) {
        synchronized (vitalEmitters) {
            vitalEmitters.remove(emitter);
        }
    }

    private void synchronizedRemoveAmbulance(SseEmitter emitter) {
        synchronized (ambulanceEmitters) {
            ambulanceEmitters.remove(emitter);
        }
    }
}
