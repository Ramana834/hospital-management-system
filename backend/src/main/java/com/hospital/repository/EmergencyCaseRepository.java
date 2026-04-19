package com.hospital.repository;

import com.hospital.entity.EmergencyCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmergencyCaseRepository extends JpaRepository<EmergencyCase, Long> {
    List<EmergencyCase> findByStatus(String status);
}