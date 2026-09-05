# HONEYCHAIN — DATA SOURCE & SECURITY AUDIT (PHASE 10A)

This document provides a comprehensive audit of all business data displayed in the HoneyChain platform, tracing every UI element to its authoritative database repository and service layer.

---

## 1. Data Source Mapping Matrix

| UI Component / Feature | Displayed Field | Data Source (Backend / DB) | Mechanism |
|---|---|---|---|
| **Beekeeper Profile** | Beekeeper Name, Village, KVIC ID, Lat/Long, Preferred Language | `MySQL` → `beekeeper_profiles` table | `BeekeeperProfileRepository.findByUserId()` |
| **Beekeeper Profile** | KVIC Verification Status (`APPROVED` / `PENDING` / `REJECTED`) | `MySQL` → `beekeeper_profiles.verification_status` | `BeekeeperProfileService.getProfile()` |
| **Hive Management** | Hive Code (`HIVE-XXXX`), Cluster Name, Location, Installation Date | `MySQL` → `hives` table | `HiveRepository.findAllByBeekeeperProfileId()` |
| **Hive Management** | Operational Lifecycle Status (`ACTIVE` / `INACTIVE`) | `MySQL` → `hives.status` | `HiveRepository.findByIdAndBeekeeperProfileId()` |
| **Beekeeper Dashboard** | Registered Hives Count | `MySQL` → `COUNT(hives)` | `HiveRepository.countByBeekeeperProfileId()` |
| **Beekeeper Dashboard** | Total Batches Count | `MySQL` → `COUNT(honey_batches)` | `HoneyBatchRepository.countByBeekeeperProfileId()` |
| **Beekeeper Dashboard** | Batches in Testing Count | `MySQL` → `COUNT(honey_batches WHERE status='SENT_FOR_TESTING')` | `HoneyBatchRepository.countByBeekeeperProfileIdAndStatus()` |
| **Beekeeper Dashboard** | IoT Hive Health Stats (`HEALTHY`, `WATCH`, `ALERT` counts) | `MySQL` → `hive_sensor_data` + `HiveHealthService` | `GET /api/beekeepers/hives/health` (Real-time DB query + Rule Engine) |
| **Honey Batches** | Batch ID (`HC-YYYY-XXXXXXXX`), Harvest Date, Quantity (KG), Photo URL | `MySQL` → `honey_batches` table | `HoneyBatchRepository.findAllByBeekeeperProfileId()` |
| **Honey Batches** | Lifecycle Status (`CREATED` → `SENT_FOR_TESTING` → `PURE` / `FAILED` → `QR_GENERATED`) | `MySQL` → `honey_batches.status` | `HoneyBatchRepository.findByBatchIdAndBeekeeperProfileId()` |
| **Blockchain Verification** | Block Number, Data Hash (SHA-256), Tx Hash, Network, Recorded Timestamp | `MySQL` → `blockchain_records` table | `BlockchainRecordRepository.findByBatchIdAndRecordType()` |
| **Lab Quality Testing** | Purity Score (%), Result (`PURE`, `UNDER_REVIEW`, `FAILED`), Remarks, Certificate PDF | `MySQL` → `lab_tests` table | `LabTestRepository.findByBatchId()` |
| **QR Code Passport** | QR PNG URL, Direct Verification Target URL | `MySQL` → `qr_codes` table | `QrCodeRepository.findByBatchId()` |
| **Public Verification** | Cryptographic Provenance, Honey Timeline, Supply Chain Milestones | Real-time SHA-256 Hash Recalculation + `blockchain_records` | `PublicVerificationService.verifyBatch()` |
| **Verification History** | Total Scans Count, Anti-Counterfeit Risk Level (`NORMAL`, `WATCH`, `HIGH_RISK`), Recent Events | `MySQL` → `verification_histories` table | `VerificationHistoryRepository.countByBatchId()` + `VerificationRiskService` |
| **IoT Hive Health** | Real-time Temperature (°C), Humidity (%), Acoustic Bee Activity (0-100) | `MySQL` → `hive_sensor_data` table | `IoTService.getLatestSensorData()` |
| **IoT History Chart** | Time-series Telemetry Trend | `MySQL` → `hive_sensor_data` table (Paginated/Indexed) | `HiveSensorDataRepository.findByHiveIdOrderByRecordedAtDesc()` |
| **Admin Control Center** | Total Users, Beekeepers, Hives, Batches, Lab Tests | `MySQL` → Real-time `COUNT(*)` across entities | `GET /api/admin/stats` |

---

## 2. Security & Data Isolation Guarantees

1. **Strict User Identity Derivation**:
   - Identity is always derived from authenticated JWT claims (`Authentication.getName()`).
   - No hardcoded `userId = 1` or query parameter injection is permitted.
   - Cross-beekeeper resource queries result in `400 Bad Request` or `404 Not Found`.

2. **Database Credentials & Secrets Protection**:
   - Zero hardcoded passwords in Java source, React frontend, Dockerfiles, or Git history.
   - MySQL credentials use external environment variables:
     - `DB_URL=${DB_URL:...}`
     - `DB_USERNAME=${DB_USERNAME:...}`
     - `DB_PASSWORD=${DB_PASSWORD:...}`
   - Protected by `.gitignore` rules covering `.env`, `.env.*`, `application-local.properties`.

3. **Privacy-Preserving Anti-Counterfeit Telemetry**:
   - Consumer verification scans do not store raw IP addresses or device serial numbers.
   - One-way salted SHA-256 fingerprints are generated server-side.
   - 5-second debounce window prevents scan count inflation.

4. **Clean Startup Policy (No Fake Business Data)**:
   - `app.demo-data.enabled=false` by default.
   - Fresh application startup begins with an empty business database.
   - Users provide their own authentic data through forms.
   - Empty states are explicitly rendered with helpful onboarding prompts.

5. **Simulated Hardware Boundaries**:
   - `MockIoTService` produces telemetry persisted directly to `hive_sensor_data` table.
   - `MockBlockchainService` stores canonical SHA-256 hashes in `blockchain_records` table.
   - Both mock layers reside behind standard service interfaces, allowing drop-in replacement with real MQTT/Hyperledger nodes.
