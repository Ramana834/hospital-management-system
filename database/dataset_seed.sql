-- Optional richer seed data for demo environments
USE hospital_db;

-- Doctors (public-style synthetic records for demo)
INSERT INTO doctor (name, specialization, contact, email, password, role, available_slots)
VALUES
('Dr. Karthik Rao', 'Cardiology', '9000011111', 'dr.karthik@mahalakshmi.health', '$2a$10$5x5Msmn74NBfXxSpB8F7LuHm9smQMI0fUkXW2QlcY5ct9dER1YzEm', 'DOCTOR', '["09:00","09:30","10:00"]'),
('Dr. Ananya Devi', 'General Medicine', '9000022222', 'dr.ananya@mahalakshmi.health', '$2a$10$5x5Msmn74NBfXxSpB8F7LuHm9smQMI0fUkXW2QlcY5ct9dER1YzEm', 'DOCTOR', '["11:00","11:30","12:00"]')
ON DUPLICATE KEY UPDATE specialization=VALUES(specialization);

INSERT INTO patient (name, age, gender, contact, address, email, password, role)
VALUES
('Lakshmi Priya', 34, 'Female', '9000033333', 'Hyderabad', 'patient.demo@mahalakshmi.health', '$2a$10$hHe2wd3RB3ikj8x8Wopx9uGGoGkUCw6hvvn6G3HtvVoiEml7N2yy6', 'PATIENT')
ON DUPLICATE KEY UPDATE contact=VALUES(contact);

INSERT INTO pharmacy_item (medicine_name, available_units, unit_price)
VALUES
('Paracetamol 650', 400, 2.50),
('Metformin 500', 260, 4.75)
ON DUPLICATE KEY UPDATE available_units=VALUES(available_units), unit_price=VALUES(unit_price);
