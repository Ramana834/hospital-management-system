# MahaLakshmi Multi Speciality Hospital Management System

## Stack
- Backend: Java Spring Boot 3, Spring Security (JWT), JPA
- Database: MySQL
- Frontend: React + Bootstrap + Axios
- Automation: Scheduler (`@Scheduled`) + SSE stream for live emergency queue

## Implemented Modules (Submission Ready)
- Patient module: registration, secure login, profile, appointments, records, family members
- Doctor module: registration, secure login, assigned patients, appointment queue
- Appointment & queue: booking, cancellation, rescheduling, token generation, slot conflict checks
- Emergency priority system: Java `PriorityQueue`, auto-reschedule impact flagging, live queue stream (`/api/emergency/stream`)
- Billing: generate bill, payment simulation, invoice text + downloadable PDF invoice
- Admin panel APIs: snapshot analytics, doctor performance, emergency monitoring
- AI endpoints: doctor recommendation, disease prediction, prescription/report analyzer (text + file upload), chatbot, voice guidance text
- Smart automation: reminders, risk alerts, ambulance tracking simulation, health monitor simulation
- Real-hospital features: surgery, bed management, pharmacy inventory/dispense, insurance eligibility, telemedicine link, kiosk check-in

## Security
- BCrypt password hashing
- JWT-based stateless authentication
- Role model: `PATIENT`, `DOCTOR`, `ADMIN`
- Protected APIs by default (`/api/auth/**` open for login/register)

## Default Admin
- Username: `admin`
- Password: `admin123`

## Demo Login Accounts (Auto-Seeded on Startup)
- Patient: `patient.demo@mahalakshmi.health` / `patient123`
- Doctor: `dr.karthik@mahalakshmi.health` / `doctor123`
- Doctor: `dr.ananya@mahalakshmi.health` / `doctor123`

## Key API Paths
- Auth: `/api/auth/...`
- Patients: `/api/patients/...`
- Doctors: `/api/doctors/...`
- Appointments: `/api/appointments/...`
- Emergency: `/api/emergency/...`
- Advanced hospital + AI: `/api/advanced/...`
- Smart automation: `/api/smart/...`

## Setup

### Database
1. Create MySQL database and run [`database/schema.sql`](database/schema.sql)
2. Update DB credentials in [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties)

### Backend
1. `cd backend`
2. `./apache-maven-3.9.9/bin/mvn.cmd spring-boot:run`

### Frontend
1. `cd frontend`
2. `Copy-Item .env.example .env`
3. `npm install`
4. `npm start`
5. Production build:
   - PowerShell: `$env:BUILD_PATH='dist-submit'; npm run build`
   - If OneDrive lock occurs, use a new output folder:
     - `$env:BUILD_PATH='dist-verified'; npm run build`

## Quick 1-Hour Demo Run (Recommended)
1. Start MySQL and create `hospital_db` if not exists.
2. Run schema and seed files:
   - `database/schema.sql`
   - `database/dataset_seed.sql`
3. Set backend env vars (optional if using defaults):
   - `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `SERVER_PORT`
4. Run backend:
   - `cd backend`
   - `./apache-maven-3.9.9/bin/mvn.cmd spring-boot:run`
5. Run frontend:
   - `cd frontend`
   - `$env:REACT_APP_API_BASE='http://localhost:8080/api'`
   - `npm start`
6. Login quickly with demo users:
   - Admin: `admin / admin123`
   - Patient: `patient.demo@mahalakshmi.health / patient123`
   - Doctor: `dr.karthik@mahalakshmi.health / doctor123`

## Project Cleanup and Final Packaging
Use PowerShell from project root:
1. Optional cleanup of generated artifacts:
   `.\cleanup-artifacts.ps1`
2. Create a single final delivery zip:
   `.\package-project.ps1`

Final output is always:
`.\release\hospital-management-final.zip`

## Notes
- AI OCR/NLP/report intelligence is implemented in backend with rule-based analyzers and file-upload parsing, and is structured so Python OCR/NLP services can be plugged in without API changes.
- Disclaimer: This system provides assistance only and is not a replacement for professional medical advice.

## Production Integration Switches
Set these in `backend/src/main/resources/application.properties`:
- `notification.email.enabled=true` and valid `spring.mail.*` values for real email delivery
- `notification.sms.enabled=true`, `notification.sms.provider-url`, `notification.sms.api-key` for real SMS gateway delivery
- `payment.gateway.enabled=true`, `payment.gateway.url`, `payment.gateway.api-key` for real payment processing
- `ai.external.enabled=true`, `ai.external.base-url`, `ai.external.api-key` for Python OCR/NLP/ML API integration

## Real-Time APIs
- Emergency queue SSE: `/api/emergency/stream`
- Smart queue SSE: `/api/advanced/queue/display/stream/{doctorId}`
- Vitals SSE: `/api/smart/health-monitor/stream/{patientId}`
- Ambulance SSE: `/api/smart/ambulance-track/stream/{ambulanceId}`
