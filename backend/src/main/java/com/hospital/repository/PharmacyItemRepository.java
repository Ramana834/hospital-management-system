package com.hospital.repository;

import com.hospital.entity.PharmacyItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PharmacyItemRepository extends JpaRepository<PharmacyItem, Long> {
    Optional<PharmacyItem> findByMedicineNameIgnoreCase(String medicineName);
}
