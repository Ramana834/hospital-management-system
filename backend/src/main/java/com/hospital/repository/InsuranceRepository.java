package com.hospital.repository;

import com.hospital.entity.Insurance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    List<Insurance> findByPatientId(Long patientId);
}
