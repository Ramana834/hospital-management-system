package com.hospital.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentGatewayService {

    private final RestTemplate restTemplate;

    @Value("${payment.gateway.enabled:false}")
    private boolean enabled;

    @Value("${payment.gateway.provider:SIMULATION}")
    private String provider;

    @Value("${payment.gateway.url:}")
    private String gatewayUrl;

    @Value("${payment.gateway.api-key:}")
    private String apiKey;

    public PaymentGatewayService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Object> processPayment(Long billId, BigDecimal amount, String mode) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("billId", billId);
        result.put("mode", mode);
        result.put("provider", provider);
        result.put("amount", amount);
        result.put("timestamp", LocalDateTime.now());

        if (!enabled || gatewayUrl == null || gatewayUrl.isBlank()) {
            result.put("status", "SUCCESS");
            result.put("gatewayMode", "SIMULATED");
            result.put("transactionId", "SIM-" + UUID.randomUUID());
            result.put("note", "Enable payment.gateway settings for real integration.");
            return result;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (apiKey != null && !apiKey.isBlank()) {
                headers.setBearerAuth(apiKey);
            }

            Map<String, Object> payload = Map.of(
                    "billId", billId,
                    "amount", amount,
                    "currency", "INR",
                    "mode", mode,
                    "reference", "BILL-" + billId
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.exchange(gatewayUrl, HttpMethod.POST, request, Map.class);

            result.put("status", response.getStatusCode().is2xxSuccessful() ? "SUCCESS" : "FAILED");
            result.put("gatewayMode", "LIVE");
            result.put("transactionId", "LIVE-" + UUID.randomUUID());
            result.put("providerResponse", response.getBody());
            return result;
        } catch (Exception ex) {
            result.put("status", "FAILED");
            result.put("gatewayMode", "LIVE");
            result.put("error", ex.getMessage());
            return result;
        }
    }
}
