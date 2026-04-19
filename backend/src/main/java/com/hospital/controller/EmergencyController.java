package com.hospital.controller;

import com.hospital.entity.EmergencyCase;
import com.hospital.service.EmergencyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('PATIENT','ADMIN')")
    public ResponseEntity<EmergencyCase> addEmergency(@RequestBody EmergencyCase emergencyCase) {
        return ResponseEntity.ok(emergencyService.addEmergencyCase(emergencyCase));
    }

    @GetMapping("/next")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<EmergencyCase> getNextEmergency() {
        EmergencyCase next = emergencyService.getNextEmergency();
        return next != null ? ResponseEntity.ok(next) : ResponseEntity.noContent().build();
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<List<EmergencyCase>> getActiveEmergencies() {
        return ResponseEntity.ok(emergencyService.getActiveEmergencies());
    }

    @GetMapping("/state")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<Map<String, Object>> queueState() {
        return ResponseEntity.ok(emergencyService.queueState());
    }

    @GetMapping("/stream")
    public SseEmitter stream() {
        return emergencyService.subscribeQueueUpdates();
    }

    @PutMapping("/resolve/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<String> resolveEmergency(@PathVariable Long id) {
        emergencyService.resolveEmergency(id);
        return ResponseEntity.ok("Emergency resolved");
    }

    @PostMapping("/trigger-mode/{doctorId}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ResponseEntity<Map<String, Object>> triggerEmergencyMode(@PathVariable Long doctorId, @RequestParam String reason) {
        return ResponseEntity.ok(emergencyService.triggerEmergencyMode(doctorId, reason));
    }
}
