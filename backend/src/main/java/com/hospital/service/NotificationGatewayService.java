package com.hospital.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class NotificationGatewayService {

    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate;

    @Value("${notification.email.enabled:false}")
    private boolean emailEnabled;

    @Value("${notification.email.from:no-reply@mahalakshmihospital.local}")
    private String emailFrom;

    @Value("${notification.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${notification.sms.provider-url:}")
    private String smsProviderUrl;

    @Value("${notification.sms.api-key:}")
    private String smsApiKey;

    public NotificationGatewayService(JavaMailSender mailSender, RestTemplate restTemplate) {
        this.mailSender = mailSender;
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> send(String type, String target) {
        String normalized = type == null ? "" : type.trim().toUpperCase();
        String message = "Hospital notification: " + normalized + " at " + LocalDateTime.now();

        if (normalized.startsWith("EMAIL")) {
            return sendEmail(target, "MahaLakshmi Hospital Alert", message);
        }
        if (normalized.startsWith("SMS")) {
            return sendSms(target, message);
        }

        return sendSms(target, message);
    }

    public Map<String, Object> sendEmail(String to, String subject, String body) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("channel", "EMAIL");
        result.put("target", to);
        result.put("timestamp", LocalDateTime.now());

        if (!emailEnabled) {
            result.put("delivery", "SIMULATED");
            result.put("messageId", UUID.randomUUID().toString());
            result.put("note", "Enable notification.email.enabled=true and SMTP credentials for real delivery.");
            return result;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(emailFrom);
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);
            mailSender.send(mail);

            result.put("delivery", "SENT");
            result.put("messageId", UUID.randomUUID().toString());
            return result;
        } catch (Exception ex) {
            result.put("delivery", "FAILED");
            result.put("error", ex.getMessage());
            return result;
        }
    }

    public Map<String, Object> sendSms(String phone, String message) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("channel", "SMS");
        result.put("target", phone);
        result.put("timestamp", LocalDateTime.now());

        if (!smsEnabled || smsProviderUrl == null || smsProviderUrl.isBlank()) {
            result.put("delivery", "SIMULATED");
            result.put("messageId", UUID.randomUUID().toString());
            result.put("note", "Enable notification.sms settings for real SMS delivery.");
            return result;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (smsApiKey != null && !smsApiKey.isBlank()) {
                headers.setBearerAuth(smsApiKey);
            }
            Map<String, Object> payload = Map.of("to", phone, "message", message);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.exchange(smsProviderUrl, HttpMethod.POST, request, Map.class);

            result.put("delivery", response.getStatusCode().is2xxSuccessful() ? "SENT" : "FAILED");
            result.put("providerResponse", response.getBody());
            return result;
        } catch (Exception ex) {
            result.put("delivery", "FAILED");
            result.put("error", ex.getMessage());
            return result;
        }
    }
}
