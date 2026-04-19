package com.hospital.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ExternalAiGatewayService {

    private final RestTemplate restTemplate;

    @Value("${ai.external.enabled:false}")
    private boolean externalEnabled;

    @Value("${ai.external.base-url:}")
    private String baseUrl;

    @Value("${ai.external.api-key:}")
    private String apiKey;

    public ExternalAiGatewayService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isEnabled() {
        return externalEnabled && baseUrl != null && !baseUrl.isBlank();
    }

    public Map<String, Object> post(String path, Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (apiKey != null && !apiKey.isBlank()) {
            headers.setBearerAuth(apiKey);
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                baseUrl + path,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );
        return response.getBody();
    }
}
