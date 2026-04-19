package com.hospital.init;

import com.hospital.entity.Admin;
import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.LabTest;
import com.hospital.entity.Patient;
import com.hospital.entity.PharmacyItem;
import com.hospital.entity.Surgery;
import com.hospital.entity.FamilyMember;
import com.hospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final LabTestRepository labTestRepository;
    private final PharmacyItemRepository pharmacyItemRepository;
    private final SurgeryRepository surgeryRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(AdminRepository adminRepository,
                           DoctorRepository doctorRepository,
                           PatientRepository patientRepository,
                           AppointmentRepository appointmentRepository,
                           LabTestRepository labTestRepository,
                           PharmacyItemRepository pharmacyItemRepository,
                           SurgeryRepository surgeryRepository,
                           FamilyMemberRepository familyMemberRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.labTestRepository = labTestRepository;
        this.pharmacyItemRepository = pharmacyItemRepository;
        this.surgeryRepository = surgeryRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        Admin admin = adminRepository.findByUsername("admin").orElseGet(() -> {
            Admin created = new Admin();
            created.setUsername("admin");
            created.setRole("ADMIN");
            return created;
        });
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        adminRepository.save(admin);

        createDoctor("Dr. Karthik Rao", "Cardiology", "9000011111", "dr.karthik@mahalakshmi.health", 800.0, true);
        Doctor general = createDoctor("Dr. Ananya Devi", "General Medicine", "9000022222", "dr.ananya@mahalakshmi.health", 500.0, true);
        Doctor cardio = createDoctor("Dr. Karthik Rao", "Cardiology", "9000011111", "dr.karthik@mahalakshmi.health", 800.0, true);
        createDoctor("Dr. Naveen Kumar", "Neurology", "9000033333", "dr.naveen@mahalakshmi.health", 1000.0, false);
        createDoctor("Dr. Suresh Pillai", "Orthopedics", "9000044444", "dr.suresh@mahalakshmi.health", 700.0, true);
        createDoctor("Dr. Meera Iyer", "Oncology", "9000055555", "dr.meera@mahalakshmi.health", 1200.0, true);
        createDoctor("Dr. Rajesh Varma", "Pediatrics", "9000066666", "dr.rajesh@mahalakshmi.health", 500.0, true);
        createDoctor("Dr. Swapna Gupta", "Radiology", "9000077777", "dr.swapna@mahalakshmi.health", 600.0, true);
        createDoctor("Dr. Vikram Singh", "Gastroenterology", "9000088888", "dr.vikram@mahalakshmi.health", 900.0, true);

        Patient patient = patientRepository.findByEmail("patient.demo@mahalakshmi.health").orElseGet(() -> {
            Patient p = new Patient();
            p.setName("Lakshmi Priya");
            p.setAge(34);
            p.setGender("Female");
            p.setContact("9000033333");
            p.setAddress("Hyderabad");
            p.setEmail("patient.demo@mahalakshmi.health");
            p.setPassword(passwordEncoder.encode("patient123"));
            p.setRole("PATIENT");
            return patientRepository.save(p);
        });

        if (appointmentRepository.findByPatientId(patient.getId()).isEmpty()) {
            Appointment a1 = new Appointment();
            a1.setPatient(patient);
            a1.setDoctor(general);
            a1.setAppointmentDate(LocalDate.now());
            a1.setAppointmentTime(LocalTime.of(10, 0));
            a1.setTokenNumber(1);
            a1.setStatus("scheduled");
            a1.setVideoMeetingLink("https://meet.mahalakshmi.health/general-checkup");
            appointmentRepository.save(a1);

            Appointment a2 = new Appointment();
            a2.setPatient(patient);
            a2.setDoctor(cardio);
            a2.setAppointmentDate(LocalDate.now());
            a2.setAppointmentTime(LocalTime.of(10, 30));
            a2.setTokenNumber(2);
            a2.setStatus("scheduled");
            appointmentRepository.save(a2);
        }

        if (labTestRepository.findByPatientId(patient.getId()).isEmpty()) {
            LabTest t1 = new LabTest();
            t1.setPatient(patient);
            t1.setDoctor(general);
            t1.setTestName("sugar");
            t1.setResultValue(132.0);
            t1.setNormalRange("70-140");
            t1.setStatus("normal");
            labTestRepository.save(t1);

            LabTest t2 = new LabTest();
            t2.setPatient(patient);
            t2.setDoctor(general);
            t2.setTestName("sugar");
            t2.setResultValue(148.0);
            t2.setNormalRange("70-140");
            t2.setStatus("abnormal");
            labTestRepository.save(t2);
        }

        pharmacyItemRepository.findByMedicineNameIgnoreCase("Paracetamol 650").orElseGet(() -> {
            PharmacyItem item = new PharmacyItem();
            item.setMedicineName("Paracetamol 650");
            item.setAvailableUnits(400);
            item.setUnitPrice(new BigDecimal("2.50"));
            return pharmacyItemRepository.save(item);
        });

        pharmacyItemRepository.findByMedicineNameIgnoreCase("Metformin 500").orElseGet(() -> {
            PharmacyItem item = new PharmacyItem();
            item.setMedicineName("Metformin 500");
            item.setAvailableUnits(260);
            item.setUnitPrice(new BigDecimal("4.75"));
            return pharmacyItemRepository.save(item);
        });

        // Seed Elite Pro Data
        if (surgeryRepository.count() == 0) {
            createSurgery(patient, general, "Emergency Minor Sutures", "discharged");
            createSurgery(patient, cardio, "Stent Placement", "recovering");
        }

        if (familyMemberRepository.count() == 0) {
            createFamilyMember(patient, "Ramana Rao", "Father", "68");
            createFamilyMember(patient, "Hema Malini", "Mother", "62");
        }

        // Add more pharmacy stock for the dashboard
        seedPharmacy("Aspirin 100", 800, "5.00");
        seedPharmacy("Inhaler (Advair)", 45, "1200.00");
        seedPharmacy("Vitamin D3 60k", 600, "12.50");

        System.out.println("MahaLakshmi Elite Pro Data Initialized!");
    }

    private void createSurgery(Patient p, Doctor d, String desc, String status) {
        Surgery s = new Surgery();
        s.setPatient(p);
        s.setDoctor(d);
        s.setSurgeryDate(LocalDate.now().minusDays(2));
        s.setSurgeryTime(LocalTime.of(14, 0));
        s.setDescription(desc);
        s.setStatus(status);
        surgeryRepository.save(s);
    }

    private void createFamilyMember(Patient primary, String name, String relation, String contact) {
        FamilyMember f = new FamilyMember();
        f.setPatient(primary);
        f.setName(name);
        f.setRelationType(relation);
        f.setContact(contact);
        familyMemberRepository.save(f);
    }

    private void seedPharmacy(String name, int units, String price) {
        pharmacyItemRepository.findByMedicineNameIgnoreCase(name).orElseGet(() -> {
            PharmacyItem item = new PharmacyItem();
            item.setMedicineName(name);
            item.setAvailableUnits(units);
            item.setUnitPrice(new BigDecimal(price));
            return pharmacyItemRepository.save(item);
        });
    }

    private Doctor createDoctor(String name, String specialization, String contact, String email, Double fee, Boolean active) {
        return doctorRepository.findByEmail(email).orElseGet(() -> {
            Doctor doctor = new Doctor();
            doctor.setName(name);
            doctor.setSpecialization(specialization);
            doctor.setContact(contact);
            doctor.setEmail(email);
            doctor.setPassword(passwordEncoder.encode("doctor123"));
            doctor.setAvailableSlots("[\"09:00\",\"09:30\",\"10:00\",\"10:30\"]");
            doctor.setRole("DOCTOR");
            doctor.setConsultationFee(fee);
            doctor.setActive(active);
            return doctorRepository.save(doctor);
        });
    }
}
