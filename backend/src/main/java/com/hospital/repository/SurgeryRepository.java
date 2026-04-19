package com.hospital.repository;

import com.hospital.entity.Surgery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurgeryRepository extends JpaRepository<Surgery, Long> {
    List<Surgery> findByDoctorId(Long doctorId);
    List<Surgery> findByPatientId(Long patientId);
}
