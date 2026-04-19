package com.hospital.dto;

public class AuthResponse {
    private String token;
    private Long userId;
    private String role;
    private String displayName;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long userId, String role, String displayName) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.displayName = displayName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
