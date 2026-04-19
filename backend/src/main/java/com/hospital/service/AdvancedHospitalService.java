package com.hospital.service;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class AdvancedHospitalService {

    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private BillingRepository billingRepository;
    @Autowired private EmergencyCaseRepository emergencyCaseRepository;
    @Autowired private BedRepository bedRepository;
    @Autowired private SurgeryRepository surgeryRepository;
    @Autowired private FeedbackRepository feedbackRepository;
    @Autowired private InsuranceRepository insuranceRepository;
    @Autowired private LabTestRepository labTestRepository;
    @Autowired private PharmacyItemRepository pharmacyItemRepository;
    @Autowired private FamilyMemberRepository familyMemberRepository;
    @Autowired private MedicalRecordRepository medicalRecordRepository;
    @Autowired private PrescriptionRepository prescriptionRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private PaymentGatewayService paymentGatewayService;
    @Autowired private ExternalAiGatewayService externalAiGatewayService;

    private final Map<SseEmitter, Long> queueEmitters = new ConcurrentHashMap<>();
    private final ScheduledExecutorService queueScheduler = Executors.newScheduledThreadPool(1);

    public AdvancedHospitalService() {
        queueScheduler.scheduleAtFixedRate(this::pushQueueDisplayUpdates, 0, 4, TimeUnit.SECONDS);
    }

    public Map<String, Object> getAdminSnapshot() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("patients", patientRepository.count());
        data.put("doctors", doctorRepository.count());
        data.put("appointments", appointmentRepository.count());
        data.put("pendingBilling", billingRepository.findAll().stream().filter(b -> "pending".equalsIgnoreCase(b.getStatus())).count());
        data.put("activeEmergencies", emergencyCaseRepository.findByStatus("active").size());

        List<Map<String, Object>> doctorPerformance = new ArrayList<>();
        for (Doctor doctor : doctorRepository.findAll()) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("doctorId", doctor.getId());
            p.put("doctorName", doctor.getName());
            p.put("specialization", doctor.getSpecialization());
            p.put("appointmentCount", appointmentRepository.findByDoctorId(doctor.getId()).size());
            double avgRating = feedbackRepository.findByDoctorId(doctor.getId()).stream()
                    .filter(f -> f.getRating() != null)
                    .mapToInt(Feedback::getRating)
                    .average().orElse(0.0);
            p.put("avgRating", Math.round(avgRating * 100.0) / 100.0);
            doctorPerformance.add(p);
        }
        data.put("doctorPerformance", doctorPerformance);
        return data;
    }

    public Billing generateBill(Billing billing, BigDecimal consultationFee, BigDecimal labCharges, BigDecimal medicineCharges) {
        BigDecimal total = consultationFee.add(labCharges).add(medicineCharges);
        billing.setAmount(total);
        billing.setDescription("Consultation: " + consultationFee + ", Lab: " + labCharges + ", Medicine: " + medicineCharges);
        billing.setStatus("pending");
        billing.setCreatedAt(LocalDateTime.now());
        return billingRepository.save(billing);
    }

    public Map<String, Object> payBill(Long billId, String paymentMode) {
        Billing billing = billingRepository.findById(billId).orElseThrow();
        Map<String, Object> gateway = paymentGatewayService.processPayment(billId, billing.getAmount(), paymentMode);
        String status = String.valueOf(gateway.getOrDefault("status", "FAILED"));
        if ("SUCCESS".equalsIgnoreCase(status)) {
            billing.setStatus("paid");
            billingRepository.save(billing);
        }

        Map<String, Object> response = new LinkedHashMap<>(gateway);
        response.put("billStatus", billing.getStatus());
        response.put("paidAt", LocalDateTime.now());
        return response;
    }

    public String invoiceText(Long billId) {
        Billing bill = billingRepository.findById(billId).orElseThrow();
        return "Invoice\nHospital: MahaLakshmi Multi Speciality Hospital\nBill ID: " + bill.getId()
                + "\nPatient: " + (bill.getPatient() != null ? bill.getPatient().getName() : "N/A")
                + "\nAmount: " + bill.getAmount()
                + "\nStatus: " + bill.getStatus()
                + "\nDescription: " + bill.getDescription()
                + "\nGenerated At: " + LocalDateTime.now();
    }

    public Map<String, Object> recommendDoctor(String symptoms) {
        if (externalAiGatewayService.isEnabled()) {
            try {
                Map<String, Object> response = externalAiGatewayService.post(
                        "/doctor-recommendation",
                        Map.of("symptoms", symptoms)
                );
                if (response != null && !response.isEmpty()) {
                    response.put("source", "external-ai");
                    return response;
                }
            } catch (Exception ignored) {
            }
        }

        String input = symptoms == null ? "" : symptoms.toLowerCase();
        String specialization = "General Medicine";
        if (input.contains("chest") || input.contains("heart") || input.contains("bp")) specialization = "Cardiology";
        else if (input.contains("head") || input.contains("brain") || input.contains("seizure")) specialization = "Neurology";
        else if (input.contains("bone") || input.contains("joint") || input.contains("back pain")) specialization = "Orthopedic";
        else if (input.contains("skin")) specialization = "Dermatology";

        List<Doctor> doctors = doctorRepository.findBySpecialization(specialization);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("recommendedSpecialization", specialization);
        result.put("doctors", doctors);
        result.put("source", "local-rules");
        return result;
    }

    public List<Map<String, Object>> diseasePrediction(String symptoms) {
        if (externalAiGatewayService.isEnabled()) {
            try {
                Map<String, Object> response = externalAiGatewayService.post(
                        "/disease-prediction",
                        Map.of("symptoms", symptoms)
                );
                Object predictions = response == null ? null : response.get("predictions");
                if (predictions instanceof List<?> list) {
                    return (List<Map<String, Object>>) list;
                }
            } catch (Exception ignored) {
            }
        }

        String input = symptoms == null ? "" : symptoms.toLowerCase();
        List<Map<String, Object>> result = new ArrayList<>();
        if (input.contains("fever") && input.contains("cough")) {
            result.add(prediction("Viral Infection", 0.81));
            result.add(prediction("Flu", 0.73));
        }
        if (input.contains("sugar") || input.contains("thirst")) {
            result.add(prediction("Diabetes Risk", 0.76));
        }
        if (result.isEmpty()) {
            result.add(prediction("General Checkup Recommended", 0.65));
        }
        return result;
    }

    private Map<String, Object> prediction(String disease, double confidence) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("disease", disease);
        map.put("confidence", confidence);
        return map;
    }

    public Map<String, Object> analyzePrescription(String text) {
        if (externalAiGatewayService.isEnabled()) {
            try {
                Map<String, Object> response = externalAiGatewayService.post(
                        "/prescription-analyzer",
                        Map.of("text", text == null ? "" : text)
                );
                if (response != null && !response.isEmpty()) {
                    response.put("source", "external-ai");
                    return response;
                }
            } catch (Exception ignored) {
            }
        }

        String normalized = text == null ? "" : text;
        List<Map<String, String>> medicines = new ArrayList<>();
        for (String line : normalized.split("\\n")) {
            String l = line.trim();
            if (!l.isEmpty()) {
                Map<String, String> m = new LinkedHashMap<>();
                m.put("raw", l);
                m.put("simpleInstruction", "Take after food and follow doctor timing.");
                medicines.add(m);
            }
        }
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("ocrExtractedText", normalized);
        out.put("medicines", medicines);
        out.put("voiceText", "Your prescription was analyzed. Please take medicines on time.");
        out.put("source", "local-parser");
        return out;
    }

    public Map<String, Object> analyzeLabReport(String reportType, Double value) {
        if (externalAiGatewayService.isEnabled()) {
            try {
                Map<String, Object> response = externalAiGatewayService.post(
                        "/report-analyzer",
                        Map.of("reportType", reportType, "value", value)
                );
                if (response != null && !response.isEmpty()) {
                    response.put("source", "external-ai");
                    return response;
                }
            } catch (Exception ignored) {
            }
        }

        Map<String, Object> out = new LinkedHashMap<>();
        String type = reportType == null ? "unknown" : reportType.toLowerCase();
        String status = "normal";
        String explanation = "Values look acceptable.";

        if ("sugar".equals(type) && value != null && value > 140) {
            status = "high";
            explanation = "Sugar level appears high. Please consult physician.";
        } else if ("bp".equals(type) && value != null && value > 130) {
            status = "high";
            explanation = "Blood pressure is above target range.";
        }

        out.put("reportType", reportType);
        out.put("value", value);
        out.put("status", status);
        out.put("explanation", explanation);
        out.put("ttsMessage", explanation);
        out.put("source", "local-rules");
        return out;
    }

    public String chatbotReply(String question) {
        if (externalAiGatewayService.isEnabled()) {
            try {
                Map<String, Object> response = externalAiGatewayService.post(
                        "/chatbot",
                        Map.of("question", question == null ? "" : question)
                );
                Object reply = response == null ? null : response.get("reply");
                if (reply != null) {
                    return String.valueOf(reply);
                }
            } catch (Exception ignored) {
            }
        }

        String q = question == null ? "" : question.toLowerCase();
        if (q.contains("appointment")) {
            return "You can book, cancel, or reschedule appointments from the Appointment module.";
        }
        if (q.contains("medicine")) {
            return "Please follow dosage after food unless your doctor advised otherwise.";
        }
        if (q.contains("emergency")) {
            return "Use Emergency button immediately; high-priority cases move to top of queue.";
        }
        return "I can help with appointments, medicines, billing, emergency, and reports.";
    }

    public Map<String, Object> checkInsuranceEligibility(Long patientId, BigDecimal estimateAmount) {
        List<Insurance> policies = insuranceRepository.findByPatientId(patientId);
        BigDecimal coverage = policies.stream()
                .map(Insurance::getCoverageAmount)
                .filter(Objects::nonNull)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("patientId", patientId);
        result.put("estimatedAmount", estimateAmount);
        result.put("coverage", coverage);
        result.put("eligible", coverage.compareTo(estimateAmount) >= 0);
        return result;
    }

    public Map<String, Object> addLabTestAndRisk(LabTest labTest) {
        if (labTest.getResultValue() != null && labTest.getResultValue() > 140) {
            labTest.setStatus("abnormal");
        } else {
            labTest.setStatus("normal");
        }
        LabTest saved = labTestRepository.save(labTest);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("labTest", saved);
        response.put("riskAlert", "abnormal".equals(saved.getStatus()) ? "Warning: Please consult doctor" : "No immediate risk");
        return response;
    }

    public Map<String, Object> dispenseMedicine(String medicineName, Integer units) {
        PharmacyItem item = pharmacyItemRepository.findByMedicineNameIgnoreCase(medicineName).orElseThrow();
        int available = item.getAvailableUnits() == null ? 0 : item.getAvailableUnits();
        if (units == null || units <= 0) units = 1;
        if (available < units) {
            Map<String, Object> out = new LinkedHashMap<>();
            out.put("status", "failed");
            out.put("reason", "Insufficient stock");
            out.put("available", available);
            return out;
        }
        item.setAvailableUnits(available - units);
        pharmacyItemRepository.save(item);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("status", "success");
        out.put("remainingUnits", item.getAvailableUnits());
        out.put("message", "Automated pharmacy dispensing simulation complete");
        return out;
    }

    public Map<String, Object> smartQueueDisplay(Long doctorId) {
        List<Appointment> appts = appointmentRepository.findByDoctorId(doctorId).stream()
                .filter(a -> a.getTokenNumber() != null && !"cancelled".equalsIgnoreCase(a.getStatus()))
                .sorted(Comparator.comparing(Appointment::getTokenNumber))
                .toList();

        Map<String, Object> display = new LinkedHashMap<>();
        display.put("doctorId", doctorId);
        display.put("currentToken", appts.isEmpty() ? null : appts.get(0).getTokenNumber());
        display.put("nextToken", appts.size() < 2 ? null : appts.get(1).getTokenNumber());
        display.put("room", "Room-" + doctorId);
        display.put("estimatedWaitMinutes", appts.isEmpty() ? 0 : appts.get(0).getTokenNumber() * 7);
        return display;
    }

    public SseEmitter subscribeQueueDisplay(Long doctorId) {
        SseEmitter emitter = new SseEmitter(0L);
        queueEmitters.put(emitter, doctorId);
        emitter.onCompletion(() -> queueEmitters.remove(emitter));
        emitter.onTimeout(() -> queueEmitters.remove(emitter));
        emitter.onError((ex) -> queueEmitters.remove(emitter));
        try {
            emitter.send(SseEmitter.event().name("connected").data(Map.of("doctorId", doctorId, "message", "Queue stream connected")));
            emitter.send(SseEmitter.event().name("queue").data(smartQueueDisplay(doctorId)));
        } catch (Exception ex) {
            emitter.completeWithError(ex);
            queueEmitters.remove(emitter);
        }
        return emitter;
    }

    public Map<String, Object> createTelemedicineLink(Long appointmentId) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("appointmentId", appointmentId);
        out.put("meetingLink", "https://meet.hospital.local/session/" + appointmentId);
        out.put("status", "active");
        return out;
    }

    public Map<String, Object> kioskCheckin(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow();
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("appointmentId", appointmentId);
        out.put("patientName", appointment.getPatient() != null ? appointment.getPatient().getName() : "Patient");
        out.put("token", appointment.getTokenNumber());
        out.put("queueRoom", "Room-" + (appointment.getDoctor() != null ? appointment.getDoctor().getId() : "NA"));
        out.put("status", "checked-in");
        return out;
    }

    public Map<String, Object> kioskCheckinByPatient(Long patientId, Long doctorId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        LocalDate today = LocalDate.now();

        Appointment appointment = appointmentRepository.findByPatientId(patientId).stream()
                .filter(a -> a.getDoctor() != null && Objects.equals(a.getDoctor().getId(), doctorId))
                .filter(a -> today.equals(a.getAppointmentDate()))
                .filter(a -> !"cancelled".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .orElseGet(() -> {
                    Appointment a = new Appointment();
                    a.setPatient(patient);
                    a.setDoctor(doctor);
                    a.setAppointmentDate(today);
                    a.setAppointmentTime(LocalTime.now().plusMinutes(10));
                    a.setStatus("scheduled");
                    int token = appointmentRepository.findByAppointmentDateAndDoctorId(today, doctorId).stream()
                            .filter(x -> !"cancelled".equalsIgnoreCase(x.getStatus()))
                            .map(Appointment::getTokenNumber)
                            .filter(Objects::nonNull)
                            .max(Integer::compareTo)
                            .orElse(0) + 1;
                    a.setTokenNumber(token);
                    return appointmentRepository.save(a);
                });

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("appointmentId", appointment.getId());
        out.put("patientId", patientId);
        out.put("patientName", patient.getName());
        out.put("doctorId", doctorId);
        out.put("doctorName", doctor.getName());
        out.put("token", appointment.getTokenNumber());
        out.put("queueRoom", "Room-" + doctorId);
        out.put("status", "checked-in");
        out.put("checkedInAt", LocalDateTime.now());
        return out;
    }

    public Map<String, Object> paperlessRecords(Long patientId) {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("patient", patientRepository.findById(patientId).orElseThrow());
        out.put("appointments", appointmentRepository.findByPatientId(patientId));
        out.put("medicalRecords", medicalRecordRepository.findByPatientId(patientId));
        out.put("prescriptions", prescriptionRepository.findByPatientId(patientId));
        out.put("labTests", labTestRepository.findByPatientId(patientId));
        out.put("billing", billingRepository.findByPatientId(patientId));
        out.put("insurance", insuranceRepository.findByPatientId(patientId));
        out.put("familyMembers", familyMemberRepository.findByPatientId(patientId));
        out.put("generatedAt", LocalDateTime.now());
        return out;
    }

    public FamilyMember addFamilyMember(FamilyMember familyMember) {
        return familyMemberRepository.save(familyMember);
    }

    public List<FamilyMember> getFamilyMembers(Long patientId) {
        return familyMemberRepository.findByPatientId(patientId);
    }

    private void pushQueueDisplayUpdates() {
        List<Map.Entry<SseEmitter, Long>> entries = new ArrayList<>(queueEmitters.entrySet());
        for (Map.Entry<SseEmitter, Long> entry : entries) {
            SseEmitter emitter = entry.getKey();
            Long doctorId = entry.getValue();
            try {
                emitter.send(SseEmitter.event().name("queue").data(smartQueueDisplay(doctorId)));
            } catch (Exception ex) {
                emitter.complete();
                queueEmitters.remove(emitter);
            }
        }
    }
}
