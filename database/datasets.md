# Dataset Integration Notes

This project supports database seeding from real/public medical datasets. Use this flow for production-like demos:

1. Download public datasets (for example Kaggle diabetes/heart disease CSVs, WHO health indicators, OpenFDA exports).
2. Normalize fields to `patient`, `lab_test`, `prescription`, and `pharmacy_item` schema.
3. Import mapped records via MySQL `LOAD DATA` or ETL script.

## Starter SQL
- `database/dataset_seed.sql` provides baseline seeded records so all modules can run end-to-end immediately.

## Recommended Real Sources
- Kaggle: Diabetes, heart disease, appointment no-show datasets
- OpenFDA: drug labels, recalls, adverse events
- WHO: global disease and risk statistics

## Import Pattern
```sql
LOAD DATA LOCAL INFILE 'patients.csv'
INTO TABLE patient
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(name, age, gender, contact, address, email, @plain_password)
SET password = '$2a$10$hHe2wd3RB3ikj8x8Wopx9uGGoGkUCw6hvvn6G3HtvVoiEml7N2yy6', role='PATIENT';
```

Use hashed passwords for imports. Never store plaintext passwords in dataset files.
