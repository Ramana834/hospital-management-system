package com.hospital.controller;

import com.hospital.entity.LabTest;
import com.hospital.repository.LabTestRepository;
import com.hospital.service.SmartAutomationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/smart")
@CrossOrigin(origins = "*")
public class SmartAutomationController {

    @Autowired
    private SmartAutomationService smartAutomationService;

    @Autowired
    private LabTestRepository labTestRepository;

    @GetMapping("/reminder-status")
    public ResponseEntity<Map<String, Object>> reminderStatus() {
        return ResponseEntity.ok(smartAutomationService.getReminderStatus());
    }

    @GetMapping("/health-monitor/{patientId}")
    public ResponseEntity<Map<String, Object>> healthMonitor(@PathVariable Long patientId) {
        return ResponseEntity.ok(smartAutomationService.healthMonitoringSimulation(patientId));
    }

    @GetMapping("/health-monitor/stream/{patientId}")
    public SseEmitter healthMonitorStream(@PathVariable Long patientId) {
        return smartAutomationService.subscribeVitals(patientId);
    }

    @GetMapping("/ambulance-track/{ambulanceId}")
    public ResponseEntity<Map<String, Object>> ambulanceTrack(@PathVariable String ambulanceId) {
        return ResponseEntity.ok(smartAutomationService.ambulanceTrackingSimulation(ambulanceId));
    }

    @GetMapping("/ambulance-track/stream/{ambulanceId}")
    public SseEmitter ambulanceTrackStream(@PathVariable String ambulanceId) {
        return smartAutomationService.subscribeAmbulance(ambulanceId);
    }

    @PostMapping("/notify")
    public ResponseEntity<Map<String, Object>> notify(@RequestParam String type, @RequestParam String target) {
        return ResponseEntity.ok(smartAutomationService.notificationSimulation(type, target));
    }

    @GetMapping("/lab-comparison")
    public ResponseEntity<Map<String, Object>> labComparison(@RequestParam Long patientId, @RequestParam String testName) {
        List<LabTest> list = labTestRepository.findByPatientIdAndTestNameOrderByCreatedAtDesc(patientId, testName);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("patientId", patientId);
        response.put("testName", testName);
        if (list.isEmpty()) {
            response.put("message", "No records found");
            return ResponseEntity.ok(response);
        }
        LabTest current = list.get(0);
        response.put("current", current.getResultValue());
        if (list.size() > 1) {
            LabTest previous = list.get(1);
            double delta = current.getResultValue() - previous.getResultValue();
            response.put("previous", previous.getResultValue());
            response.put("change", delta);
            response.put("trend", delta > 0 ? "increased" : (delta < 0 ? "decreased" : "stable"));
        } else {
            response.put("previous", null);
            response.put("trend", "single-value");
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/voice-assistant")
    public ResponseEntity<Map<String, String>> voiceAssistant(@RequestParam String text, @RequestParam(defaultValue = "en") String language) {
        return ResponseEntity.ok(Map.of(
                "spokenText", text,
                "language", language,
                "note", "TTS simulation complete. Integrate gTTS/Cloud TTS for real audio output."
        ));
    }
}
