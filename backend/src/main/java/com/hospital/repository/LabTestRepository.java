package com.hospital.repository;

import com.hospital.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    List<LabTest> findByPatientId(Long patientId);
    List<LabTest> findByPatientIdAndTestNameOrderByCreatedAtDesc(Long patientId, String testName);
}
